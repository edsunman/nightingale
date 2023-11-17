<script lang="ts">
    import { gameState, gamePosition, gameSelectedCharacterPosition, gameLoaded, gameCameraPosition, gameZoom } from '$lib/stores'
    import { useGltf, useGltfAnimations, useTexture } from '@threlte/extras'
    import { T, useFrame, forwardEventHandlers } from '@threlte/core'
    import { Vector3, Matrix4, Group, Quaternion, SRGBColorSpace, LinearSRGBColorSpace, Path, MeshBasicMaterial } from 'three'
    import RunningAudio from './audio/RunningAudio.svelte'

    import type { PlayerState } from '$lib/types'
    import KeyboardControls from './KeyboardControls.svelte'

    export let playerState: PlayerState
    export let cameraOffset = { x: 0, z: 0 }
    export let levelSize: any
    export let avoidObjects: any
    export const ref = new Group()

    const gltf = useGltf('/objects/player-transformed.glb', { useDraco: true })
    const texture = useTexture('/texture/playerAtlas.png')
    const { actions } = useGltfAnimations(gltf, ref)
    const component = forwardEventHandlers()
    const playerVector = new Vector3(playerState.position.x, 0, playerState.position.z)
    const destinationVector = new Vector3(playerState.rotation.x, 0, playerState.rotation.z)
    const upVector = new Vector3(0, 1, 0)
    const rotationMatrix = new Matrix4().lookAt(destinationVector, playerVector, upVector)
    const endRotation = new Quaternion().setFromRotationMatrix(rotationMatrix)
    const cameraHeight = 20

    let mesh: any
    let currentActionKey = playerState.annimation
    let lightTarget: any
    let runningSound: any
    let zoom = 8
    let loaded = false
    let cameraPosition = {
        x: playerState.position.x,
        z: playerState.position.z
    }

    $: $actions[playerState.annimation]?.play()

    $: checkLoaded($gameLoaded)

    function checkLoaded(gl: boolean) {
        if (gl) {
            zoom = $gameZoom
            setTimeout(() => {
                loaded = true
                cameraPosition = {
                    x: playerState.position.x + cameraOffset.x,
                    z: playerState.position.z + cameraOffset.z
                }
            }, 500)
        }
    }

    $: {
        if (zoom > 8) zoom = $gameZoom
    }

    $: offsetCamera(cameraOffset)

    function offsetCamera(cameraOffset: { x: number; z: number }) {
        if (loaded) {
            cameraPosition = {
                x: playerState.position.x + cameraOffset.x,
                z: playerState.position.z + cameraOffset.z
            }
        }
    }

    function transitionTo(nextActionKey: string, duration = 0.2) {
        const currentAction = $actions[currentActionKey]
        const nextAction = $actions[nextActionKey]
        if (!nextAction || currentAction === nextAction) return
        nextAction.enabled = true
        if (currentAction) {
            currentAction.crossFadeTo(nextAction, duration, true)
        }
        nextAction.play()
        currentActionKey = nextActionKey
    }

    $: rotateTowards($gameState.moveLock)

    function rotateTowards(ml: any) {
        if (ml) {
            const sc = $gameSelectedCharacterPosition
            if (!(sc.x == 0 && sc.z == 0)) {
                const p = playerState.position
                destinationVector.set(sc.x, 0, sc.z)
                playerVector.set(p.x, 0, p.z)
                rotationMatrix.lookAt(destinationVector, playerVector, upVector)
                endRotation.setFromRotationMatrix(rotationMatrix)
            }
        }
    }

    useFrame((state, delta) => {
        const p = playerState.position
        const path = playerState.path
        if (path.length > 0) {
            // TODO : this is prob not the best way to do player movement...
            // moving along a THREE.Line3 may be better ??
            const radians = Math.atan2(path[0].z - p.z, path[0].x - p.x)
            const modifier = { x: Math.cos(radians), z: Math.sin(radians) }
            if (p.x < path[0].x + 0.04 && p.x > path[0].x - 0.04 && p.z < path[0].z + 0.04 && p.z > path[0].z - 0.04) {
                // reached destination so snap to grid
                playerState.position.z = path[0].z
                playerState.position.x = path[0].x
                playerState.settingOff = true
                playerState.arrived = false
                playerState.path.shift()
            } else {
                // get moving
                if (playerState.settingOff) {
                    transitionTo('run')
                    !playerState.running && runningSound()
                    playerState.running = true
                }
                playerState.settingOff = false
                if (delta < 0.5) {
                    // ^^^^^^ don't move if there are one off frame time spikes caused by switching tabs etc
                    destinationVector.set(path[0].x, 0, path[0].z)
                    playerVector.set(p.x, 0, p.z)
                    rotationMatrix.lookAt(destinationVector, playerVector, upVector)
                    endRotation.setFromRotationMatrix(rotationMatrix)
                    playerState.position.x = p.x + modifier.x * delta * 4
                    playerState.position.z = p.z + modifier.z * delta * 4
                    cameraPosition.x = playerState.position.x + cameraOffset.x
                    cameraPosition.z = playerState.position.z + cameraOffset.z
                }
            }
        } else {
            if (!playerState.arrived) {
                playerState.comingToAStop = false
                playerState.running = false
                playerState.movementType = 'none'
                transitionTo('idle')
                runningSound(false)
            }
            playerState.arrived = true
        }
        ref && ref.quaternion.rotateTowards(endRotation, delta * 10)
        $gamePosition = playerState.position
        $gameCameraPosition = cameraPosition
    })
