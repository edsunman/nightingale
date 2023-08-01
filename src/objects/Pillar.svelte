<script lang="ts">
    import { T, useFrame } from '@threlte/core'
    import { gamePosition } from '$lib/stores'
    import { useGltf, useTexture } from '@threlte/extras'
    import { SRGBColorSpace, Vector3, Line, BufferGeometry, LineBasicMaterial } from 'three'

    export let hidePoints: { x: number; z: number }[] = []

    let isPillarVisible = true
    let opacity = 1
    const debug = false
    const debugLine = new Line()

    const gltf = useGltf('/objects/stone_pillar-transformed.glb', { useDraco: true })
    const texture = useTexture('/texture/objectAtlas.png')

    if (debug && hidePoints.length > 0) {
        const debugPoints = []
        for (let i = 0; i < 4; i++) {
            const o = i * 4
            debugPoints.push(new Vector3(hidePoints[i].x, 0.2, hidePoints[i].z))
        }
        debugPoints.push(new Vector3(hidePoints[0].x, 0.2, hidePoints[0].z))
        debugLine.material = new LineBasicMaterial({ color: 0x00ff00 })
        debugLine.geometry = new BufferGeometry().setFromPoints(debugPoints)
    }

    function isInside(point: any, vs: any) {
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

    useFrame(() => {
        if (hidePoints.length > 0) {
            isPillarVisible = !isInside($gamePosition, hidePoints)
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
    <T.Mesh {...$$restProps} name={'vanishing pillar'} geometry={gltf.nodes.Mesh.geometry}>
        {#await texture then t}
            <T.MeshToonMaterial  transparent {opacity}>
                <T is={t} attach="map" flipY={false} colorSpace={SRGBColorSpace} />
            </T.MeshToonMaterial>
        {/await}
    </T.Mesh>
{/await}

{#if debug}
    <T is={debugLine} />
{/if}
