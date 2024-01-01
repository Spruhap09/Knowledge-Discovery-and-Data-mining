type Draw = {
    context: CanvasRenderingContext2D
    currentPoint: Point
    prevPoint: null|Point
}

type Point = {
    x: number
    y: number
}