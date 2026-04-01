export default function DrawGrid(ctx, width, columns, rows, gap, grid, canvas) {
    const gridelementsize = (width - gap * (columns + 1)) / columns

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


    grid.forEach((row, posY) => {
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

            const gridposX = posX * (gridelementsize + gap);
            const gridposY = posY * (gridelementsize + gap);
            ctx.fillStyle = secColor
            ctx.fillRect(gridposX, gridposY, gridelementsize + 2 * gap, gridelementsize + 2 * gap)
            ctx.fillStyle = priColor
            ctx.fillRect(gridposX + gap, gridposY + gap, gridelementsize, gridelementsize)
        })
    })
}