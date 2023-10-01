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
    <div class="absolute left-52 top-32 w-96 text-neutral-100" in:fade={{ duration: 500 }} out:fade={{ duration: 500 }}>
        <h1 class="mb-24 font-serif text-7xl">Nightingale</h1>
        {#if showContinue}
            <button
                class="mb-4 block text-2xl tracking-wider text-neutral-100 opacity-90 hover:opacity-100"
                on:click={() => {
                    loadGame()
                }}
            >
                Continue
            </button>
        {/if}
        <button
            class="mb-4 block text-2xl tracking-wider text-neutral-100 opacity-90 hover:opacity-100"
            on:click={() => {
                $gameState.mainMenu = false
            }}
        >
            New Game
        </button>
        <button
            class="mb-4 block text-2xl tracking-wider text-neutral-100 opacity-90 hover:opacity-100"
            on:click={() => {
                $gameState.settings.open = true
            }}
        >
            Settings
        </button>
    </div>
    <div class="absolute bottom-20 left-52 w-96 text-neutral-100" in:fade={{ duration: 500 }} out:fade={{ duration: 500 }}>
        <button
            class="mb-4 block text-xl tracking-wider text-neutral-100 opacity-90 hover:opacity-100"
            on:click={() => {
                toggleAudio()
            }}
        >
            Audio: {audioOn ? 'On' : 'Off'}
        </button>
    </div>
{/if}
