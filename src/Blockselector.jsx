import React, {useRef, useEffect} from 'react'

const Canvas = props => {
    const canvasRef = useRef(null)
    currentblock

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        currentblock(context, canvas)


    }, []
    currentblock
)
    ;

    return <canvas ref={canvasRef} {...props}/>

}

export default Canvas