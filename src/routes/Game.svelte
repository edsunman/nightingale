<script lang="ts">
    import { gameState, gameConversation, gameSelectedCharacterPosition, gamePosition, gameVolume, gamePixelRatio } from '$lib/stores'
    import Stats from 'three/examples/jsm/libs/stats.module'
    import { T, useFrame, useThrelte } from '@threlte/core'
    import { onMount } from 'svelte'
    import { interactivity, OrbitControls, HTML, useProgress, AudioListener, Audio } from '@threlte/extras'
    import Dialogue from '../components/Dialogue.svelte'
    import type { Script } from '$lib/types'

    import Scene1 from './Scene1.svelte'
    import Scene2 from './Scene2.svelte'
    import Scene3 from './Scene3.svelte'

    const scenes = [ Scene1, Scene2, Scene3 ]

    interactivity()

    export let script: Script
    export let selectedScene: number
    export let sceneFinishedLoading: boolean
    let audio: any
    const stats = new Stats()
    const { scene, renderer, camera } = useThrelte()
    const defaultPixelRatio = renderer?.getPixelRatio()
    let inventoryOpen = false
    let equippedItem = 0
    let openInventoryAudio  : any
    let itemSelectAudio : any

    $: changePixelRatio($gamePixelRatio)

    function changePixelRatio(p: number) {
        if (p > 0) {
            renderer?.setPixelRatio(p)
        } else {
            renderer?.setPixelRatio(defaultPixelRatio ? defaultPixelRatio : 1)
        }
    }

    // TODO : sounds should be moved out

    $: inventoryOpenSound($gameState)

    function inventoryOpenSound(gs : any){
        if (!inventoryOpen && gs.inventory.open) {
            inventoryOpen = true
            openInventoryAudio.play()
        }
        if(!gs.inventory.open) {
            inventoryOpen = false
        }
    }

    $: itemEquippedSound($gameState)

    function itemEquippedSound(gs : any){
        if (equippedItem !== gs.inventory.equipped) {
            console.log('play')
            //itemSelectAudio.play()

            const source = itemSelectAudio.context.createBufferSource()
            const gainNode = itemSelectAudio.context.createGain()
            source.buffer = itemSelectAudio.buffer
            gainNode.gain.value = $gameVolume
            source.connect(gainNode)
            gainNode.connect(itemSelectAudio.context.destination)
            source.start()

            equippedItem = gs.inventory.equipped
        }
    }

    let dialogueHeight = 0
    $: nudgeDialogue($gameSelectedCharacterPosition)
    function nudgeDialogue(sc: any) {
            if ($gamePosition.x <= sc.x && $gamePosition.z <= sc.z) {
               // dialogueHeight = 3.1
            } else {
                dialogueHeight = 2.6
            }
    }

    $: compileScene(sceneFinishedLoading)

    function compileScene(s: boolean) {
        if (s) {
            //console.log(scene)
            audio.context.resume()
        }
    }

    useFrame(() => {
        stats.update()
    })

    onMount(async () => {
        console.log(stats.dom)
        document.body.appendChild(stats.dom)
    })
</script>

<AudioListener bind:ref={audio}  masterVolume={$gameVolume} position={[$gamePosition.x, 2, $gamePosition.z]} rotation.y={0.78} />
<Audio src={'/audio/openBag.mp3'}  bind:ref={openInventoryAudio} autoplay={false} loop={false} volume={1} />
<Audio src={'/audio/item.mp3'}  bind:ref={itemSelectAudio} autoplay={false} loop={false} volume={1} />

<svelte:component this={scenes[selectedScene-1]} />

{#if $gameConversation[0] !== 0}
    <HTML position={[$gameSelectedCharacterPosition.x, $gameSelectedCharacterPosition.y, $gameSelectedCharacterPosition.z]} center>
        <div
            class="z-20 text-neutral-100 rounded-md bg-neutral-900 hidden md:block px-4 py-2 select-none whitespace-nowrap "
        >
            <Dialogue {script} />
        </div>
    </HTML>
{/if}

{#if $gameState.dev.camera}
    <T.PerspectiveCamera
        makeDefault
        position={[5, 5, 5]}
        on:create={({ ref }) => {
            ref.lookAt(0, 1, 0)
        }}
    >
        <OrbitControls enablePan />
    </T.PerspectiveCamera>
{/if}