</script>

<T
    is={ref}
    dispose={false}
    {...$$restProps}
    bind:this={$component}
    position.x={playerState.position.x}
    position.y={0}
    position.z={playerState.position.z}
>
    {#await gltf then gltf}
        <T.Group name="Scene">
            <T.Group name="Armature" bind:this={mesh} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
                <T is={gltf.nodes.mixamorigHips} />
                <T is={gltf.nodes.Box_Bone} />
                {#if $gameState.inventory.equipped !== 1}
                    <T.SkinnedMesh castShadow name="Mesh" geometry={gltf.nodes.Mesh.geometry} skeleton={gltf.nodes.Mesh.skeleton}>
                        {#await texture then t}
                            <T.MeshToonMaterial color="#ffffff">
                                <T is={t} attach="map" flipY={false} />
                            </T.MeshToonMaterial>
                        {/await}
                    </T.SkinnedMesh>
                {:else}
                    <T.SkinnedMesh castShadow name="Box" geometry={gltf.nodes.Box.geometry} skeleton={gltf.nodes.Box.skeleton}>
                        {#await texture then t}
                            <T.MeshToonMaterial color="#ffffff">
                                <T is={t} attach="map" flipY={false} />
                            </T.MeshToonMaterial>
                        {/await}
                    </T.SkinnedMesh>
                {/if}
                {#if $gameState.inventory.equipped === 5}
                    <T.SkinnedMesh
                        castShadow
                        name="Mask"
                        geometry={gltf.nodes.Mask.geometry}
                        material={gltf.nodes.Mask.material}
                        skeleton={gltf.nodes.Mask.skeleton}
                    />
                {/if}
            </T.Group>
        </T.Group>
    {/await}
</T>

{#if !$gameState.dev.camera}
    <T.OrthographicCamera
        name="main camera"
        makeDefault
        position={[cameraPosition.x + 19, cameraHeight, cameraPosition.z + 19]}
        on:create={({ ref }) => {
            ref.lookAt(cameraPosition.x + 18, cameraHeight - 1, cameraPosition.z + 18)
        }}
        {zoom}
    />
{/if}

<T.DirectionalLight
    name="sun"
    intensity={playerState.sunIntensity}
    castShadow
    shadow.mapSize.width={2048}
    shadow.mapSize.height={2048}
    shadow.camera.top={9}
    shadow.camera.right={6.5}
    shadow.camera.left={-16.5}
    shadow.camera.bottom={-6}
    position={[cameraPosition.x + 12, 20, cameraPosition.z + 20]}
    target={lightTarget}
/>

<T.Mesh bind:ref={lightTarget} visible={false} scale={[1, 1, 1]} position={[cameraPosition.x + 8, 8, cameraPosition.z + 8]} />

<T.Mesh
    name="player grid square"
    receiveShadow
    visible={false}
    scale={[1, 1, 1]}
    position={[playerState.position.x, 0, playerState.position.z]}
>
    <T.BoxGeometry args={[1, 0.1, 1]} />
    <T.MeshStandardMaterial color="#9932CC" />
</T.Mesh>
<!--
{#each playerState.path as p}
    <T.Mesh name="debug square" receiveShadow visible={true} scale={[1, 1, 1]} position={[p.x, 0, p.z]}>
        <T.BoxGeometry args={[1, 0.1, 1]} />
        <T.MeshStandardMaterial color="#9932CC" />
    </T.Mesh>
{/each}-->

<RunningAudio floorType={playerState.floorType} bind:runningSound />

<KeyboardControls bind:playerState {levelSize} {avoidObjects} />
