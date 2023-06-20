<script lang="ts">
    import { gamePosition, gameMessage, gameConversation, gameSelectedCharacterPosition } from '$lib/stores'
    import { T, useFrame } from '@threlte/core'
    import { useGltf, useGltfAnimations, useTexture } from '@threlte/extras'
    import { Vector3, Matrix4, Euler, Quaternion, Group, MeshLambertMaterial, DoubleSide, sRGBEncoding, LoopOnce } from 'three'
    import { useCursor } from '$lib/util/useCursor'
    import { onMount } from 'svelte'
    import { toonMaterial } from '$lib/util/toonMaterial'

    export const ref = new Group()
    export let position = { x: 1, y: 0, z: 1 }
    export let url: string
    export let characterId: number
    export let message: string
    export let rotation = 0
    export let currentActionKey = 'idle'
    export let occasionalActionKey = ''
    export let isHologram = false

    const gltf = useGltf(url, { useDraco: true })
    export const { actions, mixer } = useGltfAnimations(gltf, ref)
    const { onPointerEnter, onPointerLeave } = useCursor()

    let armature: any
    let spinning = false
    let hologramOpacity = 0

    let mat = new MeshLambertMaterial({ color: 0x15b3e7, transparent: true, opacity: 0.2, wireframe: true, emissive: 0x009dff })
    mat.colorWrite = false
    mat.colorWrite = true

    const endRotation = new Quaternion().setFromEuler(new Euler(0, rotation, 0))
    const rotationMatrix = new Matrix4()
    const currentPosition = new Vector3(position.x, 0, position.z)
    //const material = new toonMaterial('/playerAtlas.png').material

    $: $actions[currentActionKey]?.play()

    //$: console.log($actions)

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

    $: rotateBack($gameConversation)

    function rotateBack(gc: any) {
        if (gc[0] === 0) {
            endRotation.setFromEuler(new Euler(0, rotation, 0))
        }
    }

    useFrame((state, delta) => {
        if (ref) {
            ref.quaternion.rotateTowards(endRotation, delta * 20)
        }
    })

    function clicked(e: any) {
        const player = $gamePosition
        if ($gameConversation[0] === 0) {
            if (player.x >= position.x - 1 && player.x <= position.x + 1 && player.z >= position.z - 1 && player.z <= position.z + 1) {
                const lookAtVector = new Vector3(player.x, 0, player.z)
                rotationMatrix.lookAt(lookAtVector, currentPosition, new Vector3(0, 1, 0))
                endRotation.setFromRotationMatrix(rotationMatrix)
                if (!endRotation.equals(ref.quaternion)) {
                    spinning = true
                    //transitionTo("walk")
                }
                $gameSelectedCharacterPosition = position
                $gameConversation = [characterId, 1]
            } else {
                $gameMessage = message
            }
        }
    }

    function flicker() {
        let flickerInterval = setInterval(function () {
            hologramOpacity = Math.random() * 0.3 + 0
        }, 30)
        setTimeout(function () {
            clearInterval(flickerInterval), (hologramOpacity = 0.2)
        }, Math.random() * 1500 + 200)
    }

    onMount(() => {
        if (isHologram) {
            setInterval(flicker, Math.round(Math.random() * (6000 - 2000)) + 2000)
        }
        
        setInterval(() => {
            transitionTo(occasionalActionKey)
           
            
            //console.log($actions[occasionalActionKey])
           // console.log(mixer)
        }, Math.round(5000))

        // console.log($actions)
    })
</script>

<T is={ref} position={[position.x, position.y, position.z]} name="purple" dispose={false} {...$$restProps}>
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
                        <T.MeshLambertMaterial
                            side={DoubleSide}
                            wireframeLinewidth={4}
                            opacity={hologramOpacity}
                            args={[{ color: 0x15b3e7, transparent: true, wireframe: true, emissive: 0x009dff }]}
                        />
                    {:else}
                        {#await useTexture('/rick.jpg') then texture}
                            <T.MeshToonMaterial color="#ffffff">
                                <T is={texture} attach="map" flipY={false} encoding={sRGBEncoding} />
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
    <T.MeshStandardMaterial color="hotpink" />
</T.Mesh>
{#if isHologram}
    <T.PointLight position={[position.x, 0.2, position.z]} distance={4} color={'#009dff'} intensity={hologramOpacity * 20} />
{/if}
