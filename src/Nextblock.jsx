import React, {useEffect, useRef} from "react";
import DrawGrid from "./DrawGrid.js";

const initialGrid = (rows, columns) => Array.from({length: rows}, () => Array(columns).fill(0))

export default function Nextblock({gap}) {
    const width = 100;
    const height = width;
    const columns = 4;
    const rows = columns;
    const canvasRef = useRef(null)
    const gridRef = useRef(initialGrid(rows, columns));

    useEffect(() => {

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        DrawGrid(ctx, width, columns, rows, gap, gridRef.current, canvas)

    }, [])


    return (
        <>
            <h2>Nextblock</h2>
            <canvas ref={canvasRef} width={width} height={height}/>
        </>
    )
}