<script lang="ts">
    import { T, useFrame } from '@threlte/core'
    import { MeshLineMaterial, MeshLineGeometry } from '@threlte/extras'
    import type { AvoidObject } from '$lib/types'
    import { Vector3, CatmullRomCurve3 } from 'three'
    import { randomNumber } from '$lib/util'
    import { onMount } from 'svelte'
    import { quadInOut } from 'svelte/easing'

    import type { GameData } from '$lib/types'
    // import MeshLineMaterial from '$lib/components/MeshLineMaterial.svelte'
    //  import MeshLineGeometry from '$lib/components/MeshLineGeometry.svelte'
    import { Group } from '@tweenjs/tween.js'

    export let gameData: GameData

    const avoidArray: AvoidObject[] = []

    let cursorPosition: Vector3 = new Vector3(0, 0, 0)

    let lines: { points: Vector3[]; offsetX: number; offsetZ: number; color: string; width: number }[] = []

    const genratePoints = () => {
        //['#e09f7d', '#ef5d60', '#ec4067', '#a01a7d', '#311847']
        // ['#e09f7d', '#ef5d60', '#ec4067', '#a01a7d', '#311847'].forEach((color, i) => {
        let newLine = {
            points: [],
            offsetX: randomNumber(-0.5, 0.5),
            offsetZ: randomNumber(-0.5, 0.5),
            color: '#ef5d60',
            width: 0.3 + 1 / 5
        } as any
        for (let j = 0; j < 20; j++) {
            newLine.points.push(new Vector3(0, 0, 0))
        }
        lines.push(newLine)
        // })

        console.log(lines)

        //  points.push(new Vector3(0, 0, 0))
        // const curve = new CatmullRomCurve3(p)
        // points = curve.getPoints(240)
    }

    genratePoints()

    onMount(() => {})
    let fullPoints: any = []

    const p = []
    p.push(new Vector3(0, 0, 10))
    p.push(new Vector3(-1, 1, 5))
    p.push(new Vector3(0, -0.5, 0))
    p.push(new Vector3(-1, 1, -5))
    p.push(new Vector3(0, 0, -10))
    const curve = new CatmullRomCurve3(p)
    //fullPoints = curve.getPoints(50)

    let positionOnCurve = 0
    let clock = 0
    let counter = 0
    let timeSinceLastBang = 0
    let point: any
    let lineWidth = 0
    let widthEased = 0

    function easeInOutQuad(t: number, b: number = 0, c: number = 1, d: number = 1) {
        if ((t /= d / 2) < 1) return (c / 2) * t * t * t + b
        return (c / 2) * ((t -= 2) * t * t + 2) + b
    }

    useFrame((context, delta) => {
        if (delta < 0.5) {
            clock += delta
            counter += delta
            if (positionOnCurve >= 1) positionOnCurve = 0
            if (clock > timeSinceLastBang) {
                timeSinceLastBang += 5
                counter = 0
                point = curve.getPoint(0)
                lines[0].points[0].x = point.x
                lines[0].points[0].z = point.z

                for (let j = 0; j < lines[0].points.length; j++) {
                    if (j !== 0) {
                        lines[0].points[j].x = lines[0].points[0].x
                        lines[0].points[j].y = lines[0].points[0].y
                        lines[0].points[j].z = lines[0].points[0].z
                    }
                }
                lineWidth = 0
            }
            if (counter < 1) {
                positionOnCurve = 0
            } else if (counter > 3) {
                positionOnCurve = 1
            } else {
                positionOnCurve += delta / 2
            }
            if (counter > 1 && counter < 2) {
                lineWidth += delta
            } else if (counter > 2 && counter < 3) {
                lineWidth -= delta
            }
            widthEased = easeInOutQuad(lineWidth)
            point = curve.getPoint(quadInOut(positionOnCurve))
            lines[0].points[0].x = point.x
            lines[0].points[0].y = point.y
            lines[0].points[0].z = point.z

            for (let j = 0; j < lines[0].points.length; j++) {
                if (j !== 0) {
                    lines[0].points[j].lerp(lines[0].points[j - 1], 0.4)
                }
            }

            lines = lines
        }
    })
</script>

<!--
<T.Group position={[cursorPosition.x,cursorPosition.y,cursorPosition.z]}>
    {#each lines as line,i}
        <T.Mesh rotation.z={i} position.z={i*1.2} >
            <MeshLineGeometry {points} shape={'taper'} />
            <MeshLineMaterial {opacity} width={0.2} transparent />
        </T.Mesh>
    {/each}
</T.Group> -->
{#each lines as line, i}
    <T.Mesh position.y={1.5 - i / 4}>
        <MeshLineGeometry points={line.points} shape={'taper'} />
        <MeshLineMaterial width={0.3} transparent color={line.color} scaleDown={0.1} />
    </T.Mesh>
{/each}

<T.Mesh
    position={[0.5, -0.01, 0.5]}
    name="ground"
    receiveShadow
    on:pointermove={(e) => {
        cursorPosition.x = e.point.x
        cursorPosition.z = e.point.z
    }}
>
    <T.BoxGeometry args={[20, 0.01, 20]} />
    <T.MeshToonMaterial color="#6d6875" />
</T.Mesh>

<T.AmbientLight intensity={1} />
<!--
<Floor {avoidArray} startingPosition={{ x: 0, z: 0 }} startingRotation={{ x: 0, z: -1 }} levelSize={{ x: 20, z: 20 }} />-->
