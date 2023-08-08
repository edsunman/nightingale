export function isPointInside(point: {x:number,z:number}, vs: {x:number,z:number}[]) {
        const x = point.x
        const y = point.z
        let inside = false
        for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            const xi = vs[i].x
            const yi = vs[i].z
            const xj = vs[j].x
            const yj = vs[j].z
            const intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
            if (intersect) inside = !inside
        }
        return inside
    }