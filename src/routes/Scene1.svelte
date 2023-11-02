<script lang="ts">
    import { T, useThrelte } from '@threlte/core'
    import { useTexture } from '@threlte/extras'
    import { onDestroy } from 'svelte'
    import { Vector3 } from 'three'
    import { gamePosition } from '$lib/stores'
    import Character from '../objects/Character.svelte'
    import Rocks from '../objects/scene1/Rocks.svelte'
    import Door from '../objects/Door.svelte'
    import Spaceship from '../objects/scene1/Spaceship.svelte'
    import Wind from '../objects/scene1/Wind.svelte'
    import DesertTent from '../objects/scene1/Desert_tent.svelte'
    import Area from '../objects/Area.svelte'
    import GameOverAction from '../objects/scene1/actions/GameOverAction.svelte'
    import WindAudio from '../objects/audio/WindAudio.svelte'
    import MainMenuAction from '../objects/scene1/actions/MainMenuAction.svelte'

    import type { GameData, Scene } from '$lib/types'
    import SceneData from '../objects/SceneData.svelte'
    import Emitter from '$lib/components/emitter/Emitter.svelte'

    const t = useTexture('/texture/circle.png')

    export let gameData: GameData
    const sceneData = gameData.scenes.find((s) => s.id === 1) as Scene

    let cameraOffset: { x: number; z: number }

    const { scene } = useThrelte()

    let emmitPosition = new Vector3(0, 4, 0)

    const updateP = (gp: any) => {
        emmitPosition.x = gp.x
        emmitPosition.z = gp.z + 15
    }

    $: updateP($gamePosition)

    onDestroy(() => {
        scene.fog = null
    })
</script>

{#await t then t}
    <Emitter
        debug
        position={emmitPosition}
        scale={new Vector3(20, 2, 1)}
        count={35}
        life={3}
        wind={new Vector3(0, 0, -50)}
        color={'rgba(188, 115, 63, 1) 0%'}
        size={'size(3) 0%'}
        sizeRandom={5}
        lightnessRandom={0.2}
        driftAmount={4}
        driftSpeed={1}
        alphaMap={t}
    />
{/await}

<T.Fog
    near={35}
    far={45}
    color={'#bc733f'}
    on:create={({ ref }) => {
        scene.fog = ref
    }}
/>

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

<MainMenuAction bind:cameraOffset />

<SceneData scene={sceneData} {cameraOffset} />

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

<Rocks />

<DesertTent name={'tent'} scale={1.1} position={[10, 0, -4]} rotation.y={0.7} />
<Spaceship position={[23, 2, -25.5]} scale={1.8} rotation.y={0} />
<Wind />
<!--
<Smoke />
-->
<!-- LIGHTS + AUDIO -->

<T.AmbientLight intensity={0.1} />
<WindAudio />
