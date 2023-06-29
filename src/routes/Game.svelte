<script lang="ts">
    import { gameState, gameConversation, gameSelectedCharacterPosition, gamePosition, gameVolume, gamePixelRatio } from '$lib/stores'
    import Stats from 'three/examples/jsm/libs/stats.module'
    import { T, useFrame, useThrelte } from '@threlte/core'
    import { onMount } from 'svelte'
    import { interactivity, OrbitControls, HTML, useProgress, AudioListener } from '@threlte/extras'
    import Dialogue from '../components/Dialogue.svelte'

    import Scene1 from './Scene1.svelte'
    import Scene2 from './Scene2.svelte'
    import Scene3 from './Scene3.svelte'

    interactivity()

    export let selectedScene: number
    export let sceneFinishedLoading: boolean
    let audio: any
    const stats = new Stats()
    const { scene, renderer, camera } = useThrelte()
    const defaultPixelRatio = renderer?.getPixelRatio()

    $: changePixelRatio($gamePixelRatio)

    function changePixelRatio(p: number) {
        if (p > 0) {
            renderer?.setPixelRatio(p)
             console.log('set to :'+p)
        } else {
            renderer?.setPixelRatio(defaultPixelRatio ? defaultPixelRatio : 1)
            //console.log('set to :'+defaultPixelRatio ? defaultPixelRatio : 1)
        }
    }

    let dialogueHeight = 0
    $: nudgeDialogue($gameSelectedCharacterPosition)
    function nudgeDialogue(sc: any) {
        if ($gamePosition.x <= sc.x && $gamePosition.z <= sc.z) {
            dialogueHeight = 3.1
        } else {
            dialogueHeight = 2.8
        }
    }

    $: compileScene(sceneFinishedLoading)

    function compileScene(s: boolean) {
        if (s) {
            // compile shaders when scene is loaded
           renderer?.compile(scene, $camera)
            //scene.traverse(obj => obj.frustumCulled = false)
           // setTimeout(()=> { scene.traverse(obj => obj.frustumCulled = true) }, 5000)
            //console.log('shader compile')
            audio.context.resume()
        }
    }

    useFrame(() => {
        stats.update()
    })

    onMount(async () => {
        document.body.appendChild(stats.dom)
    })
</script>

<AudioListener bind:ref={audio} masterVolume={$gameVolume} position={[$gamePosition.x , 2, $gamePosition.z ]} rotation.y={0.78} />

{#if selectedScene === 1}
    <Scene1 />
{:else if selectedScene === 2}
    <Scene2 />
{:else if selectedScene === 3}
    <Scene3 />
{/if}

{#if $gameConversation[0] !== 0}
    <HTML position={[$gameSelectedCharacterPosition.x, dialogueHeight, $gameSelectedCharacterPosition.z]} center>
        <h3 class="text-neutral-100 bg-neutral-950 hidden md:block rounded-md px-3 py-2 select-none whitespace-nowrap">
            <Dialogue />
        </h3>
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
