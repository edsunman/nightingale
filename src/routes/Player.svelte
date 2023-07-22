<script lang="ts">
    import { gameState, gamePosition, gameSelectedCharacterPosition, gameVolume } from '$lib/stores'
    import { useGltf, useGltfAnimations, Audio, useTexture } from '@threlte/extras'
    import { T, useFrame, forwardEventHandlers } from '@threlte/core'
    import { Vector3, Matrix4, Group, Quaternion, sRGBEncoding } from 'three'

    import type { PlayerState } from '$lib/types'
    import { onMount } from 'svelte'

    export let playerState: PlayerState

    export const ref = new Group()
    const gltf = useGltf('/objects/player-transformed.glb', { useDraco: true })
    export const { actions, mixer } = useGltfAnimations(gltf, ref)
    const component = forwardEventHandlers()
    const texture = useTexture('/texture/playerAtlas.png')

    let mesh: any
    let currentActionKey = playerState.annimation
    let lightTarget: any
    let movementVector = new Vector3()
    let runAudio: any
    let audioSrc: string
    let footstepInterval: number
    let footstepVolume = 0.4
    let zoom = 8

    const rotationMatrix = new Matrix4().lookAt(
        new Vector3(playerState.rotation.x, 0, playerState.rotation.z),
        new Vector3(playerState.position.x, 0, playerState.position.z),
        new Vector3(0, 1, 0)
    )
    const endRotation = new Quaternion().setFromRotationMatrix(rotationMatrix)

    if (playerState.floorType === 'stone') {
        audioSrc = '/audio/footstep-stone.mp3'
    } else {
        audioSrc = '/audio/footstep-sand.mp3'
    }

    $: $actions[playerState.annimation]?.play()

    $: rotateTowards($gameState.moveLock)

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

    function rotateTowards(ml : any) {
        const sc = $gameSelectedCharacterPosition
        if (!(sc.x == 0 && sc.z == 0)) {
            const p = playerState.position
            // TODO : reuse vector3 rather than create
            const v = new Vector3(sc.x, 0, sc.z)
            const pv = new Vector3(p.x, 0, p.z)
            rotationMatrix.lookAt(v, pv, new Vector3(0, 1, 0))
            endRotation.setFromRotationMatrix(rotationMatrix)
        }
    }

    function playFootstep() {
        const source = runAudio.context.createBufferSource()
        const gainNode = runAudio.context.createGain()
        let randomGain = Math.random()
        let step = Math.floor(Math.random() * 3)
        if (randomGain < 0.5) randomGain += 0.5
        randomGain = randomGain * $gameVolume * footstepVolume
        source.detune.value = Math.floor(Math.random() * 400)
        source.buffer = runAudio.buffer
        gainNode.gain.value = randomGain
        source.connect(gainNode)
        gainNode.connect(runAudio.context.destination)
        source.start(runAudio.context.currentTime + 0.08, step, 1)
    }

    useFrame((state, delta) => {
        // player movement
        const p = playerState.position
        const path = playerState.path
        if (path.length > 0) {
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
                    const v = new Vector3(path[0].x, 0, path[0].z)
                    const pv = new Vector3(p.x, 0, p.z)
                    rotationMatrix.lookAt(v, pv, new Vector3(0, 1, 0))
                    endRotation.setFromRotationMatrix(rotationMatrix)
                    movementVector = v.sub(pv).normalize()
                    transitionTo('run')
                    if (!playerState.running) {
                        clearInterval(footstepInterval)
                        playFootstep()
                        footstepInterval = window.setInterval(function () {
                            playFootstep()
                        }, 330)
                    }
                    playerState.running = true
                }
                playerState.settingOff = false
                if (delta < 0.5) { // don't move if there are one off spikes caused by switching tabs etc
                    playerState.position.x = p.x + modifier.x * delta * 4
                    playerState.position.z = p.z + modifier.z * delta * 4
                }
            }
        } else {
            if (!playerState.arrived) {
                playerState.running = false
                transitionTo('idle')
                clearInterval(footstepInterval)
            }
            playerState.arrived = true
        }
        if (ref) {
            ref.quaternion.rotateTowards(endRotation, delta * 10)
        }
        $gamePosition = playerState.position
    })

    onMount(() => {
        // zoom out breifly on load to compile shaders
        setTimeout(() => {
            zoom = 80
        }, 800)
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
    {#await gltf}
        <slot name="fallback" />
    {:then gltf}
        <T.Group name="Scene">
            <T.Group name="Armature" bind:this={mesh} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
                <T is={gltf.nodes.mixamorigHips} />
                <T is={gltf.nodes.Box_Bone} />
                {#if $gameState.inventory.equipped !== 1}
                    <T.SkinnedMesh castShadow name="Mesh" geometry={gltf.nodes.Mesh.geometry} skeleton={gltf.nodes.Mesh.skeleton}>
                        {#await texture then t}
                            <T.MeshToonMaterial color="#ffffff">
                                <T is={t} attach="map" flipY={false} encoding={sRGBEncoding} />
                            </T.MeshToonMaterial>
                        {/await}
                    </T.SkinnedMesh>
                {:else}
                    <T.SkinnedMesh
                        castShadow
                        name="Box"
                        geometry={gltf.nodes.Box.geometry}
                        skeleton={gltf.nodes.Box.skeleton}
                    >
                        {#await texture then t}
                            <T.MeshToonMaterial color="#ffffff">
                                <T is={t} attach="map" flipY={false} encoding={sRGBEncoding} />
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
    {:catch error}
        <slot name="error" {error} />
    {/await}

    <slot {ref} />
</T>

{#if !$gameState.dev.camera}
    <T.OrthographicCamera
        name="main camera"
        makeDefault
        position={[playerState.position.x + 9, 10, playerState.position.z + 9]}
        on:create={({ ref }) => {
            ref.lookAt(playerState.position.x + 8, 9, playerState.position.z + 8)
        }}
        {zoom}
    />
{/if}

<T.DirectionalLight
    name="sun"
    intensity={playerState.sunIntensity}
    castShadow
    shadow.mapSize.width={1800}
    shadow.mapSize.height={1800}
    shadow.camera.top={9}
    shadow.camera.right={4}
    shadow.camera.left={-18}
    shadow.camera.bottom={-6}
    position={[playerState.position.x + 8.5, 10, playerState.position.z + 10]}
    target={lightTarget}
/>

<T.Mesh
    bind:ref={lightTarget}
    visible={false}
    scale={[1, 1, 1]}
    position={[playerState.position.x + 8, 8, playerState.position.z + 8]}
/>

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

<Audio src={audioSrc} bind:ref={runAudio} autoplay={false} loop={true} volume={0} />
