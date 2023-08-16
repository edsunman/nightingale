<script lang="ts">
    import { T } from '@threlte/core'
    import Floor from '../objects/Floor.svelte'
    import Door from '../objects/Door.svelte'
    import { useTexture } from '@threlte/extras'
    import Character from '../objects/Character.svelte'
    import FloorStones from '../objects/scene2/FloorStones.svelte'
    import Pillar from '../objects/scene2/Pillar.svelte'
    import DustParticles from '../objects/scene2/DustParticles.svelte'
    import Item from '../objects/Item.svelte'
    import Smoke from '../objects/scene2/Smoke.svelte'
    import SceneData from '../objects/SceneData.svelte'

    import type { AvoidObject, GameData } from '$lib/types'

    export let gameData : GameData

    const avoidArray: AvoidObject[] = [
        { x: 5.5, z: -2.5, scaleX: 2, scaleZ: 2 },
        { x: -0.5, z: -2.5, scaleX: 2, scaleZ: 2 },
        { x: -6.5, z: -2.5, scaleX: 2, scaleZ: 2 },
        { x: -6.5, z: 3.5, scaleX: 2, scaleZ: 2 },
        { x: 5.5, z: 3.5, scaleX: 2, scaleZ: 2 },
        { x: -0.5, z: 3.5, scaleX: 2, scaleZ: 2 },
        { x: 2, z: -2, scaleX: 3 },
        { x: 9, z: -3, scaleZ: 3 },
        { x: -3, z: 4, scaleZ: 3 },
        { x: -2, z: 4 },
        { x: 8, z: -2 },
        { x: 3, z: -3 },
        { x: -7, z: 0.5, scaleZ: 4 },
        { x: -8, z: 0 },
        { x: -9, z: 0 },
        { x: -9, z: 4 },
        { x: -9, z: -3.5, scaleZ: 2 }
    ]

    const windowTexture = useTexture('/texture/window.png')
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
<Door
    url={'/objects/stone_assets-transformed.glb'}
    nodeName={'Door'}
    position={[10.5, 0, 1]}
    activeSquare={{ x: 10, z: 1 }}
    scene={1}
    nextScenePosition={{ x: -30, z: 17 }}
    message={'Back to the outpost'}
/>

<!-- CHARACTERS   -->

<Character
    message="A hologram dances"
    position={{ x: -0.5, y: 1.8, z: -2.5 }}
    url={'/objects/character_hologram-transformed.glb'}
    characterId={0}
    currentActionKey={'dance'}
    isHologram
    pingPongIdle
/>

<Character
    message="Bartender"
    position={{ x:-8.4, y: 0, z: 0 }}
    url={'/objects/character_bartender-transformed.glb'}
    characterId={22}
    rotation={1.57}
    scale={1.1}
    spinHeadWhenTalking
    extraChatPositions={[
        { x: -6, z: -1 },
        { x: -6, z: 0 },
        { x: -6, z: 1 },
        { x: -6, z: 2 }
    ]}
/>
<Character
    message="An old soldier"
    position={{ x: 3, y: 0, z: -3 }}
    url={'/objects/character_major-transformed.glb'}
    characterId={23}
    rotation={0}
    chatRadius={1}
    extraChatPositions={[
        { x: 2, z: -1 },
        { x: 3, z: -1 },
        { x: 4, z: -1 }
    ]}
    scale={1.1}
    animation={{ key: 'drink', repeatTime: 16000 }}
/>

<!-- OBJECTS -->

<SceneData {gameData} sceneId={2} />

<Pillar
    position={[5.5, 0, 3.5]}
    hidePoints={[
        { x: 6, z: 2 },
        { x: 4, z: 4 },
        { x: -1.5, z: -1 },
        { x: 3, z: -1.5 }
    ]}
/>
<Pillar
    position={[-0.5, 0, 3.5]}
    rotation.y={1.57}
    hidePoints={[
        { x: 0, z: 2 },
        { x: -2, z: 4 },
        { x: -7, z: 1 },
        { x: -5, z: -3.5 }
    ]}
/>

<DustParticles position={[1.5, 0, -2]} />
<DustParticles position={[-5, 0, -2]} />
<Smoke />
<FloorStones />
<Item
    id={1}
    position={{ x: -9, y: 0, z: 5 }}
    rotation={[3.14, 1.57, 0]}
    scale={0.2}
    url="/objects/item_cardboardBox-transformed.glb"
/>
<!-- LIGHTS + AUDIO-->

<T.PointLight name={'window bounce light'} position={[3, 4, 0]} distance={10} color={'#ffffff'} intensity={1.5} />
<T.PointLight name={'window bounce light'} position={[-4, 4, 0]} distance={10} color={'#ffffff'} intensity={1.5} />

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
    </T.SpotLight>
{/await}
