export default function DrawGrid(ctx, gridsize, gap, grid) {
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

            const gridposX = posX * (gridsize + gap);
            const gridposY = posY * (gridsize + gap);
            ctx.fillStyle = secColor
            ctx.fillRect(gridposX, gridposY, gridsize + 2 * gap, gridsize + 2 * gap)
            ctx.fillStyle = priColor
            ctx.fillRect(gridposX + gap, gridposY + gap, gridsize, gridsize)
        })
    })
}