<script lang="ts">
    import { gameState, gameScene, gameVolume } from '$lib/stores'
    import { fade } from 'svelte/transition'
    import { onMount } from 'svelte'

    let showContinue = false
    let audioOn = false

    function toggleAudio() {
        if (audioOn) {
            $gameVolume = 0
        } else {
            $gameVolume = 1
        }
        audioOn = !audioOn
    }

    $: $gameVolume === 0 ? (audioOn = false) : (audioOn = true)

    function loadGame() {
        const s = localStorage.getItem('Nightingale Save Data')
        if (s) {
            const j = JSON.parse(atob(s))
            $gameState = j.gameState
            $gameState.nextScenePosition = j.position
            $gameState.mainMenu = false
            $gameState.settings.open = false
            if ($gameScene === j.scene) {
                $gameScene = 0
                setTimeout(() => {
                    $gameScene = j.scene
                }, 100)
            } else {
                $gameScene = j.scene
            }
        }
    }

    onMount(() => {
        const s = localStorage.getItem('Nightingale Save Data')
        if (s) {
            showContinue = true
        }
    })
</script>

{#if $gameState.mainMenu && !$gameState.settings.open}
    <div class="absolute w-96 top-32 left-52 text-neutral-100" in:fade={{ duration: 500 }} out:fade={{ duration: 500 }}>
        <h1 class="font-serif text-7xl mb-24">Nightingale</h1>
        {#if showContinue}
            <button
                class="tracking-wider text-neutral-100 opacity-90 hover:opacity-100 text-2xl block mb-4"
                on:click={() => {
                    loadGame()
                }}
            >
                Continue
            </button>
        {/if}
        <button
            class="tracking-wider text-neutral-100 opacity-90 hover:opacity-100 text-2xl block mb-4"
            on:click={() => {
                $gameState.mainMenu = false
            }}
        >
            New Game
        </button>
        <button
            class="tracking-wider text-neutral-100 opacity-90 hover:opacity-100 text-2xl block mb-4"
            on:click={() => {
                $gameState.settings.open = true
            }}
        >
            Settings
        </button>
    </div>
    <div class="absolute w-96 bottom-20 left-52 text-neutral-100" in:fade={{ duration: 500 }} out:fade={{ duration: 500 }}>
        <button
            class="tracking-wider text-neutral-100 opacity-90 hover:opacity-100 text-xl block mb-4"
            on:click={() => {
                toggleAudio()
            }}
        >
            Audio: {audioOn ? 'On' : 'Off'}
        </button>
    </div>
{/if}
