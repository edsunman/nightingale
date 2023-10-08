<script lang="ts">
    import { T } from '@threlte/core'
    import NodeObject from './NodeObject.svelte'
    import Floor from './Floor.svelte'

    import type { Scene } from '$lib/types'

    export let scene: Scene
    export let cameraOffset = { x: 0, z: 0 }
</script>

<Floor
    blocks={scene.blocks}
    startingPosition={{ x: scene.startingPosition_x, z: scene.startingPosition_z }}
    startingRotation={{ x: scene.startingRotation_x, z: scene.startingRotation_z }}
    levelSize={{ x: scene.levelSize_x, z: scene.levelSize_z }}
    {cameraOffset}
    sunIntensity={scene.sunIntensity}
    floorType={scene.floorType}
/>

<T.Mesh position={[0.5, -0.01, 0.5]} visible={true} name="ground" receiveShadow>
    <T.BoxGeometry args={[scene.floorSize_x, 0.01, scene.floorSize_z]} />
    <T.MeshToonMaterial color={scene.floorColor} />
</T.Mesh>

{#each scene.categories as category}
    <NodeObject objects={category.objects} url={category.url} />
{/each}
