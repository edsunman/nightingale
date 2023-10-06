<script lang="ts">
    import { gameState, gameMovingTo } from '$lib/stores'
    import { T, useFrame } from '@threlte/core'
    import { Grid, Instance, InstancedMesh } from '@threlte/extras'
    import Player from './Player.svelte'
    import { checkColission } from '$lib/util'

    import type { PlayerState, Block } from '$lib/types'

    export let levelSize = { x: 100, z: 100 }
    export let blocks: Block[] = []
    export let startingPosition = { x: 0, z: 0 }
    export let startingRotation = { x: 0, z: 0 }
    export let cameraOffset = { x: 0, z: 0 }
    export let floorType = 'sand'
    export let sunIntensity = 1

    let next = $gameState.nextScenePosition
    let playerPosition = next.x === 0 && next.z === 0 ? startingPosition : next
    $gameMovingTo = playerPosition

    let playerState: PlayerState = {
        position: playerPosition,
        rotation: startingRotation,
        annimation: 'idle',
        path: [],
        arrived: false,
        settingOff: true,
        floorType: floorType,
        running: false,
        sunIntensity: sunIntensity,
        movementType: 'none',
        comingToAStop: false
    }

    let selectedGridSpace: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 }
    let avoidObjects: any[] = []
    let selectedOpacity = 0
    let selectedColour = 'White'
    let selectedSize = 0.5

    function floorClicked(e: any) {
        if (playerState.movementType === 'keyboard') return
        const p = playerState.position
        const point = e.intersections[0].point
        const grid = { x: Math.round(point.x), z: Math.round(point.z) }
        if (e.intersections[0].eventObject.name === 'floor' && $gameState.moveLock == false) {
            playerState.path.length = 0
            const { square, hit } = checkColission(p, grid, avoidObjects)
            if (hit) {
                $gameMovingTo = { x: square.x, z: square.z }
                playerState.path.push({ x: square.x, z: square.z })
                selectedColour = 'Red'
            } else {
                $gameMovingTo = { x: grid.x, z: grid.z }
                playerState.path.push({ x: grid.x, z: grid.z })
                selectedColour = 'White'
            }
            selectedGridSpace = { x: grid.x, y: 0, z: grid.z }
            playerState.settingOff = true
            playerState.movementType = 'mouse'
            selectedOpacity = 1
            selectedSize = 0.4
        }
    }

    useFrame((state, delta) => {
        selectedOpacity -= delta * 2
        if (selectedOpacity < 0) selectedOpacity = 0
        if (selectedSize < 1) {
            selectedSize += delta * 0.8
        }
    })
</script>

<Player {playerState} {cameraOffset} {levelSize} {avoidObjects} />

<T.Mesh position={[0.5, -0.01, 0.5]} visible={false} name="floor" on:click={(e) => floorClicked(e)}>
    <T.BoxGeometry args={[levelSize.x, 0.01, levelSize.z]} />
</T.Mesh>
<InstancedMesh visible={$gameState.dev.avoidObjectsVisible}>
    {#each blocks as block}
        <Instance
            name={'avoid object'}
            scale={[block.scale_x, 1, block.scale_z]}
            position={[block.position_x, 0, block.position_z]}
            on:create={({ ref }) => {
                avoidObjects.push(ref)
            }}
        />
    {/each}
    <T.BoxGeometry args={[1, 0.1, 1]} />
    <T.MeshStandardMaterial color="#161616" />
</InstancedMesh>
<T.Mesh
    receiveShadow
    rotation.x={-1.57}
    visible={true}
    name={'selected grid square'}
    scale={[selectedSize, selectedSize, 1]}
    position={[selectedGridSpace.x, 0.05, selectedGridSpace.z]}
>
    <T.RingGeometry args={[0.4, 0.5]} />
    <T.MeshToonMaterial color={selectedColour} opacity={selectedOpacity} emissive={selectedColour} transparent={true} />
</T.Mesh>

{#if $gameState.dev.grid}
    <Grid
        visible={true}
        position={[0.5, 0.001, 0.5]}
        cellColor="#ffffff"
        sectionColor="#ffffff"
        sectionThickness={0}
        fadeDistance={50}
        cellSize={1}
        gridSize={[levelSize.x, levelSize.z]}
    />
{/if}
