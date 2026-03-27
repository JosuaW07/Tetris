import React, {useEffect, useState} from 'react'
import "./mvp.css"
import Canvas from "./Canvas.jsx";
import Interface from "./Interface.jsx";


function App() {
    const canvaswidth = 300;
    const gap = 2;

    const [score, setScore] = useState(0)
    const [highScore, setHighScore] = useState(0)
    const [level, setLevel] = useState(0)

    useEffect(() => {
        if (score > highScore) {
            setHighScore(score)
        }
    }, [score]);

    return (
        <>
            <section id="game-container">
                <header>
                    <Interface
                        score={score}
                        highScore={highScore}
                        level={level}
                    />
                </header>
                <Canvas
                    width={canvaswidth}
                    height={canvaswidth * 2 - gap}
                    gap={gap}
                    UpdateScore={setScore}
                    UpdateLevel={setLevel}
                    CurrentLevel={level}
                />
            </section>
        </>
    )
}

export default App
