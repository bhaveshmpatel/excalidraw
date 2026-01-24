"use client"
import { useEffect, useRef } from "react";

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if(canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            if(!ctx) {return;}

            let clicked = false;
            let startX = 0;
            let startY = 0;

            canvas.addEventListener("pointerdown", (e) => {
                clicked = true; 
                startX = e.clientX;
                startY = e.clientY;
            })
            canvas.addEventListener("pointerup", (e) => {
                clicked = false;
                console.log(e.clientX);
                console.log(e.clientY);

            })
            canvas.addEventListener("pointermove", (e) => {
                if (clicked) {
                    const width = e.clientX - startX;
                    const height = e.clientY - startY;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.strokeRect(startX, startY, width, height);  
                }

            })
        }

    }, [canvasRef]);

    
    return <div className="w-screen h-screen bg-white">
        <canvas ref={canvasRef} width={500} height={500}>

        </canvas>
    </div>
}   