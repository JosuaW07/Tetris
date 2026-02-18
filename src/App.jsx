import React, {useState} from 'react'
import './App.css'
import Canvas from "./Canvas.jsx";


function App() {
    const canvaswidth = 300;
    const gap = 2;

    return (
        <>
            <Canvas
                width={canvaswidth}
                height={canvaswidth * 2 - gap * 2}
                gap={gap}
            />
        </>
    )
}

export default App
