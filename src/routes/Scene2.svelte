<script lang="ts">
    import { T, useThrelte } from '@threlte/core'
    import Floor from './Floor.svelte'
    import Door from '../objects/Door.svelte'
    import { useTexture } from '@threlte/extras'
    import { onMount } from 'svelte'

    import Character from '../objects/Character.svelte'
    import FloorStones from '../objects/FloorStones.svelte'
    import Pillar from '../objects/Pillar.svelte'
    import DustParticles from '../objects/effects/DustParticles.svelte'
    import Object from '../objects/Object.svelte'
    import Objects from '../objects/Objects.svelte'
    import Sparkes from '../objects/effects/Sparkes.svelte'

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
        { x: -8, z: 0 },
        { x: -3, z: 3 },
        { x: -3, z: 4 },
        { x: -3, z: 5 },
        { x: -2, z: 4 },
        { x: 1, z: -2 },
        { x: 2, z: -2 },
        { x: 3, z: -2 },
        { x: 3, z: -3 },
        { x: 10, z: -3 },
        { x: 9, z: -4 },
        { x: 9, z: -3 },
        { x: 9, z: -2 },
        { x: 8, z: -2 },
        { x: -9, z: 3 },
        { x: -9, z: 4 },
        { x: -9, z: -4 },
        { x: -9, z: -3 }
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
    position={{ x: -0.5, y: 1.8, z: -2.5 }}
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
    chatRadius={2}
/>
<Character
    message="An old soldier"
    position={{ x: 3, y: 0, z: -3 }}
    url={'/hologram-transformed.glb?v=3'}
    characterId={6}
    rotation={0}
    chatRadius={2}
    lookatPlayerWhenTalking={false}
/>

<Door position={[10.5, 1, 1]} rotation.y={1.57} activeSquare={{ x: 10, z: 1 }} scene={1} nextScenePosition={{ x: -23, z: 7 }} />

<Objects
    name={'wall'}
    url={'/objects/stone_wall-transformed.glb'}
    instances={[
        { position: [-9.5, 0, 0.5], rotation: [0, 3.14, 0] },
        { position: [-9.5, 0, -4.5], rotation: [0, 1.57, 0] },
        { position: [-9.5, 0, 5.5], rotation: [0, 3.14, 0] },
        { position: [-4.5, 0, -4.5], rotation: [0, 1.57, 0] },
        { position: [0.5, 0, -4.5], rotation: [0, 1.57, 0] }
    ]}
/>
<Object name={'wall end'} url={'/objects/stone_wall_end-transformed.glb'} position={[5.5, 0, -4.5]} rotation.y={1.57} />
<Objects
    name={'pillar base'}
    url={'/objects/stone_pillarbase-transformed.glb'}
    scale={[0.9, 0.9, 0.9]}
    instances={[
        { position: [5.5, 0.2, -2.5], rotation: [0, 0, 0] },
        { position: [-0.5, 0.2, -2.5], rotation: [0, 1.57, 0] },
        { position: [-6.5, 0.2, -2.5], rotation: [0, -1.57, 0] },
        { position: [-6.5, 0.2, 3.5], rotation: [0, 3.14, 0] },
        { position: [5.5, 0.2, 3.5], rotation: [0, 1.5, 0] },
        { position: [-0.5, 0.2, 3.5], rotation: [0, 0, 0] }
    ]}
/>
<Objects
    name={'pillar'}
    url={'/objects/stone_pillar-transformed.glb'}
    scale={[0.9, 0.9, 0.9]}
    instances={[
        { position: [5.5, 0.2, -2.5], rotation: [0, 0, 0] },
        { position: [-6.5, 0.2, -2.5], rotation: [0, -1.57, 0] },
        { position: [-6.5, 0.2, 3.5], rotation: [0, 3.14, 0] }
    ]}
