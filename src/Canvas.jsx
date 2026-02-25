import React, {useRef, useEffect} from 'react'

const Canvas = ({width, height, gap}) => {

    const colums = 10
    const rows = 2 * colums
    const canvasRef = useRef(null)
    const gridelementsize = (width - gap * (colums + 1)) / colums
    const speed = 1000
    const gridRef = useRef(Array.from({length: rows}, () => Array(colums).fill(0)));
    const grid = gridRef.current;


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


    const oblock = (posX, posY, draw) => {
        let colorcode;

        if (draw) {
            colorcode = 2;
        } else {
            colorcode = 0;
        }

        grid[posY][posX] = colorcode;
        grid[posY][posX + 1] = colorcode;
        grid[posY + 1][posX] = colorcode;
        grid[posY + 1][posX + 1] = colorcode;
    }


    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        drawbackground(ctx, canvas)

        let posY = 2

        function update() {
            oblock(1, posY, false)
            posY += 1;
            oblock(1, posY, true)
            console.log(JSON.stringify(grid))
            drawbackground(ctx, canvas, gridelementsize)
            drawgrid(ctx, gridelementsize)
        }

        setInterval(update, speed)

    }, [])


    return <canvas ref={canvasRef} width={width} height={height}/>

}

export default Canvas