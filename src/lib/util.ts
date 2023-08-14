type Point = { x: number; z: number }

export function randomNumber(min: number, max: number) {
    return Math.random() * (max - min) + min
}

export function isPointInside(point: Point, points: Point[]): boolean {
    const x = point.x
    const y = point.z
    let inside = false
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const xi = points[i].x
        const yi = points[i].z
        const xj = points[j].x
        const yj = points[j].z
        const intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
        if (intersect) inside = !inside
    }
    return inside
}

export function findClosestPoint(point: Point, positions: Point[]): Point {
    let closestPoint = { x: 0, z: 0 }
    let minDistance = Infinity

    for (let i = 0; i < positions.length; i++) {
        const distance = calculateDistanceBetweenPoints(point, positions[i])

        if (distance < minDistance) {
            closestPoint = positions[i]
            minDistance = distance
        }
    }
    return closestPoint
}

export function calculateDistanceBetweenPoints(pointA: Point, pointB: Point): number {
    const dx = pointA.x - pointB.x
    const dz = pointA.z - pointB.z
    return Math.sqrt(dx * dx + dz * dz)
}
