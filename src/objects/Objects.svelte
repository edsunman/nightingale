<!--
Auto-generated by: https://github.com/threlte/threlte/tree/main/packages/gltf
Command: npx @threlte/gltf@1.0.0-next.12 tech_wall.glb -T
-->

<script lang="ts">
    import { SRGBColorSpace } from 'three'
    import { T, forwardEventHandlers } from '@threlte/core'
    import { useGltf, InstancedMesh, Instance, useTexture } from '@threlte/extras'

    export let url: string
    const texture = useTexture('/texture/objectAtlas.png')
    export let scale: number | [x: number, y: number, z: number] = 1
    export let instances: {
        position?: [x: number, y: number, z: number]
        rotation?: [x: number, y: number, z: number]
    }[] = [{ position: [0, 0, 0], rotation: [0, 0, 0] }]

    const gltf = useGltf(url, { useDraco: true })
</script>

{#await gltf then gltf}
    <InstancedMesh castShadow {...$$restProps} geometry={gltf.nodes.Mesh.geometry}>
        {#await texture then t}
            <T.MeshToonMaterial>
                <T is={t} attach="map" flipY={false} colorSpace={SRGBColorSpace} />
            </T.MeshToonMaterial>
        {/await}
        {#each instances as object}
            <Instance position={object.position} rotation={object.rotation} {scale} />
        {/each}
    </InstancedMesh>
{/await}
