<script lang="ts">
    import { gamePosition, gameMessage, gameConversation, gameSelectedCharacterPosition, gameState } from '$lib/stores'
    import { T, useFrame } from '@threlte/core'
    import { useGltf, useGltfAnimations, useTexture, PositionalAudio } from '@threlte/extras'
    import {
        Vector3,
        Matrix4,
        Euler,
        Quaternion,
        Group,
        ShaderMaterial,
        LoopOnce,
        LoopPingPong,
        TextureLoader,
        RepeatWrapping
    } from 'three'
    import { useCursor } from '$lib/util/useCursor'
    import { onMount, onDestroy } from 'svelte'
    import IncidentalDialogue from './IncidentalDialogue.svelte'
    import HolgramMaterial from './materials/HolgramMaterial.svelte'

    export const ref = new Group()
    export let position = { x: 1, y: 0, z: 1 }
    export let url: string
    export let characterId: number
    export let message: string
    export let rotation = 0
    export let currentActionKey = 'idle'
    export let beforeDialogueActionKey = ''
    export let isHologram = false
    export let lookatPlayer = false
    export let lookatPlayerWhenTalking = false
    export let pingPongIdle = false
    export let chatRadius = 1
    export let extraChatPositions: { x: number; z: number }[] = []

    const gltf = useGltf(url, { useDraco: true })
    export const { actions, mixer } = useGltfAnimations(gltf, ref)
    const { onPointerEnter, onPointerLeave } = useCursor()

    let spinning = false
    let hologramOpacity = 1
    let beforeDialogueInterval: any
    let flickerInterval: any
    let flickeringInterval: any
    let staticAudio: any
    //let characterSelected : any

    const endRotation = new Quaternion().setFromEuler(new Euler(0, rotation, 0))
    const rotationMatrix = new Matrix4()
    const currentPosition = new Vector3(position.x, 0, position.z)
    const playerVector = new Vector3(0, 0, 0)
    const upVector = new Vector3(0, 1, 0)
    const defaultEuler = new Euler(0, rotation, 0)

    $: {
        if (pingPongIdle) {
            $actions[currentActionKey]?.setLoop(LoopPingPong, 1000)
        }
        $actions[currentActionKey]?.play()
    }

    function transitionTo(nextActionKey: string, duration = 0.2) {
        const currentAction = $actions[currentActionKey]
        const nextAction = $actions[nextActionKey]
        if (!nextAction || currentAction === nextAction) return
        nextAction.enabled = true
        nextAction.clampWhenFinished = true
        if (currentAction) {
            currentAction.crossFadeTo(nextAction, duration, true)
        }
        nextAction.stop()
        nextAction.timeScale = 1
        currentActionKey = nextActionKey
    }

    $: rotateBack($gameConversation)

    $: if ($gameState.charctersSpokenWith.includes(characterId)) {
        clearInterval(beforeDialogueInterval)
    }

    function rotateBack(gc: any) {
        if (gc[0] === 0) {
            endRotation.setFromEuler(defaultEuler)
        }
    }

    function clicked(e: any) {
        if (!$gameState.moveLock) {
            const player = $gamePosition
            let extraSpace = false
            extraChatPositions.forEach((p) => {
                if (player.x === p.x && player.z === p.z) extraSpace = true
            })
            if (
                (player.x >= position.x - chatRadius &&
                    player.x <= position.x + chatRadius &&
                    player.z >= position.z - chatRadius &&
                    player.z <= position.z + chatRadius) ||
                extraSpace
            ) {
                //characterSelected()
                if (lookatPlayerWhenTalking) {
                    playerVector.set(player.x, 0, player.z)
                    rotationMatrix.lookAt(playerVector, currentPosition, upVector)
                    endRotation.setFromRotationMatrix(rotationMatrix)
                }
                if (!endRotation.equals(ref.quaternion)) {
                    spinning = true
                }
                let nudgeDialogueAmount = 0
                if (player.x <= position.x && player.z <= position.z) {
                    nudgeDialogueAmount = 0.5
                }
                $gameSelectedCharacterPosition = { x: position.x, y: 2.6 + nudgeDialogueAmount, z: position.z }
                $gameConversation = [characterId, 1]
                if (!$gameState.charctersSpokenWith.includes(characterId)) {
                    $gameState.charctersSpokenWith.push(characterId)
                }
            } else {
                $gameMessage = message
            }
        } else {
            $gameMessage = message
        }
    }

    function flicker() {
        flickeringInterval = setInterval(function () {
            hologramOpacity = Math.random() * 1 + 0
        }, 30)
        staticAudio.offset = Math.floor(Math.random() * 3)
        staticAudio.play()
        setTimeout(function () {
            clearInterval(flickeringInterval), (hologramOpacity = 1)
            staticAudio.stop()
        }, Math.random() * 1500 + 100)
    }

    useFrame((state, delta) => {
        if (lookatPlayer) {
            playerVector.set($gamePosition.x, 0, $gamePosition.z)
            rotationMatrix.lookAt(playerVector, currentPosition, upVector)
            endRotation.setFromRotationMatrix(rotationMatrix)
        }
        if (ref) {
            ref.quaternion.rotateTowards(endRotation, delta * 10)
        }
    })

    onMount(() => {
        if (isHologram) {
            flickerInterval = setInterval(flicker, 6000)
        }
        if (beforeDialogueActionKey.length > 0) {
            beforeDialogueInterval = setInterval(() => {
                $actions[beforeDialogueActionKey]?.setLoop(LoopOnce, 1)
                transitionTo(beforeDialogueActionKey)
            }, 8000)
        }
        mixer.addEventListener('finished', () => {
            transitionTo('idle')
        })
    })

    onDestroy(() => {
        if (isHologram) {
            clearInterval(flickerInterval)
            clearInterval(flickeringInterval)
        }
        clearInterval(beforeDialogueInterval)
    })
