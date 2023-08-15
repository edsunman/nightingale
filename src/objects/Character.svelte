<script lang="ts">
    import { gamePosition, gameMessage, gameConversation, gameSelectedCharacterPosition, gameState } from '$lib/stores'
    import { T, useFrame, useThrelte } from '@threlte/core'
    import { useGltf, useGltfAnimations, useTexture, PositionalAudio } from '@threlte/extras'
    import { Vector3, Matrix4, Euler, Quaternion, Group, LoopOnce, LoopPingPong, SRGBColorSpace } from 'three'
    import * as TWEEN from '@tweenjs/tween.js'
    import { useCursor } from '$lib/useCursor'
    import { onMount, onDestroy } from 'svelte'
    import HolgramMaterial from './materials/HolgramMaterial.svelte'

    export const ref = new Group()
    export let position = { x: 1, y: 0, z: 1 }
    export let url: string
    export let characterId: number
    export let message: string
    export let rotation = 0
    export let currentActionKey = 'idle'
    export let isHologram = false
    export let rotateTowardsPlayer = false
    export let rotateTowardsPlayerWhenTalking = false
    export let spinHeadWhenTalking = false
    export let pingPongIdle = false
    export let chatRadius = 1
    export let extraChatPositions: { x: number; z: number }[] = []
    export let animation: { key: string; repeatTime: number; stopWhenSpokenTo?: boolean } = { key: '', repeatTime: 0 }

    const gltf = useGltf(url, { useDraco: true })
    const characterTexture = useTexture('/texture/characterAtlas.png')
    const { actions, mixer } = useGltfAnimations(gltf, ref)
    const threlte = useThrelte()
    const { onPointerEnter, onPointerLeave } = useCursor(...[,,],threlte.renderer?.domElement,'cursorHover')
    const endRotation = new Quaternion().setFromEuler(new Euler(0, rotation, 0))
    const rotationMatrix = new Matrix4()
    const currentPosition = new Vector3(position.x, 0, position.z)
    const playerVector = new Vector3(0, 0, 0)
    const defaultEuler = new Euler(0, rotation, 0)
    const defaultHeadRotation = new Quaternion()
    const headRotation = new Quaternion()
    const headHeightVector = new Vector3(0, 1.5, 0)
    const headVector = new Vector3(0, 1, 0)
    const upVector = new Vector3(0, 1, 0)

    let spinning = false
    let hologramOpacity = 1
    let animationInterval: any
    let flickerInterval: any
    let flickeringInterval: any
    let staticAudio: any
    let inConversation = false
    let counter = { count: 0 }
    let rotatingHead = false
    let tween: any
    let isPlayerInFrontOfCharacter = false

    $: {
        if (pingPongIdle) {
            $actions[currentActionKey]?.setLoop(LoopPingPong, 1000)
        }
        $actions[currentActionKey]?.play()
    }

    $: if ($gameState.charctersSpokenWith.includes(characterId) && animation.stopWhenSpokenTo) {
        clearInterval(animationInterval)
    }

    $: conversationOver($gameConversation)

    function conversationOver(gc: any) {
        if (gc[0] === 0) {
            inConversation = false
            endRotation.setFromEuler(defaultEuler)
            if (tween) {
                tween.to({ count: 0 }, 700).startFromCurrentValues()
            }
        }
    }

    function transitionTo(nextActionKey: string, duration = 0.5) {
        const currentAction = $actions[currentActionKey]
        const nextAction = $actions[nextActionKey]
        if (!nextAction || currentAction === nextAction) return
        nextAction.enabled = true
        nextAction.clampWhenFinished = true
        nextAction.stop()
        nextAction.play()
        if (currentAction) {
            currentAction.crossFadeTo(nextAction, duration, true)
        }
        currentActionKey = nextActionKey
    }

    function pause(p = true) {
        const currentAction = $actions[currentActionKey]
        if (currentAction) {
            currentAction.paused = p
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
                playerVector.set(player.x, 0, player.z)
                if ((rotation === 1.57 && player.x > Math.ceil(position.x)) || (rotation === 0 && player.z > Math.ceil(position.z))) {
                    isPlayerInFrontOfCharacter = true
                } else {
                    isPlayerInFrontOfCharacter = false
                }
                if (spinHeadWhenTalking && $gltf && isPlayerInFrontOfCharacter) {
                    pause()
                    rotatingHead = true
                    headVector.copy(playerVector).add(headHeightVector)
                    defaultHeadRotation.copy($gltf.nodes.mixamorigHead.quaternion)
                    $gltf.nodes.mixamorigHead.lookAt(headVector)
                    headRotation.copy($gltf.nodes.mixamorigHead.quaternion)
                    tween = new TWEEN.Tween(counter)
                    tween.easing(TWEEN.Easing.Quadratic.InOut)
                    tween.to({ count: 1 }, 500).start()
                }
                if (rotateTowardsPlayerWhenTalking) {
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
                $gameSelectedCharacterPosition = { x: position.x, y: 2.8 + nudgeDialogueAmount, z: position.z }
                $gameConversation = [characterId, 1]
                inConversation = true
                if (!$gameState.charctersSpokenWith.includes(characterId)) {
                    $gameState.charctersSpokenWith.push(characterId)
                }
            } else {
                $gameMessage = { 'message' : message , 'type' : 0 }
            }
        } else {
            $gameMessage = { 'message' : message , 'type' : 0 }
        }
    }

    function flicker() {
        flickeringInterval = setInterval(() => {
            hologramOpacity = Math.random() * 1 + 0
        }, 30)
        staticAudio.offset = Math.floor(Math.random() * 3)
        if(staticAudio.context.state === 'running') {
            staticAudio.play()
        }
        setTimeout(() => {
            clearInterval(flickeringInterval)
            hologramOpacity = 1
            staticAudio.stop()
        }, Math.random() * 1500 + 100)
    }

    useFrame(
        (state, delta) => {
            if (rotateTowardsPlayer) {
                playerVector.set($gamePosition.x, 0, $gamePosition.z)
                rotationMatrix.lookAt(playerVector, currentPosition, upVector)
                endRotation.setFromRotationMatrix(rotationMatrix)
            }
            if (ref) {
                ref.quaternion.rotateTowards(endRotation, delta * 10)
            }
            if ($gltf) {
                if (inConversation && spinHeadWhenTalking && isPlayerInFrontOfCharacter) {
                    $gltf.nodes.mixamorigHead.quaternion.slerpQuaternions(defaultHeadRotation, headRotation, counter.count)
                } else if (rotatingHead) {
                    $gltf.nodes.mixamorigHead.quaternion.slerpQuaternions(defaultHeadRotation, headRotation, counter.count)
                    if (counter.count <= 0) {
                        pause(false)
                        rotatingHead = false
                    }
                }
            }
            TWEEN.update()
        },
        { order: 1 }
    )

    onMount(() => {
        if (isHologram) {
            flickerInterval = setInterval(flicker, 6000)
        }

        if (animation.key.length > 0) {
            animationInterval = setInterval(() => {
                $actions[animation.key]?.setLoop(LoopOnce, 1)
                transitionTo(animation.key)
            }, animation.repeatTime)
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
        clearInterval(animationInterval)
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
                        {#await characterTexture then t}
                            <T.MeshToonMaterial color="#ffffff">
                                <T is={t} attach="map" flipY={false} colorSpace={SRGBColorSpace} />
                            </T.MeshToonMaterial>
                        {/await}
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
