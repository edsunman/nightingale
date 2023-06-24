<script lang="ts">
    import { T, useFrame, useThrelte } from '@threlte/core'
    import Floor from './Floor.svelte'
    import Door from '../objects/Door.svelte'
    import { Instance, InstancedMesh, Portal, useTexture } from '@threlte/extras'
    import { onMount } from 'svelte'

    import Character from '../objects/Character.svelte'
    import FloorStones from '../objects/FloorStones.svelte'
    import Pillar from '../objects/Pillar.svelte'

    const avoidArray: Array<{ x: number; z: number }> = [
        { x: -7, z: 2 },
        { x: -7, z: 1 },
        { x: -7, z: 0 },
        { x: -7, z: -1 },
        { x: -7, z: -2 },
        { x: -6, z: -2 },
        { x: -6, z: -3 },
        { x: -6, z: 4 },
        { x: -6, z: 3 },
        { x: 6, z: 4 },
        { x: 6, z: 3 },
        { x: 6, z: -3 },
        { x: 6, z: -2 },
        { x: 0, z: -2 },
        { x: 0, z: -3 },
        { x: 0, z: 3 },
        { x: 0, z: 4 },
        { x: -7, z: -3 },
        { x: -7, z: 3 },
        { x: -7, z: 4 },
        { x: -1, z: -3 },
        { x: -1, z: -2 },
        { x: -1, z: 3 },
        { x: -1, z: 4 },
        { x: 5, z: -3 },
        { x: 5, z: -2 },
        { x: 5, z: 3 },
        { x: 5, z: 4 },
        { x: 2, z: -3 },
        { x: -8, z: 0 }
    ]

    const windowTexture = useTexture('./window.png')

    const { scene } = useThrelte()

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
    sunIntensity={0}
/>

<T.Mesh position={[0.5, -0.01, 0.5]} visible={true} name="ground" receiveShadow>
    <T.BoxGeometry args={[20, 0.01, 10]} />
    <T.MeshStandardMaterial color="#555555" />
</T.Mesh>

<FloorStones />

<Character
    message="A hologram dances"
    position={{ x: -2, y: 0, z: -2 }}
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

<T.AmbientLight intensity={0.1} />

<Door position={[10.5, 1, 1]} rotation.y={1.57} activeSquare={{ x: 10, z: 1 }} scene={1} nextScenePosition={{ x: -23, z: 7 }} />

<InstancedMesh>
    <T.CylinderGeometry args={[0.5, 0.5, 5]} />
    <T.MeshToonMaterial color="#666666" />
    <Instance position={[5.5, 2.5, -2.5]} />
    <Instance position={[-0.5, 2.5, -2.5]} />
    <Instance position={[-6.5, 2.5, -2.5]} />
    <!--<Instance position={[5.5, 2, 3.5]} />
    <Instance position={[-0.5, 2, 3.5]} />-->
    <Instance position={[-6.5, 2, 3.5]} />
</InstancedMesh>

<Pillar 
    position={[5.5, 2, 3.5]}
    matrix={[2.5, 0.5, 0.5, -1.5, 3.5, 1.5, 1.5, -0.5, 4.5, 2.5, 2.5, 0.5, 5.5, 3.5, 3.5, 1.5]}
/>
<Pillar
    position={[-0.5, 2, 3.5]}
    matrix={[-3.5, -5.5, 0.5, -1.5, -2.5, -4.5, 1.5, -0.5, -1.5, -3.5, 2.5, 0.5, -0.5, -2.5, 3.5, 1.5]}
/>

<T.PointLight position={[3, 4, 0]} distance={10} color={'#ffffff'} intensity={1.5} />
<T.PointLight position={[-4, 4, 0]} distance={10} color={'#ffffff'} intensity={1.5} />
<T.PointLight position={[-7, 3, 0]} distance={8} color={'#deac40'} intensity={1.5} />

{#await windowTexture then t}
    <T.SpotLight
        castShadow
        shadow.mapSize.width={200}
        shadow.mapSize.height={200}
        shadow.camera.top={9}
        shadow.camera.right={4}
        shadow.camera.left={-18}
        shadow.camera.bottom={-6}
        color="#ffffff"
        let:ref
        position={[2.5, 50, 40]}
        angle={0.04}
        penumbra={0}
        map={t}
        intensity={5}
    >
        <T.Mesh attach={'target'} visible={false} position={[0, -1, -0.8]} />
        <!--  <Portal object={scene}>
            <T.SpotLightHelper args={[ref]} />
        </Portal> -->
    </T.SpotLight>

    <T.SpotLight
        castShadow
        shadow.mapSize.width={200}
        shadow.mapSize.height={200}
        shadow.camera.top={9}
        shadow.camera.right={4}
        shadow.camera.left={-18}
        shadow.camera.bottom={-6}
        color="#ffffff"
        let:ref
        position={[-4, 50, 40]}
        angle={0.04}
        penumbra={0.5}
        map={t}
        intensity={5}
    >
        <T.Mesh attach={'target'} visible={false} position={[0, -1, -0.8]} />
        <!--  <Portal object={scene}>
            <T.SpotLightHelper args={[ref]} />
        </Portal> -->
    </T.SpotLight>
{/await}
