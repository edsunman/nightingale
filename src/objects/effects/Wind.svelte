<script lang="ts">
    import { gamePosition } from '$lib/stores'
    import { T, useFrame } from '@threlte/core'
    import { Vector3, CatmullRomCurve3 } from 'three'
    import MeshLine from '$lib/components/MeshLine.svelte'

    let randomPos = () => Math.random() * (1 - 0) + 0
    let windOffset = 0
    let position: [number, number, number] = [0, 0.5, 0]
    let randomLines: number[] = [0, 1, 2]

    const lines: any[] = []
    const points: any[] = []

    function genratePoints() {
        const p = []
        p.push(new Vector3(randomPos() / 1.5, randomPos() / 2, 6))
        p.push(new Vector3(randomPos() / 1.5, randomPos() / 2, 4))
        p.push(new Vector3(randomPos() / 1.5, randomPos() / 2, 0))
        p.push(new Vector3(randomPos() / 1.5, randomPos() / 2, -4))
        p.push(new Vector3(randomPos() / 1.5, randomPos() / 2, -6))
        const curve = new CatmullRomCurve3(p)
        points.push(curve.getPoints(50))
    }

    function line(this: any, i: number): any {
        this.z = randomPos() * 3
        this.x = i / 20
        this.opacityTarget = i * 0.3 + 0.3
        this.opacity = 0
    }

    function generateLines() {
        lines.length = 0
        for (let i = 0; i < 8; i++) {
            lines.push(new (line as any)(i))
            genratePoints()
        }
    }

    generateLines()

    function moveLines() {
        const pX = $gamePosition.x
        const pZ = $gamePosition.z
        const distance = 5
        position[0] = Math.random() * (pX + distance - (pX - distance)) + (pX - distance)
        position[2] = Math.random() * (pZ + distance - (pZ - distance)) + (pZ - distance)
    }

    function shuffleArray(array: any) {
        let currentIndex = array.length,
            randomIndex
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex-- ;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
        }

        return array
    }

    useFrame((state, delta) => {
        if (delta < 0.5) {
            windOffset += 0.6 * delta
            for (let i = 0; i < 3; i++) {
                if (windOffset < 0.5) {
                    lines[randomLines[i]].opacity += delta * (i * 0.2 + 0.2)
                } else {
                    lines[randomLines[i]].opacity -= delta * (i * 0.2 + 0.2)
                }
                lines[randomLines[i]].dashOffset = -windOffset - 0.1
            }
        }
        if (windOffset > 3) {
            let ranNums = shuffleArray([0, 1, 2, 3, 4, 5, 6, 7])
            windOffset = 0
            for (let i = 0; i < 3; i++) {
                lines[randomLines[i]].opacity = 0
                randomLines[i] = ranNums[i]
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
            points={points[i]}
            pointWidth={(p) => 1 * Math.pow(4 * p * (1 - p), 1)}
            lineWidth={0.04}
            dashArray={1}
            dashRatio={0.8}
            dashOffset={line.dashOffset}
            opacity={line.opacity}
            position.x={line.x}
            position.z={line.z}
        />
    {/each}
</T.Group>
