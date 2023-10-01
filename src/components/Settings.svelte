<script lang="ts">
    import { gameState, gamePixelRatio, gameVolume, gameScene, gamePosition, gameMessage } from '$lib/stores'
    import { fade } from 'svelte/transition'

    export let version: string
    let selected: number

    function onKeyDown(e: any) {
        if (e.keyCode == 27) {
            if (!$gameState.moveLock) {
                toggleSettings()
            }
        }
        if (e.keyCode == 77) {
            if ($gameVolume === 0) {
                const vp = $gameState.volumePreference
                $gameVolume = vp ? vp : 1
            } else {
                $gameState.volumePreference = $gameVolume
                $gameVolume = 0
            }
        }
    }

    function toggleSettings() {
        $gameState.inventory.open = false
        $gameState.settings.open = !$gameState.settings.open
    }

    function saveGame() {
        const s = btoa(
            JSON.stringify({
                scene: $gameScene,
                position: $gamePosition,
                gameState: $gameState
                // inventory: $gameState.inventory,
                // spokenWith: $gameState.charctersSpokenWith,
                // seenSpeech: $gameState.seenSpeech,
                // selectedConvoOptions: $gameState.selectedConvoOptions
            })
        )
        localStorage.setItem('Nightingale Save Data', s)
        $gameState.settings.open = false
        $gameMessage = { message: 'Game saved', type: 0 }
    }

    function loadGame() {
        const s = localStorage.getItem('Nightingale Save Data')
        if (s) {
            const j = JSON.parse(atob(s))
            $gameState = j.gameState
            $gameState.nextScenePosition = j.position
            if ($gameScene === j.scene) {
                $gameScene = 0
                setTimeout(() => {
                    $gameScene = j.scene
                }, 100)
            } else {
                $gameScene = j.scene
            }
            $gameState.settings.open = false
        }
    }

    function setPixelAspectRatio() {
        $gamePixelRatio = selected
    }
</script>

