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
    import UIAudio from '../objects/audio/UIAudio.svelte'

    const scenes = [ Scene1, Scene2, Scene3 ]

    interactivity()

    export let script: Script
    export let selectedScene: number
    export let dev: boolean

    const stats = new Stats()
    const { renderer, scene } = useThrelte()
    const defaultPixelRatio = renderer?.getPixelRatio()
    
    $: changePixelRatio($gamePixelRatio)

    function changePixelRatio(p: number) {
        if (p > 0) {
            renderer?.setPixelRatio(p)
        } else {
            renderer?.setPixelRatio(defaultPixelRatio ? defaultPixelRatio : 1)
        }
    }

    if(dev) {
        useFrame(() => {
            stats.update()
        })

        onMount(async () => {
            document.body.appendChild(stats.dom)
            console.log(scene)
        })
    }
</script>

<UIAudio/>
<svelte:component this={scenes[selectedScene-1]} />

{#if $gameConversation[0] !== 0}
    <HTML position={[$gameSelectedCharacterPosition.x, $gameSelectedCharacterPosition.y, $gameSelectedCharacterPosition.z]} center>
        <div class="w-96 h-20 inline-flex items-end justify-center">
            <div class="z-20 text-neutral-100 rounded-md bg-neutral-900 px-4 py-2 select-none text-center">
            <Dialogue {script} />
            </div>
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
