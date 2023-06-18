<script lang="ts">
    import { gameState } from '$lib/stores'
    import { T, useFrame } from '@threlte/core'
    import { Grid } from '@threlte/extras'
    import Player from './Player.svelte'
    import { Raycaster, Vector3 } from 'three'

    import type { PlayerState } from '$lib/types'

    export let levelSize = { x: 100, z: 100 }
    export let avoidArray: Array<{ x: number; z: number }> = []
    export let startingPosition = { x: 0, z: 0 }
    export let startingRotation = { x: 0, z: 0 }
    export let floorType = 'sand'
    export let sunIntensity = 0.8

    let next = $gameState.nextScenePosition
    let playerState: PlayerState = {
        position: next.x === 0 && next.z === 0 ? startingPosition : next,
        rotation: startingRotation,
        annimation: 'idle',
        path: [],
        arrived: false,
        settingOff: true,
        floorType: floorType,
        running: false,
        sunIntensity: sunIntensity
    }

    let direction = new Vector3()
    const raycaster = new Raycaster()
    let selectedGridSpace: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 }
    let avoidObjects: any[] = []
    let selectedOpacity = 0
    let selectedColour = 'White'
    let selectedSize = 1

    function floorClicked(e: any) {
        const p = playerState.position
        playerState.path = []
        if (e.intersections[0].eventObject.name === 'floor' && $gameState.moveLock == false) {
            const point = e.intersections[0].point
            const grid = { x: Math.round(point.x), z: Math.round(point.z) }
            const gridVec = new Vector3(grid.x, 0, grid.z)
            const playerVec = new Vector3(p.x, 0, p.z)

            direction.subVectors(gridVec, playerVec).normalize()
            raycaster.set(playerVec, direction)

            const intersects = raycaster.intersectObjects(avoidObjects, false)
            const dist = Math.sqrt((grid.x - playerVec.x) ** 2 + (grid.z - playerVec.z) ** 2)

            if (intersects.length > 0) {
                // pointing towards wall
                // move towards wall and stop
                const ip = intersects[0].point
                let gridIp = { x: 0, z: 0 }

                if (p.x < ip.x) {
                    gridIp.x = Math.round(ip.x - 0.5)
                } else if (p.x > ip.x) {
                    gridIp.x = Math.round(ip.x + 0.5)
                } else {
                    gridIp.x = Math.round(ip.x)
                }

                if (p.z < ip.z) {
                    gridIp.z = Math.round(ip.z - 0.5)
                } else if (p.z > ip.z) {
                    gridIp.z = Math.round(ip.z + 0.5)
                } else {
                    gridIp.z = Math.round(ip.z)
                }

                if (intersects[0].distance > dist) {
                    playerState.path.push({ x: grid.x, z: grid.z })
                    selectedColour = 'White'
                } else {
                    playerState.path.push({ x: gridIp.x, z: gridIp.z })
                    selectedColour = 'Red'
                }
            } else {
                playerState.path.push({ x: grid.x, z: grid.z })
                selectedColour = 'White'
            }
            selectedGridSpace = { x: grid.x, y: 0, z: grid.z }
            playerState.settingOff = true
            selectedOpacity = 1
            selectedSize = 0.8
        }
    }

    useFrame((state, delta) => {
        selectedOpacity -= delta * 2
        if (selectedSize > 0) {
            selectedSize -= delta * 0.2
        }
    })
</script>

<Player {playerState} />

<T.Mesh position={[0.5, -0.01, 0.5]} visible={false} name="floor" receiveShadow on:click={(e) => floorClicked(e)}>
    <T.BoxGeometry args={[levelSize.x, 0.01, levelSize.z]} />
</T.Mesh>

{#each avoidArray as block}
    <T.Mesh
        name={'avoid object'}
        scale={[1, 1, 1]}
        visible={$gameState.dev.avoidObjactsVisible}
        position={[block.x, 0, block.z]}
        on:create={({ ref }) => {
            avoidObjects.push(ref)
        }}
    >
        <T.BoxGeometry args={[1, 0.1, 1]} />
        <T.MeshStandardMaterial color="#161616" />
    </T.Mesh>
{/each}

<T.Mesh
    receiveShadow
    rotation.x={-1.57}
    visible={true}
    name={'selectedGridSquare'}
    scale={[selectedSize, selectedSize, 1]}
    position={[selectedGridSpace.x, 0.01, selectedGridSpace.z]}
>
    <!--<T.CylinderGeometry args={[0.5, 0.5, 0.06]}  />-->
    <T.RingGeometry args={[0.35, 0.5]} />
    <T.MeshToonMaterial color={selectedColour} opacity={selectedOpacity} transparent={true} />
</T.Mesh>

{#if $gameState.dev.grid}
    <Grid
        visible={true}
        position={[0.5, 0.001, 0.5]}
        cellColor="#ffffff"
        sectionColor="#ffffff"
        sectionThickness={0}
        fadeDistance={25}
        cellSize={1}
        gridSize={[levelSize.x, levelSize.z]}
    />
{/if}
