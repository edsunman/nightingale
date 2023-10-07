<script lang="ts">
    import { gameState, gameScene, gameVolume, gamePadState } from '$lib/stores'
    import { fade } from 'svelte/transition'
    import { onMount } from 'svelte'

    let showContinue = false
    let audioOn = false
    let highlightedOption = -1

    $: gamePadUsed($gamePadState)

    function gamePadUsed(gps: typeof $gamePadState) {
        if (!$gameState.mainMenu || $gameState.settings.open) return
        if (gps.down === 1 && highlightedOption < 3) {
            highlightedOption++
        } else if (gps.up === 1 && highlightedOption > 0) {
            highlightedOption--
        } else if (gps.clusterBottom === 1) {
            // x
            switch (highlightedOption) {
                case 0:
                    loadGame()
                    break
                case 1:
                    $gameState.mainMenu = false
                    break
                case 2:
                    $gameState.settings.open = true
                    break
                case 3:
                    toggleAudio()
                    break
            }
        }
    }

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
    <div
        class="absolute w-full text-center text-neutral-100 lg:left-36 lg:top-16 lg:w-auto xl:left-52 xl:top-32"
        in:fade={{ duration: 500 }}
        out:fade={{ duration: 500 }}
    >
        <h1 class="my-20 font-serif text-6xl lg:my-0 lg:mb-12 lg:text-7xl xl:mb-24">Nightingale</h1>
        {#if showContinue}
            <button
                class="mb-4 ml-auto mr-auto block px-2 py-1 text-2xl tracking-wider hover:bg-neutral-100 hover:text-[#b76b36] lg:ml-0 lg:mr-0
                {highlightedOption === 0 ? 'bg-neutral-100 text-[#b76b36]' : 'text-neutral-100'}"
                on:click={() => {
                    loadGame()
                }}
            >
                Continue
            </button>
        {/if}
        <button
            class="mb-4 ml-auto mr-auto block px-2 py-1 text-2xl tracking-wider hover:bg-neutral-100 hover:text-[#b76b36] lg:ml-0 lg:mr-0
            {highlightedOption === 1 ? 'bg-neutral-100 text-[#b76b36]' : 'text-neutral-100'}"
            on:click={() => {
                $gameState.mainMenu = false
            }}
        >
            New Game
        </button>
        <button
            class="mb-4 ml-auto mr-auto block px-2 py-1 text-2xl tracking-wider hover:bg-neutral-100 hover:text-[#b76b36] lg:ml-0 lg:mr-0
            {highlightedOption === 2 ? 'bg-neutral-100 text-[#b76b36]' : 'text-neutral-100'}"
            on:click={() => {
                $gameState.settings.open = true
            }}
        >
            Settings
        </button>
    </div>
    <div
        class="xl:top-bottom absolute bottom-16 w-full text-neutral-100 lg:bottom-16 lg:left-36 lg:w-auto xl:bottom-32 xl:left-52"
        in:fade={{ duration: 500 }}
        out:fade={{ duration: 500 }}
    >
        <button
            class="text-1xl ml-auto mr-auto block px-2 py-1 tracking-wider hover:bg-neutral-100 hover:text-[#b76b36] lg:ml-0 lg:mr-0
            {highlightedOption === 3 ? 'bg-neutral-100 text-[#b76b36]' : 'text-neutral-100'}"
            on:click={() => {
                toggleAudio()
            }}
        >
            Audio: {audioOn ? 'On' : 'Off'}
        </button>
    </div>
{/if}