</script>

<T is={ref} dispose={false} {...$$restProps} name={'character ' + characterId} position={[position.x, position.y, position.z]}>
    {#await gltf}
        <slot name="fallback" />
    {:then gltf}
        <T.Group name="Scene">
            <T.Group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
                <T is={gltf.nodes.mixamorigHips} />
                <T.SkinnedMesh
                    castShadow={!isHologram}
                    name="Body"
                    geometry={gltf.nodes.Body.geometry}
                    skeleton={gltf.nodes.Body.skeleton}
                >
                    {#if isHologram}
                        <HolgramMaterial opacity={hologramOpacity} dotSize={60} />
                    {:else}
                        <!--{#await useTexture('/rick.jpg') then texture}
                            <T.MeshToonMaterial color="#ffffff">
                                <T is={texture} attach="map" flipY={false} encoding={sRGBEncoding} />
                            </T.MeshToonMaterial>
                        {/await} -->
                    {/if}
                </T.SkinnedMesh>
            </T.Group>
        </T.Group>
    {:catch error}
        <slot name="error" {error} />
    {/await}

    <slot {ref} />
</T>

<T.Mesh
    name="collision box"
    visible={false}
    position={[position.x, position.y + 0.75, position.z]}
    on:pointerenter={onPointerEnter}
    on:pointerleave={onPointerLeave}
    on:click={(e) => {
        e.stopPropagation()
        clicked(e)
    }}
>
    <T.BoxGeometry args={[0.5, 1.5, 0.5]} />
</T.Mesh>

{#if isHologram}
    <T.PointLight position={[position.x, 1, position.z]} distance={3} color={'#03d3fc'} intensity={hologramOpacity * 2} />
    <PositionalAudio
        loop
        refDistance={1}
        volume={1}
        src={'/audio/static.mp3'}
        position={[position.x, 1, position.z]}
        bind:ref={staticAudio}
    />
{/if}

<!--<IncidentalDialogue {characterId} {position} bind:clicked={characterSelected} /> -->
