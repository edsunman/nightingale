<script lang="ts">
    import { T, useThrelte } from '@threlte/core'
    import { onDestroy } from 'svelte'
    import Floor from '../objects/Floor.svelte'
    import Character from '../objects/Character.svelte'
    import Rocks from '../objects/scene1/Rocks.svelte'
    import Door from '../objects/Door.svelte'
    import Spaceship from '../objects/scene1/Spaceship.svelte'
    import Wind from '../objects/scene1/Wind.svelte'
    import DesertTent from '../objects/scene1/Desert_tent.svelte'
    import DesertSand from '../objects/scene1/Desert_sand.svelte'
    import Area from '../objects/Area.svelte'
    import GameOverAction from '../objects/GameOverAction.svelte'
    import Smoke from '../objects/scene1/Smoke.svelte'
    import WindAudio from '../objects/audio/WindAudio.svelte'
    import SceneData from '../objects/SceneData.svelte'

    import type { AvoidObject, GameData } from '$lib/types'
    
    export let gameData: GameData

    const { scene } = useThrelte()

    const avoidArray: AvoidObject[] = [
        // ship
        { x: 21, z: -25.5, scaleX: 5, scaleZ: 10 },
        { x: 27.5, z: -25.5, scaleX: 8, scaleZ: 4 },
        { x: 17.5, z: -25.5, scaleX: 2, scaleZ: 2 },
        // landing pads
        { x: 32, z: -25.5, scaleZ: 8 },
        { x: 16, z: -25.5, scaleZ: 8 },
        { x: -23, z: -28, scaleX: 8 },
        { x: -23, z: -12, scaleX: 8 },
        { x: -3, z: 24, scaleZ: 8 },
        { x: -19, z: 24, scaleZ: 8 },
        // crates
        { x: 18, z: -19 },
        { x: 19, z: -17.5, scaleZ: 2 },
        { x: 9, z: -1 },
        // buildings
        { x: 5, z: 24.5, scaleX: 3, scaleZ: 6 },
        { x: 4.5, z: 20.5, scaleX: 2, scaleZ: 2 },
        { x: 15.5, z: 24.5, scaleX: 6, scaleZ: 12 },
        { x: 19.5, z: 28.5, scaleX: 2, scaleZ: 2 },
        { x: 3.5, z: 2.5, scaleX: 6, scaleZ: 4 },
        { x: -33, z: 17, scaleX: 3, scaleZ: 5 },
        // containers
        { x: -4, z: -27.5, scaleX: 3, scaleZ: 6 },
        { x: -16.5, z: -27.5, scaleX: 6, scaleZ: 6 },
        { x: -23.5, z: -4, scaleX: 6, scaleZ: 3 },
        // market
        { x: -16, z: -23, scaleX: 3, scaleZ: 3 },
        { x: -22, z: -10, scaleX: 3, scaleZ: 3 },
        // table and tent
        { x: 12, z: -3, scaleZ: 3 },
        { x: 11, z: -3 },
        { x: 13, z: -8, scaleX: 3 },
        { x: 10.5, z: -6.5, scaleX: 2, scaleZ: 2 },
        { x: 8.5, z: -4.5, scaleX: 2, scaleZ: 2 },
        { x: 7.5, z: -2.5, scaleX: 2, scaleZ: 2 },
        // guard
        { x: 20, z: 22 },
        // gravestones
        { x: -28, z: 10 },
        { x: -26, z: 14 },
        { x: -30, z: 24 }
    ]

    onDestroy(() => {
        scene.fog = null
    })
</script>

<T.Fog
    near={35}
    far={45}
    color={'#bc733f'}
    on:create={({ ref }) => {
        scene.fog = ref
    }}
/>-

<Area
    id={1}
    points={[
        { x: 24, z: -25 },
        { x: 24, z: -21 },
        { x: 28, z: -21 },
        { x: 28, z: -25 }
    ]}
    let:inArea
    noRepeat
    requiredItem={2}
>
    <GameOverAction {inArea} />
</Area>
<Floor {avoidArray} startingPosition={{ x: 26, z: -22 }} startingRotation={{ x: 26, z: -21 }} levelSize={{ x: 70, z: 70 }} />

<T.Mesh position={[0.5, -0.01, 0.5]} visible={true} name="ground" receiveShadow>
    <T.BoxGeometry args={[100, 0.01, 100]} />
    <T.MeshToonMaterial color="#a6663d" />
</T.Mesh>

<Door
    url={'/objects/stone_assets-transformed.glb'}
    nodeName={'Door'}
    position={[-31.5, 0, 17]}
    activeSquare={{ x: -31, z: 17 }}
    scene={2}
    message="An ancient wooden door"
/>
<Door
    url={'/objects/tech_assets-transformed.glb'}
    nodeName={'Door'}
    position={[18.5, 0, 23]}
    activeSquare={{ x: 19, z: 23 }}
    scene={3}
    message="A door to a millatry building"
    key={102}
/>

<!-- CHARACTERS -->

<Character
    message="A hologram flickers through the dust"
    position={{ x: 21, y: 0, z: -18 }}
    url={'/objects/character_hologram-transformed.glb'}
    characterId={1}
    rotation={1.5708}
    animation={{ key: 'wave', repeatTime: 8000, stopWhenSpokenTo: true }}
    isHologram
    rotateTowardsPlayer
/>
<Character
    message="A soldier"
    position={{ x: 11, y: 0, z: -3 }}
    url={'/objects/character_soldierB-transformed.glb'}
    characterId={2}
    rotation={1.5708}
    currentActionKey={'idle'}
    extraChatPositions={[
        { x: 13, z: -4 },
        { x: 13, z: -3 },
        { x: 13, z: -2 }
    ]}
    pingPongIdle
    scale={1.1}
/>
<Character
    message="An elderly woman"
    position={{ x: -16, y: 0, z: -23 }}
    url={'/objects/character_oldWoman-transformed.glb'}
    characterId={20}
    currentActionKey={'idle'}
    spinHeadWhenTalking
    extraChatPositions={[
        { x: -17, z: -21 },
        { x: -16, z: -21 },
        { x: -15, z: -21 }
    ]}
/>
<Character
    message="A soldier guards the door"
    position={{ x: 20, y: 0, z: 22 }}
    url={'/objects/character_soldier-transformed.glb'}
    characterId={21}
    rotation={1.57}
    currentActionKey={'idle'}
    scale={1.1}
    spinHeadWhenTalking
/>

<!-- OBJECTS -->
<DesertSand />
<Rocks />
<SceneData sceneId={1} {gameData} />
<DesertTent name={'tent'} scale={1.1} position={[10, 0, -4]} rotation.y={0.7} />
<Spaceship position={[23, 2, -25.5]} scale={1.8} rotation.y={0} />
<Wind />
<Smoke />

<!-- LIGHTS + AUDIO -->

<T.AmbientLight intensity={0.1} />
<WindAudio />
