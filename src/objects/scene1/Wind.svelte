<script lang="ts">
    import { gameCameraPosition } from '$lib/stores'
    import { T, useFrame } from '@threlte/core'
    import { MeshLineMaterial, MeshLineGeometry } from '@threlte/extras'
    import { Vector3, CatmullRomCurve3 } from 'three'
    import { quadInOut } from 'svelte/easing'
    import { randomNumber, everyInterval } from '$lib/util'

    let line: Vector3[] = []

    for (let j = 0; j < 20; j++) {
        line.push(new Vector3(0, 0, 0))
    }

    const p = []
    p.push(new Vector3(0, 0, 6))
    p.push(new Vector3(-0.3, 0.3, 3))
    p.push(new Vector3(0, -0.3, 0))
    p.push(new Vector3(-0.3, 0.3, -3))
    p.push(new Vector3(0, 0, -6))
    const curve = new CatmullRomCurve3(p)

    let positionOnCurve = 0
    let point: Vector3
    let groupPosition: [number, number, number] = [0, 1, 0]
    let rotation = 0
    const distance = 6

    const resetLine = () => {
        point = curve.getPoint(0)
        line[0].x = point.x
        line[0].y = point.y
        line[0].z = point.z
        for (let j = 0; j < line.length; j++) {
            if (j !== 0) {
                line[j].x = line[0].x
                line[j].y = line[0].y
                line[j].z = line[0].z
            }
        }
        groupPosition[0] = randomNumber($gameCameraPosition.x - distance, $gameCameraPosition.x + distance)
        groupPosition[2] = randomNumber($gameCameraPosition.z - distance, $gameCameraPosition.z + distance)
        rotation = randomNumber(0, 6.28)
    }

    const everyFiveSeconds = everyInterval(5)

    useFrame((context, delta) => {
        if (delta < 0.5) {
            if (positionOnCurve >= 1) positionOnCurve = 0
            const seconds = everyFiveSeconds(delta, () => {
                resetLine()
            })
            if (seconds < 1) {
                positionOnCurve = 0
            } else if (seconds > 3) {
                positionOnCurve = 1
            } else {
                positionOnCurve += delta / 2
            }
            point = curve.getPoint(quadInOut(positionOnCurve))
            line[0].x = point.x
            line[0].y = point.y
            line[0].z = point.z
            for (let j = 0; j < line.length; j++) {
                if (j !== 0) {
                    line[j].lerp(line[j - 1], 0.4)
                }
            }
            line = line
        }
    })
</script>

<T.Group position={groupPosition}>
    <T.Mesh rotation.z={rotation}>
        <MeshLineGeometry points={line} shape={'taper'} />
        <MeshLineMaterial width={8} transparent color="#ffffff" scaleDown={0.3} attenuate={false} />
    </T.Mesh>
    <T.Mesh position.z={1.5} position.y={0.2} rotation.z={rotation + 3.14}>
        <MeshLineGeometry points={line} shape={'taper'} />
        <MeshLineMaterial width={5} opacity={0.7} transparent color="#ffffff" scaleDown={0.3} attenuate={false} />
    </T.Mesh>
</T.Group>
