<script lang="ts">
    import { T, useFrame, useThrelte } from '@threlte/core'
    import Floor from './Floor.svelte'
    import Door from '../objects/Door.svelte'
    import { onMount } from 'svelte'
    import Item from '../objects/Item.svelte'
    import Object from '../objects/Object.svelte'
    import Objects from '../objects/Objects.svelte'

    const avoidArray: Array<{ x: number; z: number }> = [{x:-1,z:2},{x:-2,z:3}]

    const { scene } = useThrelte()

    let flickeringInterval: ReturnType<typeof setInterval>
    let lightBrightness: number

    onMount(() => {
        flickeringInterval = setInterval(function () {
            lightBrightness = Math.random() * 1 + 0
        }, 30)
        setTimeout(function () {
            clearInterval(flickeringInterval)
            lightBrightness = 1
        }, 1500)

        console.log(scene)
    })
</script>

<Floor
    levelSize={{ x: 6, z: 12 }}
    {avoidArray}
    startingPosition={{ x: 2, z: -2 }}
    startingRotation={{ x: 1, z: -2 }}
    floorType="stone"
    sunIntensity={0}
/>

<T.Mesh position={[0.5, -0.01, 0.5]} visible={true} name="ground" receiveShadow>
    <T.BoxGeometry args={[6, 0.01, 12]} />
    <T.MeshStandardMaterial color="#595550" />
</T.Mesh>

<Door
    name="Door"
    position={[3.5, 1, -1]}
    rotation.y={1.57}
    activeSquare={{ x: 3, z: -2 }}
    scene={1}
    nextScenePosition={{ x: -1, z: 14 }}
/>

<Objects
    url={'/tech_wall-transformed.glb'}
    scale={[1.5, 1.2, 0.05]}
    instances={[
        { position: [-1.0, 1.2, -5.5], rotation: [0, 0, 0] },
        { position: [-2.5, 1.2, -4.0], rotation: [0, 1.57, 0] },
        { position: [-2.5, 1.2, -1.0], rotation: [0, 1.57, 0] },
        { position: [-2.5, 1.2, 2.0], rotation: [0, 1.57, 0] },
    ]}
/>

<Object url={'/tech_wall_end-transformed.glb'} scale={[1.5, 1.2, 0.05]} position={[2,1.2,-5.5]} />

<Object url={'/tech_wall_end_left-transformed.glb'} rotation={[0, 1.57, 0]} scale={[1.5, 1.2, 0.05]} position={[-2.5, 1.2, 4.5]} />

<!-- OBJECTS -->

<Objects
    url={'/tech_crate-transformed.glb'}
    scale={[0.5, 0.5, 0.5]}
    instances={[
        { position: [-1.0, 0.4, 2], rotation: [0, 1, 0] },
        { position: [-1.8, 0.4, 3.2], rotation: [0, 1.57, 0] }
    ]}
/>

<Item id={2} position={{ x: -1, y: 1.25, z: 2 }} scale={[0.2, 0.3, 0.2]} />


<T.Mesh position={[0.5, 2.5, 0]} visible={true} name="light-box">
    <T.BoxGeometry args={[0.2, 0.1, 2]} />
    <T.MeshToonMaterial color="#ffffff" emissive="#ffffff" transparent={true} opacity={lightBrightness * 0.8} />
</T.Mesh>

<!-- LIGHTS -->

<T.PointLight
    position={[0.5, 4, 0]}
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

<T.AmbientLight intensity={0.15} />
