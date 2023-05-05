<script lang="ts">
import { gameState, gameConversation, gameSelectedCharacterPosition, gamePosition } from '$lib/stores'
    import Scene1 from './Scene1.svelte'
    import Scene2 from './Scene2.svelte'
    import Stats from 'three/examples/jsm/libs/stats.module'
    import { T, useFrame, useThrelte  } from '@threlte/core'
    import { onMount } from 'svelte'
    import { interactivity, OrbitControls, HTML  } from '@threlte/extras'
    import Dialogue from '../components/Dialogue.svelte'

    interactivity()

    export let selectedScene = 1

    const stats = new Stats()
    const { scene, renderer, camera } = useThrelte()

    //renderer?.setPixelRatio(2);
    //console.log(renderer?.getPixelRatio())

    let dialogueHeight = 0;
    $ : nudgeDialogue($gameSelectedCharacterPosition)
    function nudgeDialogue(sc :any){
        if ($gamePosition.x<=sc.x && $gamePosition.z<=sc.z) {
            dialogueHeight = 3.1
        } else {
            dialogueHeight = 2.8
        }
    }

    useFrame(() => {
        stats.update()
    })

    onMount(async () => {
        document.body.appendChild(stats.dom);
    })

</script>

{#if selectedScene === 1}
    <Scene1 />
{:else if selectedScene === 2}
    <Scene2 />
{/if}

{#if $gameConversation[0]!==0}
    <HTML position={[$gameSelectedCharacterPosition.x,dialogueHeight,$gameSelectedCharacterPosition.z]} center>
        <h3  class="text-neutral-100 bg-neutral-950 hidden md:block rounded-md px-3 py-2 select-none whitespace-nowrap">
           <Dialogue />
        </h3>
    </HTML>
{/if}

{#if $gameState.dev.camera}
    <T.PerspectiveCamera makeDefault position={[5, 5, 5]}  on:create={({ ref }) => { ref.lookAt(0, 1, 0) }} >
        <OrbitControls enablePan />
    </T.PerspectiveCamera>
{/if}