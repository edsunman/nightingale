import type { Mesh } from 'three'
type Point = { x: number; z: number }

export function randomNumber(min: number = 0, max: number = 1) {
    return Math.random() * (max - min) + min
}

export function ramdomPointInsideCube(position: { x: number; y: number; z: number }, scale: { x: number; y: number; z: number }) {
    return {
        x: position.x + scale.x * randomNumber(-0.5, 0.5),
        y: position.y + scale.y * randomNumber(-0.5, 0.5),
        z: position.z + scale.z * randomNumber(-0.5, 0.5)
    }
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

export function everyInterval(interval: number) {
    let clock = 0
    let intervalCounter = 0
    let seconds = 0
    return function (delta: number, fn: () => void) {
        clock += delta
        seconds += delta
        if (clock > intervalCounter) {
            seconds = 0
            intervalCounter += interval
            fn()
        }
        return seconds
    }
}
