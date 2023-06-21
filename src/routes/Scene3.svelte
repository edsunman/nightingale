<script lang="ts">
    import { T } from '@threlte/core'
    import Floor from './Floor.svelte'
    import Door from '../objects/Door.svelte'
    import { onMount } from 'svelte'
    import Item from '../objects/Item.svelte'

    const avoidArray: Array<{ x: number; z: number }> = []
    
    let audio: any

    onMount(() => {
    })
</script>

<Floor
    levelSize={{ x: 6, z: 10 }}
    {avoidArray}
    startingPosition={{ x: 2, z: -2 }}
    startingRotation={{ x: 1, z: -2 }}
    floorType="stone"
    sunIntensity={0.7}
/>

<T.Mesh position={[0.5, -0.01, 0.5]} visible={true} name="ground" receiveShadow>
    <T.BoxGeometry args={[6, 0.01, 10]} />
    <T.MeshStandardMaterial color="#595550" />
</T.Mesh>

<!--
<T.AmbientLight  intensity={0.2} />
-->

<Door position={[3.5, 1, -2]} rotation.y={1.57} activeSquare={{ x: 3, z: -2 }} scene={1} nextScenePosition={{ x: -1, z: 14 }} />

<Item id={2} position={{ x: -2, y: 0.5, z: 3 }} />
<!--
<PositionalAudio autoplay loop refDistance={3} volume={0.1} src={'/music.mp3'} position={[0, 0, 0]} bind:ref={audio} />
-->