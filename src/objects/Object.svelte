<script lang="ts">
    import { T } from '@threlte/core'
    import { useGltf } from '@threlte/extras'

    export let url: string

    const gltf = useGltf(url, { useDraco: true })
</script>

{#await gltf then gltf}
    <T.Mesh {...$$restProps} geometry={gltf.nodes.Mesh.geometry} castShadow>
        <T.MeshToonMaterial />
    </T.Mesh>
{/await}
