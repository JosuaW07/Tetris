import React, {useEffect, useRef} from "react";
import DrawGrid from "./DrawGrid.js";

const initialGrid = (rows, columns) => Array.from({length: rows}, () => Array(columns).fill(0))

export default function Nextblock({gap, newblock}) {
    const width = 100;
    const height = width;
    const columns = 6;
    const rows = columns;
    const canvasRef = useRef(null)
    const gridRef = useRef(initialGrid(rows, columns));
    const colorcodeRef = useRef(0)
    const currentshapeRef = useRef(null)

    const blockcoloring = (isDrawing) => {
        if (!currentshapeRef.current) return;
        const colorCode = isDrawing ? colorcodeRef.current : 0;

        centershape().forEach((coordinate) => {
            if (gridRef.current[coordinate.y] !== undefined) {
                gridRef.current[coordinate.y][coordinate.x] = colorCode
            }
        })

    }

    const centershape = () => {
        if (!currentshapeRef.current) return [];
        return currentshapeRef.current.map(block => ({
            x: block.x + 1,
            y: block.y + 1,
            color: 2
        }));
    }

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        if (!newblock || !newblock.shape) {
            return
        }

        blockcoloring(false)

        colorcodeRef.current = newblock.color
        currentshapeRef.current = newblock.shape

        blockcoloring(true)

        DrawGrid(ctx, width, columns, rows, gap, gridRef.current, canvas)

    }, [newblock])


    return (
        <>
            <h2>Nextblock</h2>
            <canvas ref={canvasRef} width={width} height={height}/>
        </>
    )
}