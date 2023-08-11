<script lang="ts">
    import {
        gameState,
        gameMessage,
        gamePosition,
        gameConversation,
        gameScene,
        gameSelectedCharacterPosition,
        gameMovingTo,
        gameLoaded
    } from '$lib/stores'
    import { Canvas } from '@threlte/core'
    import { fade } from 'svelte/transition'
    import Game from './Game.svelte'
    import DialogueOptions from '../components/DialogueOptions.svelte'
    import Dialogue from '../components/Dialogue.svelte'
    import Inventory from '../components/Inventory.svelte'
    import ItemDescription from '../components/ItemDescription.svelte'
    import Settings from '../components/Settings.svelte'
    import { useProgress } from '@threlte/extras'
    import { items } from '$lib/items'
    import type { PageData } from './$types'
    import Objectives from '../components/Objectives.svelte'

    export let data: PageData
    export let version
    console.log(version)
    const script = data.script
    const dev = data.dev

    let clientWidth, clientHeight
    let messageVisible = false
    let loadingScreen = false
    let welcomeMessage = false
    let selectedScene: number = $gameScene
    let sceneFinishedLoading = false
    let messageTimeout: number
    let finishedMessage = false
    let seenFinishedMessage = false

    const { progress, item } = useProgress()

    // $ : console.log('Loaded : '+$item)

    $: showFinishedMessage($gameState)

    function showFinishedMessage(go: any){
        if(go.gameOver && !seenFinishedMessage){
            seenFinishedMessage = true
            finishedMessage = true
        }
    }

    $: fadeInMessage($gameMessage)

    function fadeInMessage(m: string) {
        if ($gameMessage) {
            messageVisible = true
            clearTimeout(messageTimeout)
            messageTimeout = setTimeout(function () {
                messageVisible = false
                $gameMessage = ''
            }, 3500)
        }
    }

    $: checkLoaded($progress)

    function checkLoaded(p: number) {
        if (p === 1) {
            setTimeout(() => {
                $gameLoaded = true
                setTimeout(() => {
                // $gameLoaded = true
                    loadingScreen = false
                    sceneFinishedLoading = true
                }, 500)
            }, 500)
        }
    }

    $: loadScene($gameScene)

    function loadScene(id: number) {
        // show black screen
        $gameLoaded = false
        loadingScreen = true
        sceneFinishedLoading = false
        $gameSelectedCharacterPosition = { x: 0, y: 0, z: 0 }
        // then load scene so any slight lag is hidden
        setTimeout(() => (selectedScene = id), 50)
        // are we already loaded? then remove black screen
        setTimeout(() => checkLoaded($progress), 500)
    }
</script>

<div
    class="h-screen xl:h-[700px] xl:aspect-[16/9] m-auto top-0 bottom-0 left-0 right-0 absolute overflow-hidden"
    bind:clientWidth
    bind:clientHeight
>
    {#if loadingScreen}
        <div out:fade={{ duration: 300 }} class="w-full h-full opacity-100 bg-neutral-950 z-40 absolute text-white">
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
    <DialogueOptions {script} />
    {#if $gameConversation[0] !== 0}
        <div class="z-20 absolute text-center w-full" style="bottom:{clientHeight / 2 + 120}px ">
            <h3 class="text-neutral-100 rounded-md bg-neutral-900 md:hidden inline-block px-3 py-2 select-none">
                <Dialogue {script} />
            </h3>
        </div>
    {/if}
    {#if messageVisible}
        <div in:fade={{ duration: 100 }} out:fade={{ duration: 500 }} class="z-20 absolute text-center w-full top-12">
            <div class="inline-block text-neutral-900 bg-neutral-300 rounded-md px-3 py-2 select-none m-2">
                <h3>{$gameMessage}</h3>
            </div>
        </div>
    {/if}
    {#if welcomeMessage}
        <div>
            <div
                class="painted z-30 absolute w-96 top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] text-neutral-100 rounded-xl px-8 py-2 bg-gradient-to-b from-neutral-950 to-neutral-900"
            >
                <h3 class="text-xl text-center py-6">Welcome to Nightigale!</h3>
                <p class="pb-6">Nightingale is an early attempt at a point and click adventure game.</p>
                <p class="pb-6">
                    Set in the far future on a distant planet, your ship has run out of fuel and you are marooned at a remote desert
                    outpost.
                </p>
                <p>Your objective is to find a fuel cell to power your ship.</p>
                <div class="text-center py-6">
                    <button
                        class="tracking-wider flex-1 mr-6 h-10 px-8 rounded-md bg-neutral-800 text-neutral-200 hover:text-neutral-50 hover:bg-neutral-700"
                        on:click={() => {
                            welcomeMessage = false
                        }}>Start game</button
                    >
                </div>
            </div>
        </div>
        <div class="w-full h-full bg-black opacity-0 z-20  absolute" />
    {/if}
    {#if finishedMessage}
        <div>
            <div
                class="painted z-30 absolute w-96 top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] text-neutral-100 rounded-xl px-8 py-2 bg-gradient-to-b from-neutral-950 to-neutral-900"
            >
                <h3 class="text-xl text-center py-6">Well done!</h3>
                <p class="pb-6 text-center">You sucessfuly refueled your ship.</p>
                <div class="text-center py-6">
                    <button
                        class="tracking-wider flex-1 h-10 px-8 rounded-md bg-neutral-800 text-neutral-200 hover:text-neutral-50 hover:bg-neutral-700"
                        on:click={() => {
                            finishedMessage = false
                        }}>Ok</button
                    >
                </div>
            </div>
        </div>
        <div class="w-full h-full bg-black opacity-0 z-20  absolute" />
    {/if}
    <Objectives />

    <Canvas>
        <Game {selectedScene} {script} {dev} />
    </Canvas>
</div>
{#if dev}
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
                $gameState.dev.avoidObjectsVisible = !$gameState.dev.avoidObjectsVisible
            }}>avoid objects</button
        >
         <p>
            Place objects:
            <input type="checkbox" bind:checked={$gameState.dev.avoidObjectsPlaceable} />
        </p>
        <br /><br />
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
        <p />
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
        ><br />
        <button
            on:click={() => {
                $gameScene = 3
            }}>3</button
        >
        <br /><br />
        <p>Equipped Item: {$gameState.inventory.equipped}</p>
        <p>Owned Items:</p>
        <p>
            {#each $gameState.inventory.owned as item, i}
                {item},{#if i % 5 === 0}<br/>{/if}
            {/each}
        </p>
        <br /><br />
        <button
            on:click={() => {
                $gameState.inventory.owned.length = 0
                items.forEach((item) => {
                    $gameState.inventory.owned.push(item.id)
                    $gameState = $gameState
                })
            }}>give all items</button
        >
        <br /><br />
        <button
            on:click={() => {
                $gameState.inventory.owned.length = 0
                $gameState.inventory.equipped = 0
                $gameState = $gameState
            }}>clear all items</button
        >
        <br /><br />
        <!--
        <p>Seen speech:</p>
        <p>
            {#each $gameState.seenSpeech as s}
                {s},
            {/each}
        </p>
        <br /><br />
        <p>Selected options:</p>
        <p>
            {#each $gameState.selectedConvoOptions as o, i}
                {o},{#if i % 5 === 0}<br/>{/if}
            {/each}
        </p>-->
         <p>Areas entered:</p>
        <p>
            {#each $gameState.areasEntered as o, i}
                {o},{#if i % 5 === 0}<br/>{/if}
            {/each}
        </p>
    </div>
{/if}
