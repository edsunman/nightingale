<script lang="ts">
    import { sRGBEncoding } from 'three'
    import { T } from '@threlte/core'
    import { useGltf, useTexture } from '@threlte/extras'
    const texture = useTexture('/texture/objectAtlas.png')

    export let url: string

    const gltf = useGltf(url, { useDraco: true })
</script>

{#await gltf then gltf}
    <T.Mesh {...$$restProps} geometry={gltf.nodes.Mesh.geometry} castShadow>
        {#await texture then t}
            <T.MeshToonMaterial color="#ffffff">
                <T is={t} attach="map" flipY={false} encoding={sRGBEncoding} />
            </T.MeshToonMaterial>
        {/await}
    </T.Mesh>
{/await}
