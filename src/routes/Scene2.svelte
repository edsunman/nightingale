<script lang="ts">
    import { T, useFrame } from '@threlte/core'
    import Floor from './Floor.svelte'
    import Door from '../objects/Door.svelte'
    import { PositionalAudio } from '@threlte/extras'
    import { onMount } from 'svelte'
    import Item from '../objects/Item.svelte'

    import Character from '../objects/Character.svelte'

    const avoidArray: Array<{ x: number; z: number }> =[{x:-7,z:2},{x:-7,z:1},{x:-7,z:0},{x:-7,z:-1},{x:-7,z:-2},{x:-6,z:-2},{x:-6,z:-3},{x:-6,z:4},{x:-6,z:3},{x:6,z:4},{x:6,z:3},{x:6,z:-3},{x:6,z:-2},{x:0,z:-2},{x:0,z:-3},{x:0,z:3},{x:0,z:4},{x:-7,z:-3},{x:-7,z:3},{x:-7,z:4},{x:-1,z:-3},{x:-1,z:-2},{x:-1,z:3},{x:-1,z:4},{x:5,z:-3},{x:5,z:-2},{x:5,z:3},{x:5,z:4},{x:2,z:-3},{x:-8,z:0}]
    let audio: any

    onMount(() => {
        //console.log(audio)
    })
</script>

<Floor
    levelSize={{ x: 20, z: 10 }}
    {avoidArray}
    startingPosition={{ x: 9, z: 1 }}
    startingRotation={{ x: 0, z: 0 }}
    floorType="stone"
    sunIntensity={0.7}
/>

<T.Mesh position={[0.5, -0.01, 0.5]} visible={true} name="ground" receiveShadow>
    <T.BoxGeometry args={[20, 0.01, 10]} />
    <T.MeshStandardMaterial color="#595550" />
</T.Mesh>

<Character
    message="A hologram dances"
    position={{ x: -4, y: 0, z: -2 }}
    url={'/hologram-transformed.glb'}
    characterId={0}
    currentActionKey={'dance'}
    isHologram={true}
    pingPongIdle={true}
/>
<Character
    message="Bartender"
    position={{ x: -8, y: 0, z: 0 }}
    url={'/hologram-transformed.glb?v=2'}
    characterId={5}
    rotation={1.5708}
/>
<Character
    message="An old soldier"
    position={{ x: 2, y: 0, z: -3 }}
    url={'/hologram-transformed.glb?v=3'}
    characterId={6}
    rotation={1.5708}
/>


<!--
<T.AmbientLight  intensity={0.2} />
-->

<Door position={[10.5, 1, 1]} rotation.y={1.57} activeSquare={{ x: 10, z: 1 }} scene={1} nextScenePosition={{ x: -23, z: 7 }} />

<Item id={1} position={{ x: 5, y: 0.5, z: 5 }} />
<!--
<PositionalAudio autoplay loop refDistance={3} volume={0.1} src={'/music.mp3'} position={[0, 0, 0]} bind:ref={audio} />
-->