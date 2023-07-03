<script lang="ts">
    import { T, useFrame } from '@threlte/core'
    import { MeshLineMaterial } from '$lib/components/MeshLine'
    import { Vector3, BufferGeometry, CatmullRomCurve3, Color } from 'three'
    import MeshLine from '$lib/components/MeshLine.svelte'

    export let position: [x: number, y: number, z: number]

    const lines: any[] = []
    const offsetValues: number[] = [0,0,0,0,0]

    function newLine() {
        const points = []
        points.push(new Vector3(0, 0, 0))
        for (let i = 1; i < 5; i++) {
            points.push(new Vector3(Math.random() * 0.5 - 0.2, 0.4 * i, Math.random() * 0.8 - 0.5))
        }
        return new CatmullRomCurve3(points).getPoints(50)
    }

    for (let i = 0; i < 5; i++) {
        lines.push(newLine())
    }

    useFrame((state, delta) => {
        offsetValues[0] -= delta * 0.28
        offsetValues[1] -= delta * 0.3
        offsetValues[2] -= delta * 0.32
        offsetValues[3] -= delta * 0.35
        offsetValues[4] -= delta * 0.38
    })

</script>

{#each lines as line, i}
    <MeshLine
        name={'spark'}
        {position}
        color={'#ccf7ff'}
        points={line}
        transparent
        depthWrite={false}
        lineWidth={0.02}
        dashArray={1}
        dashRatio={0.98}
        dashOffset={offsetValues[i]}
    />
{/each}