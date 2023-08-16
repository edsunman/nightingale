<script lang="ts">
    import { gameState } from '$lib/stores'
    import { T } from '@threlte/core'
    import { onMount } from 'svelte'
    import Floor from '../objects/Floor.svelte'
    import Door from '../objects/Door.svelte'
    import Item from '../objects/Item.svelte'
    import SceneData from '../objects/SceneData.svelte'

    import type { AvoidObject, GameData } from '$lib/types'

    export let gameData : GameData

    const avoidArray: AvoidObject[] = [
        { x: -1, z: 2 },
        { x: -2, z: 3 },
        { x: 0.5, z: -5, scaleX: 4 },
        {x:-2,z:-4}
    ]

    let flickeringInterval: ReturnType<typeof setInterval>
    let lightBrightness: number

    onMount(() => {
        flickeringInterval = setInterval(function () {
            lightBrightness = Math.random() * 1 + 0
        }, 30)
        setTimeout(function () {
            clearInterval(flickeringInterval)
            lightBrightness = 1
        }, 3000)

        if (!$gameState.inventory.owned.includes(104)) {
            $gameState.inventory.owned.push(104)
            $gameState = $gameState
        }
    })
</script>

<Floor
    levelSize={{ x: 6, z: 12 }}
    {avoidArray}
    startingPosition={{ x: 2, z: -1 }}
    startingRotation={{ x: 1, z: -1 }}
    floorType="stone"
    sunIntensity={0}
/>

<T.Mesh position={[0.5, -0.01, 0.5]} visible={true} name="ground" receiveShadow>
    <T.BoxGeometry args={[6, 0.01, 12]} />
    <T.MeshStandardMaterial color="#444441" />
</T.Mesh>

<Door
    url={'/objects/tech_assets-transformed.glb'}
    nodeName={'Door'}
    name="Door"
    position={[3.5, 0, -1]}
    activeSquare={{ x: 3, z: -1 }}
    scene={1}
    nextScenePosition={{ x: 20, z: 23 }}
    message="Back to the outpost"
/>

<SceneData sceneId={3} {gameData} />

<Item id={2} position={{ x: -1, y: 1.25, z: 2 }} scale={0.2} url="/objects/item_fuelCell-transformed.glb" />

<T.Mesh position={[0.5, 2.5, 0]} visible={true} name="light-box">
    <T.BoxGeometry args={[0.2, 0.1, 2]} />
    <T.MeshToonMaterial color="#ffffff" emissive="#ffffff" transparent={true} opacity={lightBrightness * 0.8} />
</T.Mesh>

<T.PointLight
    position={[0.5, 4, 0]}
    distance={8}
    color={'#ffffff'}
    intensity={lightBrightness * 4}
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
