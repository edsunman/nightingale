<script lang="ts">
    import {
        gamePosition,
        gameMessage,
        gameConversation,
        gameSelectedCharacterPosition,
        gameState,
        gameOutlineObjects,
        gameInteractSquare
    } from '$lib/stores'
    import { T, useFrame, useThrelte } from '@threlte/core'
    import { useGltf, useGltfAnimations, useTexture, PositionalAudio } from '@threlte/extras'
    import { Vector3, Matrix4, Euler, Quaternion, Group, LoopOnce, LoopPingPong } from 'three'
    import * as TWEEN from '@tweenjs/tween.js'
    import { useCursor } from '$lib/useCursor'
    import { onMount, onDestroy } from 'svelte'
    import { calculateDistanceBetweenPoints, everyInterval, randomNumber } from '$lib/util'
    import { HolgramMaterial } from './materials'

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
    const { onPointerEnter, onPointerLeave } = useCursor(...[, ,], threlte.renderer?.domElement, 'cursorHover')
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
    let bodyMesh: any

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

    $: checkInteractSquare($gameInteractSquare)

    function checkInteractSquare(interactSquare: any) {
        const player = $gamePosition
        let extraSpace = false
        extraChatPositions.forEach((p) => {
            if (player.x === p.x && player.z === p.z) extraSpace = true
        })
        if (calculateDistanceBetweenPoints(interactSquare, { x: position.x, z: position.z }) < chatRadius + 0.5 || extraSpace) {
            clicked()
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

    function clicked() {
        if (!$gameState.moveLock) {
            $gameOutlineObjects.length = 0
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
                //  if (!endRotation.equals(ref.quaternion)) {
                //      spinning = true
                //  }
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
                $gameMessage = { message: message, type: 0 }
            }
        } else {
            $gameMessage = { message: message, type: 0 }
        }
    }

    const everySevenSeconds = everyInterval(7)

    useFrame(
        (_, delta) => {
            if (delta < 0.5) {
                if (isHologram) {
                    const seconds = everySevenSeconds(delta, () => {
                        //if (staticAudio.context.state === 'running') {
                        //staticAudio.play()
                        //}
                    })
                    if (seconds < 1 || (5 < seconds && seconds < 5.5)) {
                        hologramOpacity = randomNumber(0, 1)
                    } else {
                        hologramOpacity = 1
                        // staticAudio.stop()
                    }
                }
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
            }
        },
        { order: 1 }
    )

    onMount(() => {
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
    {#await gltf then gltf}
        <T.Group name="Scene">
            <T.Group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
                <T is={gltf.nodes.mixamorigHips} />
                <T.SkinnedMesh
                    bind:ref={bodyMesh}
                    castShadow={!isHologram}
                    name="Body"
                    geometry={gltf.nodes.Body.geometry}
                    skeleton={gltf.nodes.Body.skeleton}
                    on:create={({ ref, cleanup }) => {
                        if (characterId > 0) {
                            gameOutlineObjects.setup(ref)
                            cleanup(() => {
                                gameOutlineObjects.remove(ref.uuid)
                            })
                        }
                    }}
                >
                    {#if isHologram}
                        <HolgramMaterial opacity={hologramOpacity} dotSize={60} />
                    {:else}
                        {#await characterTexture then t}
                            <T.MeshToonMaterial color="#ffffff">
                                <T is={t} attach="map" flipY={false} />
                            </T.MeshToonMaterial>
                        {/await}
                    {/if}
                </T.SkinnedMesh>
            </T.Group>
        </T.Group>
    {/await}
</T>

<T.Mesh
    name="collision box"
    visible={false}
    position={[position.x, position.y + 0.75, position.z]}
    on:pointerenter={(e) => {
        if (characterId > 0) {
            onPointerEnter()
            $gameOutlineObjects.push(bodyMesh)
            $gameOutlineObjects = $gameOutlineObjects
        }
    }}
    on:pointerleave={(e) => {
        if (characterId > 0) {
            onPointerLeave()
            $gameOutlineObjects.length = 0
        }
    }}
    on:click={(e) => {
        e.stopPropagation()
        clicked()
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
