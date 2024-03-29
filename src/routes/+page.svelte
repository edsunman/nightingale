<script lang="ts">
    import {
        gameState,
        gamePosition,
        gameConversation,
        gameScene,
        gameSelectedCharacterPosition,
        gameMovingTo,
        gameLoaded
    } from '$lib/stores'
    import { Canvas } from '@threlte/core'
    import { fade } from 'svelte/transition'
    import { useProgress } from '@threlte/extras'
    import { items } from '$lib/items'
    import Game from './Game.svelte'
    import DialogueOptions from '../components/DialogueOptions.svelte'
    import Dialogue from '../components/Dialogue.svelte'
    import Inventory from '../components/Inventory.svelte'
    import ItemDescription from '../components/ItemDescription.svelte'
    import Settings from '../components/Settings.svelte'
    import Objectives from '../components/Objectives.svelte'
    import Message from '../components/Message.svelte'
    import MainMenu from '../components/MainMenu.svelte'

    import type { PageData } from './$types'

    export let data: PageData
    const { gameData, dev, version } = data

    let clientWidth, clientHeight
    let loadingScreen = false
    let welcomeMessage = false

    let selectedScene: number = $gameScene
    let finishedMessage = false
    let seenFinishedMessage = false

    const { progress, item } = useProgress()

    // $ : console.log('Loaded : '+$item)

    $: showFinishedMessage($gameState)

    function showFinishedMessage(go: any) {
        if (go.gameOver && !seenFinishedMessage) {
            seenFinishedMessage = true
            finishedMessage = true
        }
    }

    $: checkLoaded($progress)

    function checkLoaded(p: number) {
        if (p === 1) {
            setTimeout(() => {
                $gameLoaded = true
                setTimeout(() => {
                    loadingScreen = false
                }, 1000)
            }, 500)
        }
    }

    $: loadScene($gameScene)

    function loadScene(id: number) {
        // show black screen
        $gameLoaded = false
        loadingScreen = true
        $gameSelectedCharacterPosition = { x: 0, y: 0, z: 0 }
        // then load scene so any slight lag is hidden
        setTimeout(() => (selectedScene = id), 50)
        // are we already loaded? then remove black screen
        setTimeout(() => checkLoaded($progress), 500)
    }
</script>

<div
    class="absolute bottom-0 left-0 right-0 top-0 m-auto h-screen overflow-hidden
        {$gameState.settings.fullScreen ? '' : 'lg:aspect-[16/9] lg:h-[576px] xl:h-[720px] min-[1408px]:h-[792px]'}"
    bind:clientWidth
    bind:clientHeight
>
    {#if loadingScreen}
        <div out:fade={{ duration: 300 }} class="absolute z-40 h-full w-full bg-neutral-950 text-white opacity-100">
            {#if $progress < 1}
                <div class="absolute bottom-32 left-0 right-0 ml-auto mr-auto h-2 w-64 bg-neutral-700" out:fade={{ duration: 1000 }}>
                    <div class="h-full bg-white" style="width: {$progress * 100}%" />
                </div>
            {/if}
        </div>
    {/if}

    <Settings {version} />
    {#if $gameState.showHud}
        <Objectives />
        <Inventory />
    {/if}
    <ItemDescription />
    <DialogueOptions {gameData} />
    {#if $gameConversation[0] !== 0}
        <div class="absolute z-20 w-full text-center" style="bottom:{clientHeight / 2 + 120}px ">
            <h3 class="inline-block select-none rounded-md bg-neutral-900 px-3 py-2 text-neutral-100 md:hidden">
                <Dialogue {gameData} />
            </h3>
        </div>
    {/if}
    <Message />
    <MainMenu />
    {#if welcomeMessage}
        <div>
            <div
                class="painted absolute left-[50%] top-[50%] z-30 w-96 translate-x-[-50%] translate-y-[-50%] rounded-xl bg-gradient-to-b from-neutral-950 to-neutral-900 px-8 py-2 text-neutral-100"
            >
                <p class="py-6">Hello! This is an early attempt at a point and click adventure game.</p>
                <p class="pb-6">
                    Set in the far future on a distant planet, your ship has run out of fuel and you are marooned at a remote desert
                    outpost.
                </p>
                <p class="pb-6">Your objective is to find a fuel cell to power your ship.</p>
                <p>Hint: stand next to people and items to interact.</p>
                <div class="py-6 text-center">
                    <button
                        class="mr-6 h-10 flex-1 rounded-md bg-neutral-800 px-8 tracking-wider text-neutral-200 hover:bg-neutral-700 hover:text-neutral-50"
                        on:click={() => {
                            $gameState.inventory.owned.push(105)
                            $gameState = $gameState
                            welcomeMessage = false
                        }}>Start game</button
                    >
                </div>
            </div>
        </div>
        <div class="absolute z-20 h-full w-full bg-black opacity-0" />
    {/if}
    {#if finishedMessage}
        <div>
            <div
                class="painted absolute left-[50%] top-[50%] z-30 w-96 translate-x-[-50%] translate-y-[-50%] rounded-xl bg-gradient-to-b from-neutral-950 to-neutral-900 px-8 py-2 text-neutral-100"
            >
                <h3 class="py-6 text-center text-xl">Well done!</h3>
                <p class="pb-6 text-center">You sucessfuly refueled your ship.</p>
                <div class="py-6 text-center">
                    <button
                        class="h-10 flex-1 rounded-md bg-neutral-800 px-8 tracking-wider text-neutral-200 hover:bg-neutral-700 hover:text-neutral-50"
                        on:click={() => {
                            finishedMessage = false
                        }}>Ok</button
                    >
                </div>
            </div>
        </div>
        <div class="absolute z-20 h-full w-full bg-black opacity-0" />
    {/if}

    <Canvas>
        <Game {selectedScene} {gameData} {dev} />
    </Canvas>
</div>
{#if dev}
    <div
        class="invisible mt-12 md:visible"
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
                {item},{#if i % 5 === 0}<br />{/if}
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
                {o},{#if i % 5 === 0}<br />{/if}
            {/each}
        </p>
    </div>
{/if}
