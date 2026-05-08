export default function DrawGrid(ctx, width, columns, rows, gap, grid, canvas) {
    const gridelementsize = (width - gap * (columns + 1)) / columns

    ctx.fillStyle = '#0048ff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (let j = 0; j !== rows; j++) {
        let posY = gap + j * (gap + gridelementsize)

        for (let x = 0; x !== columns; x++) {
            let posX = gap + x * (gap + gridelementsize)
            ctx.fillStyle = '#000000'
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
                priColor = "#ffff00"
                secColor = "#9a9a00"
            }
            if (colorcode === 2) {
                priColor = "#ff00ff"
                secColor = "#8b008b"
            }
            if (colorcode === 3) {
                priColor = "#00ffff"
                secColor = "#008b8b"
            }
            if (colorcode === 4) {
                priColor = "#ffaa00"
                secColor = "#916100"
            }
            if (colorcode === 5) {
                priColor = "#0066ff"
                secColor = "#002db3"
            }
            if (colorcode === 6) {
                priColor = "#00ff00"
                secColor = "#006400"
            }
            if (colorcode === 7) {
                priColor = "#ff0033"
                secColor = "#80001a"
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