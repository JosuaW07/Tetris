export default function Interface({score, highScore, level}) {

    return (
        <>
            <div className="interface">
                <h3>SCORE: {score}</h3>
                <h3>HIGH-SCORE: {highScore}</h3>
                <h3>LEVEL: {level}</h3>
            </div>
        </>
    )
}