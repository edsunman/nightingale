<script lang="ts">
    import { gameState, gameMessage, gamePosition, gameConversation, gameScene, gameSelectedCharacterPosition, gameMovingTo } from '$lib/stores'
    import { Canvas, useThrelte } from '@threlte/core'
    import { fade } from 'svelte/transition'
    import Game from './Game.svelte'
    import DialogueOptions from '../components/DialogueOptions.svelte'
    import Dialogue from '../components/Dialogue.svelte'
    import Inventory from '../components/Inventory.svelte'
    import ItemDescription from '../components/ItemDescription.svelte'
    import { script } from '$lib/script'
    import Settings from '../components/Settings.svelte'
    import { useProgress } from '@threlte/extras'


    import { items } from '$lib/items'

    let clientWidth, clientHeight
    let showDialogueOptions = false
    let messageVisible = false
    let gameLoaded = false
    let selectedScene: number = $gameScene
    let sceneFinishedLoading = false

    const { progress, item } = useProgress()

   // $ : console.log('Loaded : '+$item)

    $: fadeInMessage($gameMessage)

    function fadeInMessage(m: string) {
        if ($gameMessage) {
            messageVisible = true
            setTimeout(function () {
                messageVisible = false
                $gameMessage = ''
            }, 3500)
        }
    }

    $: updateDialogue($gameConversation)

    function updateDialogue(g: any) {
        $gameState.inventory.open = false
        showDialogueOptions = false
        if (g[0] !== 0) {
            $gameState.moveLock = true
            if (script[g[0] - 1].speech.find((x) => x.id === g[1])?.options) {
                setTimeout(() => {
                    showDialogueOptions = true
                }, 1500)
            } else {
                const nextLine = g[1] + 0.1
                setTimeout(() => {
                    $gameConversation = [g[0], nextLine]
                }, 2000)
            }
        }
    }

    $: checkLoaded($progress)

    function checkLoaded(p: number) {
        if (p === 1) {
            gameLoaded = true
            sceneFinishedLoading = true
        }
    }

    $: loadScene($gameScene)

    function loadScene(id: number) {
        // show black screen
        gameLoaded = false
        sceneFinishedLoading = false
        $gameSelectedCharacterPosition = { x: 0, y: 0, z: 0 }
        // then load scene so any slight lag is hidden
        setTimeout(() => (selectedScene = id), 50)
        // are we already loaded? then remove black screen
        setTimeout(() => checkLoaded($progress), 500)
    }

</script>

<div
    class="h-screen lg:h-[700px] lg:aspect-[16/9] m-auto top-0 bottom-0 left-0 right-0 absolute overflow-hidden"
    bind:clientWidth
    bind:clientHeight
>
    {#if !gameLoaded}
        <div class="w-full h-full bg-neutral-950 z-10 absolute text-white">
            {#if $progress < 1}
                <div class="h-2 w-64 mr-auto ml-auto bottom-32 left-0 right-0 absolute bg-neutral-700" out:fade={{ duration: 100 }}>
                    <div class="bg-white h-full" style="width: {$progress * 100}%" />
                </div>
            {/if}
        </div>
    {/if}
    <Settings />
    <Inventory />
    <ItemDescription />
    {#if showDialogueOptions}
        <div in:fade={{ duration: 100 }} class="absolute text-center w-full pt-1 bottom-12 md:bottom-6">
            <div class="inline-block text-neutral-100 bg-gradient-to-b from-neutral-950 to-neutral-900 rounded-xl p-3 m-3">
                <DialogueOptions />
            </div>
        </div>
    {/if}
    {#if $gameConversation[0] !== 0}
        <div class="absolute text-center w-full" style="bottom:{clientHeight / 2 + 120}px ">
            <h3 class="text-neutral-100 bg-neutral-950 md:hidden inline-block rounded-xl px-3 py-2 select-none">
                <Dialogue />
            </h3>
        </div>
    {/if}
    {#if messageVisible}
        <div in:fade={{ duration: 100 }} out:fade={{ duration: 500 }} class="absolute text-center w-full top-12">
            <div class="inline-block text-neutral-900 bg-neutral-300 rounded-md px-3 py-2 select-none m-2">
                <h3>{$gameMessage}</h3>
            </div>
        </div>
    {/if}
    <div class="absolute my-5 mx-6 transition-opacity duration-300 text-neutral-100 opacity-30 hover:opacity-100">
        <p><small>Objective:</small></p>
        <p>Find a fuel cell</p>
    </div>

    <Canvas>
        <Game {selectedScene} {sceneFinishedLoading} />
    </Canvas>
</div>
{#if $gameState.dev.status}
    <div
        class="mt-12 invisible md:visible"
        style="position:absolute; top:20px; width:150px; white-space: nowrap;left:20px; background-color:#202020; color:azure; font-family: monospace"
    >
        <button
            on:click={() => {
                $gameState.dev.camera = !$gameState.dev.camera
            }}>switch camera</button
        ><br />
        <button
            on:click={() => {
                $gameState.dev.grid = !$gameState.dev.grid
            }}>switch grid</button
        ><br />
        <button
            on:click={() => {
                $gameState.dev.avoidObjactsVisible = !$gameState.dev.avoidObjactsVisible
            }}>avoid objects</button
        ><br /><br />
        <p>Player position:</p>
        <p>
            x: {$gamePosition.x.toFixed(3)}<br />
            z: {$gamePosition.z.toFixed(3)}
        </p>
        <p>Moving To:</p>
        <p>
            x: {$gameMovingTo.x}<br />
            z: {$gameMovingTo.z}
        </p>
        <p>
        <p>
            Movement locked:
            <input type="checkbox" bind:checked={$gameState.moveLock} />
        </p>
        <p>Conversation State:</p>
        <p>{$gameConversation[0]} - {$gameConversation[1]}</p>
        <p>Load scene:</p>
        <button
            on:click={() => {
                $gameScene = 1
            }}>1</button
        ><br />
        <button
            on:click={() => {
                $gameScene = 2
            }}>2</button
        ><br/>
        <button
            on:click={() => {
                $gameScene = 3
            }}>3</button
        >
        <br /><br />
        <p>Owned Items:</p><p>
        {#each $gameState.inventory.owned as item}
            {item},
        {/each}   
        </p><br /><br />
        <button on:click={()=>{
            $gameState.inventory.owned.length=0
            items.forEach(item => {$gameState.inventory.owned.push(item.id);$gameState=$gameState})
        }}>give all items</button>
        <br /><br />
        <button on:click={()=>{
            $gameState.inventory.owned.length = 0
            $gameState=$gameState
        }}>clear all items</button>
        <br /><br />
    </div>
{/if}
