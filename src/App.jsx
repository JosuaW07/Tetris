import React, {useEffect, useRef, useState} from 'react'
import "./mvp.css"
import Canvas from "./Canvas.jsx";
import Interface from "./Interface.jsx";
import Nextblock from "./Nextblock.jsx";


function App() {
    const canvaswidth = 300;
    const gap = 2;


    const [score, setScore] = useState(0)
    const [highScore, setHighScore] = useState(0)
    const [level, setLevel] = useState(0)

    const [newblock, setnewblock] = useState(null)


    const changeblock = () => {
        const randomname = shapelist[Math.floor(Math.random() * shapelist.length)];
        const shapedata = shapes[randomname];
        const shapecolor = shapelist.indexOf(randomname) + 1;
        setnewblock({
            shape: shapedata,
            color: shapecolor,
            name: randomname

        })
    }

    useEffect(() => {
        changeblock()
    }, [])

    useEffect(() => {
        if (score > highScore) {
            setHighScore(score)
        }
    }, [score]);

    const shapes = {
            T:
                [
                    {y: -1, x: 0},
                    {y: 0, x: -1},
                    {y: 0, x: 0},
                    {y: 0, x: +1}
                ],

            o:
                [
                    {y: 0, x: 0},
                    {y: 0, x: 1},
                    {y: 1, x: 0},
                    {y: 1, x: 1},
                ],

            I:
                [
                    {y: -2, x: 0},
                    {y: -1, x: 0},
                    {y: 0, x: 0},
                    {y: +1, x: 0},
                ],

            L:
                [
                    {y: -1, x: 0},
                    {y: 0, x: 0},
                    {y: 1, x: 0},
                    {y: 1, x: 1}
                ],

            J:
                [
                    {y: -1, x: 0},
                    {y: 0, x: 0},
                    {y: 1, x: 0},
                    {y: 1, x: -1}
                ],

            S:
                [
                    {y: 0, x: 0},
                    {y: 0, x: 1},
                    {y: 1, x: 0},
                    {y: 1, x: -1}
                ],

            Z:
                [
                    {y: 0, x: 0},
                    {y: 0, x: -1},
                    {y: 1, x: 0},
                    {y: 1, x: 1}
                ]
        }
    ;

    const shapelist = Object.keys(shapes)


    return (
        <>
            <section id="game-container">
                <h1>Tetris</h1>
                <div className="game-layout">
                    <header id="interface">
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
                        newblock={newblock}
                        Changeblock={changeblock}
                    />
                    <Nextblock
                        gap={gap}
                    />
                </div>
            </section>
        </>
    )
}

export default App
