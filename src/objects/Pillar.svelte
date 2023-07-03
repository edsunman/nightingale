<script lang="ts">
    import { T, useFrame } from '@threlte/core'
    import { gamePosition } from '$lib/stores'
    import { useGltf } from '@threlte/extras'
    import { Vector3, Line, BufferGeometry, LineBasicMaterial } from 'three'

    export let matrix: number[] = []

    let isPillarVisible = true
    let opacity = 1

    const gltf = useGltf('/objects/stone_pillar-transformed.glb', { useDraco: true })

    /* DEBUG LINES
    const points = []
    for (let i = 0; i < 4; i++) {
        const o = (i * 4)
        points.push(new Vector3(matrix[0+o], 0.2, matrix[3+o]))
        points.push(new Vector3(matrix[1+o], 0.2, matrix[3+o]))
        points.push(new Vector3(matrix[1+o], 0.2, matrix[2+o]))
        points.push(new Vector3(matrix[0+o], 0.2, matrix[2+o]))
        points.push(new Vector3(matrix[0+o], 0.2, matrix[3+o]))
    }
    const debugLine = new Line(
        new BufferGeometry().setFromPoints( points ),
        new LineBasicMaterial( { color: 0x00ff00 } )
    )
    */

    useFrame(() => {
        const p = $gamePosition
        const m = matrix
        isPillarVisible = true

        // TODO : change to a "point in polygon" function 
        if (
            (m[0] > p.x && p.x > m[1] && m[2] > p.z && p.z > m[3]) ||
            (m[4] > p.x && p.x > m[5] && m[6] > p.z && p.z > m[7]) ||
            (m[8] > p.x && p.x > m[9] && m[10] > p.z && p.z > m[11]) ||
            (m[12] > p.x && p.x > m[13] && m[14] > p.z && p.z > m[15])
        ) {
            isPillarVisible = false
        }

        if (isPillarVisible) {
            if (opacity === 0.9) opacity = 1
            else if (opacity < 0.9) opacity += 0.1
        } else {
            if (opacity === 0.1) opacity = 0
            else if (opacity > 0.1) opacity -= 0.1
        }
    })
</script>

{#await gltf then gltf}
    <T.Mesh {...$$restProps} name={'vanishing pillar'} geometry={gltf.nodes.Mesh.geometry} >
        <T.MeshToonMaterial color="#666666" transparent={true} {opacity} />
    </T.Mesh>
{/await}

<!--<T is={debugLine} />-->


