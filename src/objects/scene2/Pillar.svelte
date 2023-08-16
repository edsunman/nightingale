<script lang="ts">
    import { T, useFrame } from '@threlte/core'
    import { gamePosition } from '$lib/stores'
    import { useGltf, useTexture } from '@threlte/extras'
    import { SRGBColorSpace, Vector3, Line, BufferGeometry, LineBasicMaterial } from 'three'
    import { isPointInside } from '$lib/util'

    export let hidePoints: { x: number; z: number }[] = []

    let isPillarVisible = true
    let opacity = 1
    const debug = false
    const debugLine = new Line()

    const gltf = useGltf('/objects/stone_assets-transformed.glb', { useDraco: true })
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

    

    useFrame(() => {
        if (hidePoints.length > 0) {
            isPillarVisible = !isPointInside($gamePosition, hidePoints)
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
    <T.Mesh {...$$restProps} name={'vanishing pillar'} geometry={gltf.nodes.Pillar.geometry}>
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
