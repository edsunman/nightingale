<script lang="ts">
    import { gameState, gamePixelRatio, gameVolume, gameScene, gamePosition, gameMessage } from '$lib/stores'

    export let version : string
    let selected: number

    function onKeyDown(e: any) {
        if (e.keyCode == 27) {
            toggleSettings()
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
        if (!$gameState.moveLock) {
            $gameState.inventory.open = false
            $gameState.settings.open = !$gameState.settings.open
        }
    }

    function saveGame() {
        const s = btoa(
            JSON.stringify({
                scene: $gameScene,
                position: $gamePosition,
                inventory: $gameState.inventory,
                spokenWith: $gameState.charctersSpokenWith,
                seenSpeech: $gameState.seenSpeech,
                selectedConvoOptions: $gameState.selectedConvoOptions
            })
        )
        localStorage.setItem('Nightingale Save Data', s)
        $gameState.settings.open = false
        $gameMessage = { 'message' : 'Game saved' , type : 0 }
    }

    function loadGame() {
        const s = localStorage.getItem('Nightingale Save Data')
        if (s) {
            const j = JSON.parse(atob(s))
            $gameState.nextScenePosition = j.position
            if ($gameScene === j.scene) {
                $gameScene = 0
                setTimeout(() => {
                    $gameScene = j.scene
                }, 100)
            } else {
                $gameScene = j.scene
            }
            $gameState.inventory = j.inventory
            $gameState.settings.open = false
            $gameState.charctersSpokenWith = j.spokenWith
            $gameState.seenSpeech = j.seenSpeech
            $gameState.selectedConvoOptions = j.selectedConvoOptions
        }
    }

    function setPixelAspectRatio() {
        $gamePixelRatio = selected
        $gameState.settings.open = false
    }
</script>

{#if $gameState.settings.open}
    <div
        class="backdrop-blur-sm bg-white/10 absolute w-96 top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] text-neutral-100 rounded-xl pt-6 select-none z-20"
    >
        <h3 class="text-xl text-center mb-4 uppercase">Settings</h3>
        <div class="painted px-8 rounded-xl py-4 bg-gradient-to-b from-neutral-950 to-neutral-900">
            <div class="flex my-7">
                <button
                    class="tracking-wider flex-1 mr-4 h-10 px-6 rounded-md bg-white/[0.05] text-neutral-200 hover:text-neutral-50 hover:bg-white/[0.1]"
                    on:click={() => saveGame()}>Save game</button
                >
                <button
                    class="tracking-wider flex-1 h-10 px-6 rounded-md bg-white/[0.05] text-neutral-200 hover:text-neutral-50 hover:bg-white/[0.1]"
                    on:click={() => loadGame()}>Load game</button
                >
            </div>
            <div class=" my-7">
                <div class="text-sm text-neutral-300">Graphics resolution</div>
                <select
                    bind:value={selected}
                    on:change={() => setPixelAspectRatio()}
                    class="tracking-wider my-3 h-10 px-3 rounded-md text-neutral-200 bg-white/[0.05] hover:bg-white/[0.1] focus:bg-neutral-800 w-full outline-none"
                >
                    <option value="1">Low</option>
                    <option value="2">High</option>
                </select>
            </div>
            <div class="my-7">
                <div class="text-sm text-neutral-300">Volume</div>
                <input
                    class="my-3 w-full accent-slate-500 outline-none"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    bind:value={$gameVolume}
                />
            </div>
            <div class="mt-7 text-center">
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
        class="w-full h-full bg-black opacity-0 z-10 absolute"
        on:click={() => toggleSettings()}
        on:keydown={() => toggleSettings()}
    />
{/if}

<div class="absolute bottom-0">
    <button
        on:click={() => toggleSettings()}
        class="
        {$gameState.settings.open ? 'bg-white/20 text-neutral-50' : 'text-neutral-50 bg-white/20 opacity-70 hover:opacity-100'}
        {$gameState.moveLock ? 'pointer-events-none opacity-50 ' : ''} 
          text-neutral-300 backdrop-blur-md hover:bg-white/20 bg-white/10 m-5 rounded-md px-3 py-2 select-none m-e outline-none"
    >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250" fill="currentColor" class="w-6 h-6 cursorHover">
            <path
                class="cursorHover"
                d="m197.91,123.88l3.02-8.03,30.18-21.72-4.72-17.69-22.64-30.76-44.33,14.42-10.38-47.1-52.82,2.88-6.6,49.02-45.28-19.22-15.09,16.34-12.26,30.18,33.01,29.41.94,5.77-33.96,26.72,4.72,18.46,24.52,29.8,38.67-13.46,5.66,3.84,5.66,41.33,33.01,1.92,23.58-4.81,3.77-42.29,5.66-3.84,43.39,18.26,27.35-48.06-35.09-31.38Zm-50.75,23.69l-19.81,10-22.64-6.15-13.21-23.07,8.49-26.91,24.05-11.92,14.62,5.19,12.26,12.5,5.66,21.15-9.43,19.22Z"
            />
        </svg>
    </button>
</div>

{#if $gameVolume === 0}
    <div class="absolute bottom-0 left-20">
        <button
            on:click={() => {
                $gameVolume = 0.6
            }}
            class="
            {!$gameState.settings.open && !$gameState.moveLock ? '' : 'opacity-50 pointer-events-none '}
            text-neutral-50 bg-white/20 opacity-70 hover:opacity-100 backdrop-blur-md rounded-md px-3 py-2 select-none m-5 ml-0 outline-none"
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250" fill="currentColor" class="w-6 h-6 cursorHover">
                <polygon class="cursorHover" points="1 102 46 96 109 39 122 47 122 207 107 222 47 166 4 160 1 102" /><path
                    d="m149.41,78.62l5.79-8.11s5.79-1.16,8.11,0,32.42,40.53,32.42,40.53l39.84-41.05,11.12,2.83,2.32,8.11-36.13,45.16,36.13,45.16-3.47,12.74-10.42-2.32-35.9-36.82-31.27,35.67-9.73,3.47-8.8-11.58,35.9-42.85-35.9-50.95Z"
                />
            </svg>
        </button>
    </div>
{/if}

<svelte:window on:keyup|preventDefault={onKeyDown} />
