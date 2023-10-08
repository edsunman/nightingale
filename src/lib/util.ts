import { Vector3, Raycaster } from 'three'
type Point = { x: number; z: number }

/**
 * Convenience wrapper around Math.random().
 * @param {number} min - The minimum amount.
 * @param {number} max - The maximum amount.
 */
export function randomNumber(min: number = 0, max: number = 1) {
    return Math.random() * (max - min) + min
}

/**
 * Returns a 3D position inside a cube of given position and scale.
 */
export function ramdomPointInsideCube(position: { x: number; y: number; z: number }, scale: { x: number; y: number; z: number }) {
    return {
        x: position.x + scale.x * randomNumber(-0.5, 0.5),
        y: position.y + scale.y * randomNumber(-0.5, 0.5),
        z: position.z + scale.z * randomNumber(-0.5, 0.5)
    }
}

/**
 * Returns true if 2D point is insde an array of 2D points.
 */
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

/**
 * Returns the closet 2D position for a given 2D point from an array of 2D positions.
 */
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

/**
 * Returns a function that can be used to execute a child function every given number of seconds.
 * @param {number} interval - The interval in seconds.
 * @example
 * const everyFiveSeconds = everyInterval(5)
 * useFrame((_, delta) => {
 *      const seconds = everyFiveSeconds(delta, () => {
            // called every five seconds
        })
 * }
 */
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

/**
 * Returns the furthest grid square in a given direction before hitting a block or going outside the level.
 */
export function getFurthestWalkableGridSquare(startPoint: Point, directionPoint: Point, levelSize: Point, avoidObjects: any[]) {
    const diff = { x: directionPoint.x - startPoint.x, z: directionPoint.z - startPoint.z }
    let destinationPoint = startPoint
    let i = 0
    while (i < 100) {
        let nextPointToCheck = { x: destinationPoint.x, z: destinationPoint.z }
        if (diff.x > 0) {
            nextPointToCheck.x++
        } else if (diff.x < 0) {
            nextPointToCheck.x--
        }
        if (diff.z > 0) {
            nextPointToCheck.z++
        } else if (diff.z < 0) {
            nextPointToCheck.z--
        }
        if (isSquareOutsideLevel(nextPointToCheck, levelSize)) {
            break
        }
        destinationPoint = nextPointToCheck
        i++
    }
    const { square } = checkColission(startPoint, destinationPoint, avoidObjects)
    destinationPoint = square
    return destinationPoint
}

/**
 * If the path between the player square and destination square is blocked, returns the square before,
 * else returns the destination square.
 */
export function checkColission(playerSquare: Point, destinationSquare: Point, avoidObjects: any[]) {
    const playerVector = new Vector3(playerSquare.x, 0, playerSquare.z)
    const destinationVector = new Vector3(destinationSquare.x, 0, destinationSquare.z)
    const raycaster = new Raycaster()
    const direction = new Vector3()

    direction.subVectors(destinationVector, playerVector).normalize()
    raycaster.set(playerVector, direction)

    const intersects = raycaster.intersectObjects(avoidObjects, false)
    const distance = Math.sqrt((destinationVector.x - playerVector.x) ** 2 + (destinationVector.z - playerVector.z) ** 2)

    if (intersects.length > 0 && intersects[0].distance < distance) {
        // hit!
        const ip = intersects[0].point
        let gridIp = { x: 0, z: 0 }

        if (playerVector.x < ip.x) {
            gridIp.x = Math.round(ip.x - 0.5)
        } else if (playerVector.x > ip.x) {
            gridIp.x = Math.round(ip.x + 0.5)
        } else {
            gridIp.x = Math.round(ip.x)
        }

        if (playerVector.z < ip.z) {
            gridIp.z = Math.round(ip.z - 0.5)
        } else if (playerVector.z > ip.z) {
            gridIp.z = Math.round(ip.z + 0.5)
        } else {
            gridIp.z = Math.round(ip.z)
        }
        return { square: gridIp, hit: true }
    } else {
        return { square: destinationSquare, hit: false }
    }
}

export function isSquareOutsideLevel(square: Point, levelSize: Point) {
    if (
        square.x > levelSize.x / 2 + 0.5 ||
        square.x < levelSize.x / 2 - levelSize.x + 0.5 ||
        square.z > levelSize.z / 2 + 0.5 ||
        square.z < levelSize.z / 2 - levelSize.z + 0.5
    ) {
        return true
    } else {
        return false
    }
}
