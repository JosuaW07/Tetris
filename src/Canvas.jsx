import React, {useEffect, useRef} from 'react'
import DrawGrid from "./DrawGrid.js";

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
        blockcoloring(false)
        if (ismovevalide(sidemovement, downmovement, newShape)) {
            posXRef.current += sidemovement;
            posYRef.current += downmovement;
            currentshapeRef.current = newShape;
        } else if (downmovement > 0) {
            blockcoloring(true)
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


    useEffect(() => {
        spawnblock()
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        let animationId;

        let lasttime = 0;
        let accumulator = 0;



        function update(currentTime) {
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
    }, [])
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key.toLowerCase() === "a") moveBlock(-1, 0);
            if (e.key.toLowerCase() === "d") moveBlock(+1, 0);
            if (e.key === " " || e.key.toLowerCase() === "w") rotateShape();
            if (e.key.toLowerCase() === "s") moveBlock(0, +1)
        };

        window.addEventListener('keydown', handleKey);

        return () => {
            window.removeEventListener('keydown', handleKey);
        };
    }, []);


    return <canvas ref={canvasRef} width={width} height={height}/>

}

export default Canvas