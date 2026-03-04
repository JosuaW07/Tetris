import React, {useRef, useEffect} from 'react'

const Canvas = ({width, height, gap}) => {

    const colums = 10
    const rows = 2 * colums
    const canvasRef = useRef(null)
    const gridelementsize = (width - gap * (colums + 1)) / colums
    const gridRef = useRef(Array.from({length: rows}, () => Array(colums).fill(0)));
    const grid = gridRef.current;
    const posXRef = useRef(5)
    const posYRef = useRef(0)


    const drawbackground = (ctx, canvas) => {
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        for (let j = 0; j !== rows; j++) {
            let posY = gap + j * (gap + gridelementsize)

            for (let x = 0; x !== colums; x++) {
                let posX = gap + x * (gap + gridelementsize)
                ctx.fillStyle = '#303030'
                ctx.fillRect(posX, posY, gridelementsize, gridelementsize)
            }
        }
    }

    const drawgrid = (ctx, gridsize) => {

        grid.forEach((row, posY) => {
            row.forEach((colorcode, posX) => {
                let priColor, secColor
                if (colorcode === 0) {
                    return
                }
                if (colorcode === 1) {
                    priColor = "#4ddd3b"
                    secColor = "#004e00"
                }
                if (colorcode === 2) {
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

    const controllingblock = (posX, posY, draw) => {

        oblock(posX, posY, draw).forEach((coordinate) => {
            grid[coordinate.y][coordinate.x] = coordinate.color
        })
    }


    const oblock = (posX, posY, draw) => {

        let colorcode;

        if (draw) {
            colorcode = 1;
        } else {
            colorcode = 0;
        }

        return [
            {y: posY, x: posX, color: colorcode},
            {y: posY, x: posX + 1, color: colorcode},
            {y: posY + 1, x: posX, color: colorcode},
            {y: posY + 1, x: posX + 1, color: colorcode},
        ]
    }

    const tblock = (posX, posY, draw) => {
        let colorcode;

        if (draw) {
            colorcode = 2;
        } else {
            colorcode = 0;
        }

        return [
            {y: posY, x: posX, color: colorcode},
            {y: posY, x: posX + 1, color: colorcode},
            {y: posY, x: posX + 2, color: colorcode},
            {y: posY + 1, x: posX + 1, color: colorcode},
            {y: posY + 2, x: posX + 1, color: colorcode},
        ]
    }

    const moveBlock = (direction) => {
        posXRef.current += direction;
    }


    useEffect(() => {
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

            const currentY = posYRef.current;
            const currentX = posXRef.current;

            controllingblock(currentX, currentY, false)

            if (accumulatorslow > slowinterval) {
                posYRef.current += 1;
                accumulatorslow -= slowinterval;
                console.log("drop")
            }

            controllingblock(posXRef.current, posYRef.current, true)
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
            if (e.key.toLowerCase() === "a") moveBlock(-1);
            if (e.key.toLowerCase() === "d") moveBlock(+1);
        };


        window.addEventListener('keydown', handleKey);

        return () => {
            window.removeEventListener('keydown', handleKey);
        };
    }, []);


    return <canvas ref={canvasRef} width={width} height={height}/>

}

export default Canvas