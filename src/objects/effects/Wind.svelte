<script lang="ts">
    import { gamePosition } from '$lib/stores'
    import { T, useFrame } from '@threlte/core'
    import { Vector3, CatmullRomCurve3 } from 'three'
    import MeshLine from '$lib/components/MeshLine.svelte'

    let randomPos = () => Math.random() * (1 - 0) + 0
    let windOffset = 0
    let position: [number, number, number] = [0, 0.5, 0]

    const lines: any[] = []

    function line(this: any, i: number): any {
        const points = []
        points.push(new Vector3(randomPos(), randomPos(), 6))
        points.push(new Vector3(randomPos(), randomPos(), 4))
        points.push(new Vector3(randomPos(), randomPos(), 0))
        points.push(new Vector3(randomPos(), randomPos(), -4))
        points.push(new Vector3(randomPos(), randomPos(), -6))
        const curve = new CatmullRomCurve3(points)
        this.points = curve.getPoints(50)
        this.z = i
        this.x = i / 20
        this.opacityTarget = i * 0.3 + 0.3
        this.opacity = 0
    }

    function generateLines() {
        lines.length = 0
        for (let i = 0; i < 3; i++) {
            lines.push(new (line as any)(i))
        }
    }

    generateLines()

    function moveLines() {
        const pX = $gamePosition.x
        const pZ = $gamePosition.z
        const distance = 10
        generateLines()
        position[0] = Math.random() * (pX + distance - (pX - distance)) + (pX - distance)
        position[2] = Math.random() * (pZ + distance - (pZ - distance)) + (pZ - distance)
    }

    useFrame((state, delta) => {
        if (delta < 0.5) {
            windOffset += 0.6 * delta
            for (let i = 0; i < 3; i++) {
                if (windOffset < 0.5) {
                    lines[i].opacity += delta * lines[i].opacityTarget
                } else {
                    lines[i].opacity -= delta * lines[i].opacityTarget
                }
                lines[i].dashOffset = -windOffset - 0.1
            }
        }
        if (windOffset > 1) {
            windOffset = 0
            for (let i = 0; i < 3; i++) {
                lines[i].opacity = 0
            }
            moveLines()
        }
    })
</script>

<T.Group {position}>
    {#each lines as line, i}
        <MeshLine
            transparent
            depthWrite={false}
            points={line.points}
            pointWidth={(p) => 1 * Math.pow(4 * p * (1 - p), 1)}
            lineWidth={i * 0.02 + 0.01}
            dashArray={1}
            dashRatio={0.8}
            dashOffset={line.dashOffset}
            opacity={line.opacity}
            position.x={line.x}
            position.z={line.z}
        />
    {/each}
</T.Group>