{#if $gameState.settings.open}
    <div
        class="absolute left-[50%] top-[50%] z-20 w-96 translate-x-[-50%] translate-y-[-50%] select-none rounded-xl bg-white/10 pt-6 text-neutral-100 backdrop-blur-sm"
    >
        <h3 class="mb-4 text-center text-xl uppercase">Settings</h3>
        <div class="painted rounded-xl bg-gradient-to-b from-neutral-950 to-neutral-900 px-8 py-4">
            {#if !$gameState.mainMenu}
                <div class="mb-10 mt-7 flex">
                    <button
                        class="mr-4 h-10 flex-1 rounded-md bg-white/[0.05] px-6 tracking-wider text-neutral-200 hover:bg-white/[0.1] hover:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        on:click={() => saveGame()}>Save game</button
                    >
                    <button
                        class="h-10 flex-1 rounded-md bg-white/[0.05] px-6 tracking-wider text-neutral-200 hover:bg-white/[0.1] hover:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        on:click={() => loadGame()}>Load game</button
                    >
                </div>
            {/if}
            <div class="my-4 hidden lg:flex">
                <div class="flex flex-1 items-center text-sm text-neutral-300">Graphics resolution</div>
                <select
                    bind:value={selected}
                    on:change={() => setPixelAspectRatio()}
                    class="h-10 flex-initial rounded-md bg-white/[0.05] px-3 text-sm tracking-wider text-neutral-200 hover:bg-white/[0.1] focus:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
                >
                    <option value="1">Low</option>
                    <option value="2">High</option>
                </select>
            </div>
            <div class="my-4 hidden lg:flex">
                <div class="flex h-10 flex-1 items-center text-sm text-neutral-300">Full screen</div>
                <div class="flex flex-initial items-center">
                    <label class="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" value="" class="peer sr-only" bind:checked={$gameState.settings.fullScreen} />
                        <div
                            class="peer h-6 w-11 rounded-full bg-neutral-800 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-slate-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-2 peer-focus:ring-slate-300 dark:border-gray-600"
                        />
                    </label>
                </div>
                <!--<input class="flex-initial h-10" type="checkbox" bind:checked={$gameState.settings.fullScreen} />-->
            </div>
            <div class="my-4 hidden lg:flex">
                <div class="flex h-10 flex-1 items-center text-sm text-neutral-300">Post processing</div>
                <div class="flex flex-initial items-center">
                    <label class="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" value="" class="peer sr-only" bind:checked={$gameState.settings.postProcessing} />
                        <div
                            class="peer h-6 w-11 rounded-full bg-neutral-800 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-slate-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-2 peer-focus:ring-slate-300 dark:border-gray-600"
                        />
                    </label>
                </div>
                <!--  <input class="flex-initial h-10" type="checkbox"  />-->
            </div>

            <div class="my-4 flex">
                <div class="flex h-10 flex-1 items-center text-sm text-neutral-300">Volume</div>
                <input class="flex-1 accent-slate-500" type="range" min="0" max="1" step="0.01" bind:value={$gameVolume} />
            </div>
            <div class="mb-3 mt-7 text-center">
                <p class="text-xs text-neutral-600">
                    Built with <a href="http://www.threlte.xyz" target="_blank" class="text-neutral-500 hover:text-neutral-400"
                        >threlte</a
                    >. View the code on
                    <a href="https://github.com/edsunman/nightingale/" target="_blank" class="text-neutral-500 hover:text-neutral-400"
                        >github</a
                    >.
                </p>
                <p class="text-xs text-neutral-600">Version {version}</p>
            </div>
        </div>
    </div>
    <div
        class="absolute z-10 h-full w-full bg-black opacity-0"
        on:click={() => toggleSettings()}
        on:keydown={() => toggleSettings()}
        role="none"
    />
{/if}
{#if $gameState.showHud}
    <div class="absolute bottom-0" in:fade={{ duration: 500 }}>
        <button
            on:click={() => toggleSettings()}
            class="
            {$gameState.settings.open ? 'bg-white/20 text-neutral-50' : 'bg-white/20 text-neutral-50 opacity-70 hover:opacity-100'}
            {$gameState.moveLock ? 'pointer-events-none opacity-50 ' : ''} 
            m-e m-5 select-none rounded-md bg-white/10 px-3 py-2 text-neutral-300 outline-none backdrop-blur-md hover:bg-white/20"
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250" fill="currentColor" class="cursorHover h-6 w-6">
                <path
                    class="cursorHover"
                    d="m197.91,123.88l3.02-8.03,30.18-21.72-4.72-17.69-22.64-30.76-44.33,14.42-10.38-47.1-52.82,2.88-6.6,49.02-45.28-19.22-15.09,16.34-12.26,30.18,33.01,29.41.94,5.77-33.96,26.72,4.72,18.46,24.52,29.8,38.67-13.46,5.66,3.84,5.66,41.33,33.01,1.92,23.58-4.81,3.77-42.29,5.66-3.84,43.39,18.26,27.35-48.06-35.09-31.38Zm-50.75,23.69l-19.81,10-22.64-6.15-13.21-23.07,8.49-26.91,24.05-11.92,14.62,5.19,12.26,12.5,5.66,21.15-9.43,19.22Z"
                />
            </svg>
        </button>
    </div>

    {#if $gameVolume === 0}
        <div class="absolute bottom-0 left-20" in:fade={{ duration: 500 }}>
            <button
                on:click={() => {
                    $gameVolume = 0.6
                }}
                class="
            {!$gameState.settings.open && !$gameState.moveLock ? '' : 'pointer-events-none opacity-50 '}
            m-5 ml-0 select-none rounded-md bg-white/20 px-3 py-2 text-neutral-50 opacity-70 outline-none backdrop-blur-md hover:opacity-100"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250" fill="currentColor" class="cursorHover h-6 w-6">
                    <polygon class="cursorHover" points="1 102 46 96 109 39 122 47 122 207 107 222 47 166 4 160 1 102" /><path
                        d="m149.41,78.62l5.79-8.11s5.79-1.16,8.11,0,32.42,40.53,32.42,40.53l39.84-41.05,11.12,2.83,2.32,8.11-36.13,45.16,36.13,45.16-3.47,12.74-10.42-2.32-35.9-36.82-31.27,35.67-9.73,3.47-8.8-11.58,35.9-42.85-35.9-50.95Z"
                    />
                </svg>
            </button>
        </div>
    {/if}
{/if}
<svelte:window on:keyup|preventDefault={onKeyDown} />
