<script lang="ts">
    import { Group, ShaderMaterial, SkinnedMesh } from 'three'
    import { T, forwardEventHandlers } from '@threlte/core'
    import { useGltf } from '@threlte/extras'
    import HolgramMaterial from '../materials/HolgramMaterial.svelte'



    const gltf = useGltf('/objects/tech_assets-transformed.glb', { useDraco: true })



</script>

{#await gltf then gltf}
    <T.Mesh geometry={gltf.nodes.Sign.geometry} {...$$restProps}  >
        <HolgramMaterial />
    </T.Mesh>
{/await}

