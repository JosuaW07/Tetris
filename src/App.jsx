import React, {useEffect, useState} from 'react'
import './App.css'
import Canvas from "./Canvas.jsx";
import Interface from "./Interface.jsx";


function App() {
    const canvaswidth = 300;
    const gap = 2;

    const [score, setScore] = useState(0)
    const [level, setLevel] = useState(0)

    //Temp
    useEffect(() => {
        console.log("currentlevel", level);
    }, [level]);

    return (
        <>
            <Interface
                score={score}
                level={level}
            />
            <Canvas
                width={canvaswidth}
                height={canvaswidth * 2 - gap}
                gap={gap}
                UpdateScore={setScore}
                UpdateLevel={setLevel}
            />
        </>
    )
}

export default App
