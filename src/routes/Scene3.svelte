<script lang="ts">
    import { T } from '@threlte/core'
    import Floor from './Floor.svelte'
    import Door from '../objects/Door.svelte'
    import { onMount } from 'svelte'
    import Item from '../objects/Item.svelte'

    const avoidArray: Array<{ x: number; z: number }> = []

    let flickeringInterval: ReturnType<typeof setInterval>
    let lightBrightness : number


    onMount(() => {
        flickeringInterval = setInterval(function () {
            lightBrightness = Math.random() * 1 + 0
        }, 30)
        setTimeout(function () {
            clearInterval(flickeringInterval)
            lightBrightness = 1         
        }, 1500)
    })
</script>

<Floor
    levelSize={{ x: 6, z: 10 }}
    {avoidArray}
    startingPosition={{ x: 2, z: -2 }}
    startingRotation={{ x: 1, z: -2 }}
    floorType="stone"
    sunIntensity={0}
/>

<T.Mesh position={[0.5, -0.01, 0.5]} visible={true} name="ground" receiveShadow>
    <T.BoxGeometry args={[6, 0.01, 10]} />
    <T.MeshStandardMaterial color="#595550" />
</T.Mesh>

<T.AmbientLight intensity={0.15} />

<Door position={[3.5, 1, -2]} rotation.y={1.57} activeSquare={{ x: 3, z: -2 }} scene={1} nextScenePosition={{ x: -1, z: 14 }} />

<Item id={2} position={{ x: -2, y: 0.4, z: 3 }} scale={[0.2, 0.3, 0.2]} />
<!--
<PositionalAudio autoplay loop refDistance={3} volume={0.1} src={'/music.mp3'} position={[0, 0, 0]} bind:ref={audio} />
-->
<T.Mesh position={[0.5, 2.5, 0.5]} visible={true} name="light-box">
    <T.BoxGeometry args={[0.2, 0.1, 2]} />
    <T.MeshToonMaterial color="#ffffff" emissive="#ffffff" transparent={true} opacity={lightBrightness * 0.8} />
</T.Mesh>
<T.PointLight
    position={[0.5, 4, 0.5]}
    distance={8}
    color={'#ffffff'}
    intensity={lightBrightness * 2}
    castShadow
    shadow.mapSize.width={500}
    shadow.mapSize.height={500}
    shadow.camera.top={9}
    shadow.camera.right={4}
    shadow.camera.left={-18}
    shadow.camera.bottom={-6}
    shadow.radius={5}
/>
