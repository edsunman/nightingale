<script lang="ts">
    import { gameState, gameConversation, gameSelectedCharacterPosition, gamePixelRatio, gameZoom } from '$lib/stores'
    import Stats from 'three/examples/jsm/libs/stats.module'
    import { T, useFrame, useThrelte, useRender } from '@threlte/core'
    import { onMount } from 'svelte'
    import { interactivity, OrbitControls, HTML } from '@threlte/extras'
    import PostProcessing from '../objects/PostProcessing.svelte'
    import Dialogue from '../components/Dialogue.svelte'
    import UIAudio from '../objects/audio/UIAudio.svelte'
    import Scene1 from './Scene1.svelte'
    import Scene2 from './Scene2.svelte'
    import Scene3 from './Scene3.svelte'
    import Scene0 from './Scene0.svelte'

    import type { GameData } from '$lib/types'

    const scenes = [Scene0, Scene1, Scene2, Scene3]

    interactivity()

    export let gameData: GameData
    export let selectedScene: number
    export let dev: boolean

    const stats = new Stats()
    const { renderer, scene, size } = useThrelte()
    const defaultPixelRatio = renderer?.getPixelRatio()
    let initialLoad = true

    $: changeZoom($size)

    function changeZoom(size: any) {
        if (size.width > 1250) {
            $gameZoom = 80 + (size.width - 1250) / 15
        } else {
            $gameZoom = 80
        }
    }

    $: changePixelRatio($gamePixelRatio)

    function changePixelRatio(p: number) {
        if (p > 0) {
            renderer?.setPixelRatio(p)
        } else {
            renderer?.setPixelRatio(defaultPixelRatio ? defaultPixelRatio : 1)
        }
    }

    $: setSizeOptions($size)

    function setSizeOptions(size: any) {
        if (size.width >= 1024 && initialLoad) {
            // assume we are not on mobile
            $gameState.settings.postProcessing = true
            initialLoad = false
        }
    }

    if (dev) {
        useFrame(() => {
            stats.update()
        })

        onMount(async () => {
            document.body.appendChild(stats.dom)
            console.log(scene)
        })
    }
</script>

<UIAudio />

<svelte:component this={scenes[selectedScene]} {gameData} />

{#if $gameState.settings.postProcessing}
    <PostProcessing />
{/if}

{#if $gameConversation[0] !== 0}
    <HTML position={[$gameSelectedCharacterPosition.x, $gameSelectedCharacterPosition.y, $gameSelectedCharacterPosition.z]} center>
        <div class="w-96 h-20 md:inline-flex items-end justify-center hidden">
            <div class="z-20 text-neutral-100 rounded-md bg-neutral-900 px-4 py-2 select-none text-center">
                <Dialogue {gameData} />
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