/>
<Object name={'small pillar'} url={'/objects/stone_pillar_small-transformed.glb'} scale={0.9} position={[-0.5, 0.2, -2.5]} rotation.y={1.57} />
<Pillar  position={[5.5, 0, 3.5]} matrix={[2.5, -0.5, 0.5, -2.5, 3.5, 0.5, 1.5, -1.5, 4.5, 1.5, 2.5, -0.5, 5.5, 2.5, 3.5, 0.5]} />
<Pillar
    position={[-0.5, 0, 3.5]}
    matrix={[-3.5, -6.5, 0.5, -2.5, -2.5, -5.5, 1.5, -1.5, -1.5, -4.5, 2.5, -0.5, -0.5, -3.5, 3.5, 0.5]}
/>
<Objects
    name={'crate'}
    url={'/tech_crate-transformed.glb'}
    scale={[0.5, 0.5, 0.5]}
    instances={[
        { position: [-6.8, 0.4, -1], rotation: [0, 1, 0] },
        { position: [-7, 0.4, 0.5], rotation: [0, 1.57, 0] }
    ]}
/>
<Objects
    name={'table'}
    url={'/objects/stone_table.glb'}
    scale={[0.32, 0.32, 0.32]}
    instances={[
        { position: [2, 0, -2], rotation: [0, 0, 0] },
        { position: [9, 0, -3], rotation: [0, 1.57, 0] },
        { position: [-3, 0, 4], rotation: [0, 1.57, 0] }
    ]}
/>
<Objects
    name={'stool'}
    url={'/objects/stone_stool.glb'}
    scale={[0.22, 0.22, 0.22]}
    instances={[
        { position: [-2, 0, 4], rotation: [0, 0.4, 0] },
        { position: [7.7, 0, -2], rotation: [0, 1, 0] },
        { position: [10, 0, -3], rotation: [0, 0, 0] },
        { position: [3, 0, -3], rotation: [0, 0, 0] }
    ]}
/>
<Object name={'plank'} url={'/objects/stone_plank-transformed.glb'} scale={[0.55, 0.55, 0.65]} position={[-6.9, 0.9, 0.25]} />
<Objects
    name={'barrel'}
    url={'/objects/stone_barrel-transformed.glb'}
    scale={0.36}
    instances={[
        { position: [-6.7, 0, 2], rotation: [0, 0, 0] },
        { position: [-9, 0, -4], rotation: [0, 1, 0] },
        { position: [-9, 0, -3], rotation: [0, 2, 0] },
        { position: [-9, 0, 3], rotation: [0, 2, 0] },
        { position: [-9, 0.9, 3], rotation: [0, 1, 0] },
        { position: [-9, 0, 4], rotation: [0, 0, 0] }
    ]}
/>

<Sparkes position={[-0.5, 1.5, -2.5]} />
<DustParticles position={[1.5, 0, -2]} />
<DustParticles position={[-5, 0, -2]} />

<T.PointLight name={'window bounce light'} position={[3, 4, 0]} distance={10} color={'#ffffff'} intensity={1.5} />
<T.PointLight name={'window bounce light'} position={[-4, 4, 0]} distance={10} color={'#ffffff'} intensity={1.5} />
<T.PointLight name={'yellow light'} position={[-7, 3, 0]} distance={8} color={'#deac40'} intensity={1.5} />

{#await windowTexture then t}
    <T.SpotLight
        name={'window light'}
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
        <T.Mesh name={'window light target'} attach={'target'} visible={false} position={[0, -1, -0.8]} />
        <!--  <Portal object={scene}>
            <T.SpotLightHelper args={[ref]} />
        </Portal> -->
    </T.SpotLight>

    <T.SpotLight
        name={'window light'}
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
        <T.Mesh name={'window light target'} attach={'target'} visible={false} position={[0, -1, -0.8]} />
        <!--  <Portal object={scene}>
            <T.SpotLightHelper args={[ref]} />
        </Portal> -->
    </T.SpotLight>
{/await}
