import React, {use, useEffect, useRef, useState} from 'react'

const initialGrid = (rows, columns) => Array.from({length: rows}, () => Array(columns).fill(0))

const Canvas = ({width, height, gap, UpdateScore, UpdateLevel, CurrentLevel}) => {

    const columns = 10
    const rows = 2 * columns
    const canvasRef = useRef(null)
    const gridelementsize = (width - gap * (columns + 1)) / columns

    const gridRef = useRef(initialGrid(rows, columns));

    const initialPosX = 5;
    const initialPosY = -3;


    const posXRef = useRef(initialPosX)
    const posYRef = useRef(initialPosY)
    const colorcodeRef = useRef(null)

    const removedrows = useRef(0)
    const levelRef = useRef(CurrentLevel)
    useEffect(() => {
        levelRef.current = CurrentLevel;
    }, [CurrentLevel]);

    const tshape = [
        {y: -1, x: 0},
        {y: 0, x: -1},
        {y: 0, x: 0},
        {y: 0, x: +1}
    ]

    const oshape = [
        {y: 0, x: 0},
        {y: 0, x: 1},
        {y: 1, x: 0},
        {y: 1, x: 1},
    ]

    const ishape = [
        {y: -2, x: 0},
        {y: -1, x: 0},
        {y: 0, x: 0},
        {y: +1, x: 0},
    ]

    const lshape = [
        {y: -1, x: 0},
        {y: 0, x: 0},
        {y: 1, x: 0},
        {y: 1, x: 1}
    ];

    const jshape = [
        {y: -1, x: 0},
        {y: 0, x: 0},
        {y: 1, x: 0},
        {y: 1, x: -1}
    ];

    const sshape = [
        {y: 0, x: 0},
        {y: 0, x: 1},
        {y: 1, x: 0},
        {y: 1, x: -1}
    ];

    const zshape = [
        {y: 0, x: 0},
        {y: 0, x: -1},
        {y: 1, x: 0},
        {y: 1, x: 1}
    ];

    const currentshapeRef = useRef(ishape)
    const shapes = [oshape, tshape, ishape, lshape, jshape, sshape, zshape]

    const drawbackground = (ctx, canvas) => {
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        for (let j = 0; j !== rows; j++) {
            let posY = gap + j * (gap + gridelementsize)

            for (let x = 0; x !== columns; x++) {
                let posX = gap + x * (gap + gridelementsize)
                ctx.fillStyle = '#303030'
                ctx.fillRect(posX, posY, gridelementsize, gridelementsize)
            }
        }
    }

    const drawgrid = (ctx, gridsize) => {

        gridRef.current.forEach((row, posY) => {
            row.forEach((colorcode, posX) => {
                let priColor, secColor
                if (colorcode === 0) {
                    return
                }
                if (colorcode === 1) {
                    priColor = "#fae827"
                    secColor = "#a59805"
                }
                if (colorcode === 2) {
                    priColor = "#b128ff"
                    secColor = "#670280"
                }
                if (colorcode === 3) {
                    priColor = "#0dd1b0"
                    secColor = "#1d6ff4"
                }
                if (colorcode === 4) {
                    priColor = "#f8c700"
                    secColor = "#b5780f"
                }
                if (colorcode === 5) {
                    priColor = "#2462ff"
                    secColor = "#020e8e"
                }
                if (colorcode === 6) {
                    priColor = "#53ff00"
                    secColor = "#004e00"
                }
                if (colorcode === 7) {
                    priColor = "#ff0000"
                    secColor = "#8a0000"
                }

                const gridposX = posX * (gridsize + gap);
                const gridposY = posY * (gridsize + gap);
                ctx.fillStyle = secColor
                ctx.fillRect(gridposX, gridposY, gridsize + 2 * gap, gridsize + 2 * gap)
                ctx.fillStyle = priColor
                ctx.fillRect(gridposX + gap, gridposY + gap, gridsize, gridsize)
            })
        })
    }

    const blockcoloring = (isDrawing) => {

        const colorCode = isDrawing ? colorcodeRef.current : 0;

        currentcoordinates().forEach((coordinate) => {
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
                changeblock()
            } else {
                changeblock()
            }
        }
        blockcoloring(true)
    }

    const gameover = () => {
        posXRef.current = initialPosX;
        posYRef.current = initialPosY;
        gridRef.current = initialGrid(rows, columns);
        UpdateScore(0);
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
        if (removedrows.current > 10) {
            UpdateLevel(level => level + 1)
            removedrows.current -= newremovedrows;
        }
        console.log("updatecount", removedrows.current)
    }

    const changeblock = () => {
        const randomindex = (Math.floor(Math.random() * shapes.length))
        currentshapeRef.current = shapes[randomindex]
        posYRef.current = -3;
        posXRef.current = 5;
        colorcodeRef.current = randomindex + 1;
    }

    const rotateShape = () => {
        if (currentshapeRef.current !== oshape) {
            blockcoloring(false)
            const rotated = currentshapeRef.current.map(block => ({
                    x: -block.y,
                    y: block.x
                })
            );

            moveBlock(0, 0, rotated);
        }
    }

    const currentcoordinates = () => {
        return currentshapeRef.current.map(block => ({
            x: block.x + posXRef.current,
            y: block.y + posYRef.current,
            color: 2
        }));
    }


    useEffect(() => {
        changeblock()
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        let animationId;

        drawbackground(ctx, canvas)

        let lasttime = 0;
        let accumulatorslow = 0;
        const slowinterval = 1000;

        function update(currentTime) {
            if (!lasttime) lasttime = currentTime;
            let deltatime = (currentTime - lasttime);
            lasttime = currentTime;

            accumulatorslow += deltatime;


            if (accumulatorslow > slowinterval) {
                moveBlock(0, 1)
                accumulatorslow -= slowinterval;
            }

            drawbackground(ctx, canvas, gridelementsize)
            drawgrid(ctx, gridelementsize)


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