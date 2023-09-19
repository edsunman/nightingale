import { Vector3, Quaternion, Matrix4 } from 'three'

const parseGradientString = (gradientString: string) => {
    // todo : correctly order array
    let object: any = {
        stops: [],
        colors: []
    }
    const stops = gradientString.match(/(?<=\s)[^\s]*(?=%)/g)
    if (!stops) return
    const rgbaValues = gradientString.match(/(?<=\()[^\s]*(?=\))/g)
    if (!rgbaValues || stops.length !== rgbaValues.length) return
    let lastStop, lastColor
    for (let i = 0; i < 4; i++) {
        if (rgbaValues[i]) {
            const rgbaSplit = rgbaValues[i].split(',')
            if (rgbaSplit.length !== 4) return
            lastStop = parseInt(stops[i]) / 100
            object.stops.push(lastStop)
            lastColor = [
                parseInt(rgbaSplit[0]) / 255,
                parseInt(rgbaSplit[1]) / 255,
                parseInt(rgbaSplit[2]) / 255,
                parseInt(rgbaSplit[3])
            ]
            //object.colors.push(lastColor)
            object.colors = object.colors.concat(lastColor)
        } else {
            object.stops.push(lastStop)
            object.colors = object.colors.concat(lastColor)
        }
    }
    return object
}

export const createGradientObject = (gradientString: string) => {
    const gradientObject = parseGradientString(gradientString)
    if (gradientObject) {
        return gradientObject
    } else {
        // string incorrectly formatted so just show white
        return {
            stops: new Array(4).fill(1),
            colors: new Array(16).fill(1)
        }
    }
}

export const randomDirectionSpread = (direction: Vector3, angleDegrees: number) => {
    const π = Math.PI
    const π2 = 2 * π
    const coneAngle = (angleDegrees * Math.PI) / 180
    const z = Math.random() * (1 - Math.cos(coneAngle)) + Math.cos(coneAngle)
    const θ = Math.random() * π2
    const r = Math.sqrt(1 - z * z)
    const x = r * Math.cos(θ)
    const y = r * Math.sin(θ)
    const m = new Matrix4().lookAt(direction, new Vector3(0, 0, 0), new Vector3(0, 1, 0))
    const q = new Quaternion().setFromRotationMatrix(m)
    return new Vector3(x, y, z).applyQuaternion(q)
}

export const ramdomPointInsideCube = (position: { x: number; y: number; z: number }, scale: { x: number; y: number; z: number }) => {
    return {
        x: position.x + scale.x * (Math.random() * 1 - 0.5),
        y: position.y + scale.y * (Math.random() * 1 - 0.5),
        z: position.z + scale.z * (Math.random() * 1 - 0.5)
    }
}
