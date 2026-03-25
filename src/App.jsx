import React, {useEffect, useState} from 'react'
import './App.css'
import Canvas from "./Canvas.jsx";
import Score from "./Score.jsx";


function App() {
    const canvaswidth = 300;
    const gap = 2;

    const [score, setScore] = useState(0)


    //Temp
    useEffect(() => {
        console.log(score);
    }, [score]);

    return (
        <>
            <Score
                score={score}
            />
            <Canvas
                width={canvaswidth}
                height={canvaswidth * 2 - gap}
                gap={gap}
                UpdateScore={setScore}
            />
        </>
    )
}

export default App
