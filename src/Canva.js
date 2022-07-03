import React, {useRef, useEffect} from 'react'

export default function Canva({imageUrl, props}) {

    const canvasRef = useRef(null)


    const draw = (ctx) => {
        let width = ctx.canvas.width
        let height = ctx.canvas.height


        if (imageUrl === undefined) return;
        const image = new Image();
        image.src = imageUrl;
        image.onload = () => {
           ctx.drawImage(image, 0, 0, width, height)
           let imageData = ctx.getImageData(0, 0, width, height)
           for (let x = 0; x < width; x++) {
               for (let y = 0; y < height; y++) {
                   let index = (x + y * width) * 4;
                   let r = imageData.data[index + 0];
                   let g = imageData.data[index + 1];
                   let b = imageData.data[index + 2]
                   imageData.data[index + 0] = 255 - b;
                   imageData.data[index + 1] = 255 - g;
                   imageData.data[index + 2] = 255 - r;
                   imageData.data[index + 3] = 255;
               }
           }
           ctx.putImageData(imageData, 0, 0)
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        canvas.width = 256
        canvas.height = 256
        draw(context)
    }, [draw])

    return <canvas ref={canvasRef} {...props}/>
}
