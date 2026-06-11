import React, {useEffect, useRef} from 'react'
import DrawGrid from "./DrawGrid.js";
import blocklanding from "./assets/long.mp3";
import deleterow from "./assets/short.mp3"
import useSound from "use-sound";

const initialGrid = (rows, columns) => Array.from({length: rows}, () => Array(columns).fill(0))

const Canvas = ({width, height, gap, UpdateScore, UpdateLevel, CurrentLevel, Changeblock, newblock}) => {

    const columns = 10
    const rows = 20
    const canvasRef = useRef(null)

    const gridRef = useRef(initialGrid(rows, columns));

    const initialPosX = 5;
    const initialPosY = -2;

    const initialInterval = 1000
    const interval = useRef(initialInterval)

    const posXRef = useRef(initialPosX)
    const posYRef = useRef(initialPosY)

    const removedrows = useRef(0)
    const levelRef = useRef(CurrentLevel)

    const currentshapeRef = useRef(null)
    const colorcodeRef = useRef(0)
    const currentnameRef = useRef(null)


    const shortSoundRef = useRef();
    const longSoundRef = useRef();

    const [playblocklanding] = useSound(blocklanding);
    const [playdeleterow] = useSound(deleterow);

    useEffect(() => {
        shortSoundRef.current = playblocklanding;
        longSoundRef.current = playdeleterow;
    }, [playblocklanding, playdeleterow]);


    const spawnblock = () => {
        console.log("spawn")
        if (!newblock) return;

        posXRef.current = initialPosX
        posYRef.current = initialPosY

        currentshapeRef.current = newblock.shape
        colorcodeRef.current = newblock.color
        currentnameRef.current = newblock.name

    }

    useEffect(() => {
        if (newblock && !currentshapeRef.current) {
            spawnblock();
        }
    }, [newblock]);

    useEffect(() => {
        levelRef.current = CurrentLevel;
    }, [CurrentLevel]);


    const blockcoloring = (isDrawing) => {

        const colorCode = isDrawing ? colorcodeRef.current : 0;

        currentcoordinates().forEach((coordinate) => {
            if (!currentshapeRef.current) return;
            if (gridRef.current[coordinate.y] !== undefined) {
                gridRef.current[coordinate.y][coordinate.x] = colorCode
            }
        })

    }

    const moveBlock = (sidemovement, downmovement, newShape = currentshapeRef.current) => {
        if (!newShape) return;
        blockcoloring(false)
        if (ismovevalide(sidemovement, downmovement, newShape)) {
            if (!newShape) return false;
            posXRef.current += sidemovement;
            posYRef.current += downmovement;
            currentshapeRef.current = newShape;
        } else if (downmovement > 0) {
            blockcoloring(true)

            if (shortSoundRef.current) {
                shortSoundRef.current();
            }
            checkgrid()
            if (currentcoordinates().some(coordinate => coordinate.y <= 0)) {
                gameover()
                spawnblock()
            } else {
                Changeblock()
                currentshapeRef.current = null
                spawnblock()
            }
        }
        blockcoloring(true)
    }

    const harddrop = () => {
        if (!currentshapeRef.current) return;

        blockcoloring(false);

        let distance = 0;

        while (ismovevalide(0, distance + 1, currentshapeRef.current)) {
            distance++;
        }

        if (distance > 0) {
            posYRef.current += distance;
        }

        blockcoloring(true);
        moveBlock(0, 1)
    }

    const gameover = () => {
        gridRef.current = initialGrid(rows, columns);
        UpdateScore(0);
        UpdateLevel(0)
    }

    const ismovevalide = (sidemovement, downmovement, newShape) => {

        const isvalide = newShape.every(block => {
            const x = block.x + posXRef.current + sidemovement
            const y = block.y + posYRef.current + downmovement
            return (x >= 0 && x < columns && y < rows && (y < 0 || gridRef.current[y][x] === 0)
            )
        })

        return isvalide

    }
    const checkgrid = () => {
        const newgrid = gridRef.current.filter(row => row.some(coordinate => coordinate === 0))
        if (newgrid.length < rows) {
            const removedrows = rows - newgrid.length
            calcScore(removedrows)
            calcLevel(removedrows)
            for (let i = 0; i <= removedrows; i++) {
                setTimeout(() => {
                    if (longSoundRef.current) {
                        longSoundRef.current();
                    }
                }, i * 100
                )
            }
            const emmtyrows = Array.from({length: removedrows}, () => Array(columns).fill(0))

            gridRef.current = [...emmtyrows, ...newgrid]
        }
    }

    const pointsperrow = [0, 40, 100, 300, 1200]
    const calcScore = (removedrows) => {
        const points = pointsperrow[removedrows] * (levelRef.current + 1)
        UpdateScore(score => score + points)
    }

    const calcLevel = (newremovedrows) => {
        removedrows.current += newremovedrows;
        if (removedrows.current >= 10) {
            const newLevel = levelRef.current + 1

            UpdateLevel(newLevel)
            interval.current = initialInterval * Math.pow(0.9, newLevel);
            removedrows.current -= 10;
        }
    }


    const rotateShape = () => {
        if (!currentshapeRef.current || currentnameRef.current === "O") {
            return;
        }
        console.log(currentnameRef.current)
        blockcoloring(false)
        const rotated = currentshapeRef.current.map(block => ({
                x: -block.y,
                y: block.x
            })
        );

        moveBlock(0, 0, rotated);

    }

    const currentcoordinates = () => {
        if (!currentshapeRef.current) return [];
        return currentshapeRef.current.map(block => ({
            x: block.x + posXRef.current,
            y: block.y + posYRef.current,
            color: 2
        }));
    }

    const keypress = useRef({})
    const lastInputTime = useRef({a: 0, d: 0, s: 0, rotate: 0, harddrop: 0});

    useEffect(() => {

        const moveCooldown = 120;

        const handleKeyDown = (e) => {
            const key = e.key.toLowerCase();
            keypress.current[key] = true;
        };

        const handleKeyUp = (e) => {
            const key = e.key.toLowerCase();
            keypress.current[key] = false;

            if (key === "w") {
                lastInputTime.current.rotate = 0;
            }

            if (key === " ") {
                lastInputTime.current.harddrop = 0;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);


        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);


    useEffect(() => {
            spawnblock()
            const canvas = canvasRef.current
            const ctx = canvas.getContext('2d')
            let animationId;

            let lasttime = 0;
            let accumulator = 0;


            function update(currentTime) {

                const cooldown = 90


                if (keypress.current["a"]) {
                    if (currentTime - lastInputTime.current.a > cooldown) {
                        moveBlock(-1, 0);
                        lastInputTime.current.a = currentTime;
                    }
                }

                if (keypress.current["d"]) {
                    if (currentTime - lastInputTime.current.d > cooldown) {
                        moveBlock(1, 0);
                        lastInputTime.current.d = currentTime;
                    }
                }
                if (keypress.current["s"]) {
                    if (currentTime - lastInputTime.current.s > cooldown) {
                        moveBlock(0, 1);
                        lastInputTime.current.s = currentTime;
                    }
                }
                if (keypress.current["w"]) {
                    if (lastInputTime.current.rotate === 0) {
                        rotateShape();
                        lastInputTime.current.rotate = 1;
                    }
                }

                if (keypress.current[" "]) {
                    if (lastInputTime.current.harddrop === 0) {
                        harddrop()
                        lastInputTime.current.harddrop = 1;
                    }
                }


                if (!lasttime) lasttime = currentTime;
                let deltatime = (currentTime - lasttime);
                lasttime = currentTime;

                accumulator += deltatime;


                if (accumulator > interval.current) {
                    moveBlock(0, 1)
                    accumulator -= interval.current;
                }


                DrawGrid(ctx, width, columns, rows, gap, gridRef.current, canvas)

                animationId = requestAnimationFrame(update);
            }

            animationId = requestAnimationFrame(update);

            return () => {
                cancelAnimationFrame(animationId);
            }
        }, []
    )


    return <canvas ref={canvasRef} width={width} height={height}/>

}

export default Canvas