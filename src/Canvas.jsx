import React, {useRef, useEffect} from 'react'

const Canvas = ({width, height, gap}) => {

    const canvasRef = useRef(null)
    const gridsize = (width / 10 + 2 / gap)
    const speed = 1000

    const grid = (ctx, canvas, gridsize) => {
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        for (let j = 0; j < 19; j++) {
            let posY = gap + j * (gap + gridsize)

            for (let x = 0; x < 10; x++) {
                let posX = gap + x * (gap + gridsize)
                ctx.fillStyle = '#303030'
                ctx.fillRect(posX, posY, gridsize, gridsize)
                console.log(gap)
                console.log(posX)
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

        grid(ctx, canvas)

        let posY = 2

        function update() {
            grid(ctx, canvas, gridsize)
            oblock(ctx, gridsize, 3, posY)
            posY += 1;
        }

        setInterval(update, speed)

    }, [])


    return <canvas ref={canvasRef} width={width} height={height}/>

}

export default Canvas