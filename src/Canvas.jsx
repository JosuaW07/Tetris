import React, {useRef, useEffect} from 'react'

const Canvas = ({width, height, gap}) => {

    const colums = 10
    const rows = 2 * colums
    const canvasRef = useRef(null)
    const gridelementsize = (width - gap * (colums + 1)) / colums
    const speed = 1000


    const drawgrid = (ctx, canvas, C) => {
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

    const block = (ctx, gridsize, posX, posY, priColor, secColor) => {
        const gridposX = posX * (gridsize + gap);
        const gridposY = posY * (gridsize + gap);
        ctx.fillStyle = secColor
        ctx.fillRect(gridposX, gridposY, gridsize + 2 * gap, gridsize + 2 * gap)
        ctx.fillStyle = priColor
        ctx.fillRect(gridposX + gap, gridposY + gap, gridsize, gridsize)
    }

    const oblock = (ctx, gridsize, posX, posY) => {
        const priColor = "#4ddd3b"
        const secColor = "#004e00"
        block(ctx, gridsize, posX, posY, priColor, secColor)
        block(ctx, gridsize, posX + 1, posY, priColor, secColor)
        block(ctx, gridsize, posX, posY + 1, priColor, secColor)
        block(ctx, gridsize, posX + 1, posY + 1, priColor, secColor)
    }

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        drawgrid(ctx, canvas)

        let posY = 2

        function update() {
            drawgrid(ctx, canvas, gridelementsize)
            oblock(ctx, gridelementsize, 3, posY)
            posY += 1;
        }

        setInterval(update, speed)

    }, [])


    return <canvas ref={canvasRef} width={width} height={height}/>

}

export default Canvas