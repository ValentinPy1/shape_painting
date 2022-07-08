import React, {useRef, useEffect} from 'react'

const rdmExp = (dispersion) => {
    if (Math.random() > 0.5)
        return Math.pow((-1 / ((Math.random() * 0.999) - 1)), dispersion)
    return -(Math.pow((-1 / ((Math.random() * 0.999) - 1)), dispersion))
}

function Point(x, y) {
    this.x = x
    this.y = y
    this.mutate = (disp) => {
        console.log(rdmExp(disp))
        this.x += rdmExp(disp)
        this.y += rdmExp(disp)
    }
}

const rdmPoint = (max_x, max_y) => {
    return new Point(Math.random() * max_x, Math.random() * max_y)
}

function Color() {
    this.r = Math.random() * 255
    this.g = Math.random() * 255
    this.b = Math.random() * 255
    this.a = Math.random()
    this.string = () => {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`
    }
    this.mutate = (disp) => {
        this.r += rdmExp(disp)
        this.g += rdmExp(disp)
        this.b += rdmExp(disp)
        this.a += rdmExp(disp) / 255
    }
}

function Triangle(p0, p1, p2, color) {
    this.p0 = p0
    this.p1 = p1
    this.p2 = p2
    this.color = color
    this.draw = (ctx) => {
        ctx.beginPath()
        ctx.moveTo(p0.x, p0.y)
        ctx.lineTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.fillStyle = color.string()
        ctx.fill()
    }
    this.mutate = (disp) => {
        this.p0.mutate(disp)
        this.p1.mutate(disp)
        this.p2.mutate(disp)
        this.color.mutate()
    }
}

const rdmTriangle = (max_x, max_y) => {
    return new Triangle(rdmPoint(max_x, max_y), rdmPoint(max_x, max_y), rdmPoint(max_x, max_y), new Color())
}

function TriangleArray(width, height, count) {
    this.triangles = []
    for (let i = 0; i < count; ++i)
        this.triangles.push(rdmTriangle(width, height))
    this.mutate = (disp) => {
        for (let triangle of this.triangles)
            triangle.mutate(disp)
    }
    this.draw = (ctx) => {
        for (let triangle of this.triangles)
            triangle.draw(ctx)
    }
    this.fitness = (ctx) => {
        let fitness = 0
        return fitness
    }
}

function Population(ctx, batch_size, batch_count) {
    this.batches = []
    for (let i = 0; i < batch_count; ++i)
        this.batches.push(new TriangleArray(ctx.width, ctx.height, batch_size))
    this.mutate = (disp) => {
        for (let batche of this.batches)
            batche.mutate(disp)
    }
}

export default function ImageProcessing({imageUrl_1, imageUrl_2, props}) {

    const bruteRef_1 = useRef(null)
    const bruteRef_2 = useRef(null)
    const diffRef = useRef(null)

    function draw_image(ref, imageUrl, imageData_1, imageData_2, width, height) {
        const canvas = ref.current
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')

        if (imageUrl === undefined) return
        const image = new Image()
        image.src = imageUrl
        image.onload = () => {
            ctx.drawImage(image, 0, 0, width, height)
            // const ta = new TriangleArray(width, height, 10)
            // for (let i = 0; i < 1; ++i) {
            //     ta.draw(ctx)
            //     ta.mutate(0.5)
            // }
            imageData_1.data = ctx.getImageData(0, 0, width, height)
            draw_diff(diffRef, imageData_1.data, imageData_2.data, width, height)
        }
    }

    function draw_diff(ref, iD1, iD2, width, height) {
        const canvas = ref.current
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, width, height)
        let imageData = ctx.getImageData(0, 0, width, height)

        if (iD1 === undefined || iD2 === undefined) {
            return
        }
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let index = (x + y * width) * 4
                imageData.data[index + 0] = Math.abs(iD1.data[index + 0] - iD2.data[index + 0])
                imageData.data[index + 1] = Math.abs(iD1.data[index + 1] - iD2.data[index + 1])
                imageData.data[index + 2] = Math.abs(iD1.data[index + 2] - iD2.data[index + 2])
                imageData.data[index + 3] = 255
            }
        }
        ctx.putImageData(imageData, 0, 0)
    }

    useEffect(() => {
        let imageData_1 = {'data': undefined}
        let imageData_2 = {'data': undefined}
        let width = 512
        let height = 512
        draw_image(bruteRef_1, imageUrl_1, imageData_1, imageData_2, width, height)
        draw_image(bruteRef_2, imageUrl_2, imageData_2, imageData_1, width, height)
    }, [draw_image, draw_diff])

    return (
        <div>
            <canvas ref={bruteRef_1} {...props}/>
            <canvas ref={bruteRef_2} {...props}/>
            <canvas ref={diffRef} {...props}/>
        </div>
    );
}
