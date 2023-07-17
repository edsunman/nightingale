<script lang="ts">
    import { gameState, gamePixelRatio, gameVolume, gameScene, gamePosition, gameMessage } from '$lib/stores'

    let selected : number

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
        $gameMessage = 'Game saved'
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

    function setPixelAspectRatio(){
        $gamePixelRatio = selected
        $gameState.settings.open = false
    }
</script>

{#if $gameState.settings.open}
    <div
        class="backdrop-blur-sm bg-white/10 absolute w-96 top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] text-neutral-100 rounded-xl pt-6 select-none z-20"
    >
        <h3 class="text-2xl text-center mb-4">Settings</h3>
        <div class="px-8 rounded-xl py-4 bg-gradient-to-b from-neutral-950 to-neutral-900">
            <div class="flex my-7">
                <button
                    class="flex-1 mr-4 h-10 px-6 font-semibold rounded-md bg-neutral-900 text-neutral-200 hover:text-neutral-50 hover:bg-neutral-800"
                    on:click={() => saveGame()}>Save game</button
                >
                <button
                    class="flex-1 h-10 px-6 font-semibold rounded-md bg-neutral-900 text-neutral-200 hover:text-neutral-50 hover:bg-neutral-800"
                    on:click={() => loadGame()}>Load game</button
                >
            </div>
            <div class=" my-7">
                <div class="text-sm text-neutral-300">Graphics resolution</div>
                <select bind:value={selected} on:change={() => setPixelAspectRatio()}
                    class="my-3 h-10 px-3 rounded-md text-neutral-200 bg-neutral-900 hover:bg-neutral-800 focus:bg-neutral-800 w-full outline-none"
                >
                    <option value="1" >Low</option>
                    <option value="2">High</option>
                </select>
            </div>
            <div class="mt-7">
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
        {$gameState.settings.open 
            ? 'text-neutral-600 pointer-events-none bg-neutral-900'
            : 'text-neutral-200 hover:text-neutral-50'}
        {$gameState.moveLock ? 'pointer-events-none opacity-50 ' : ''} 
          hover:bg-neutral-900 rounded-md px-3 py-2 select-none m-2 outline-none"
    >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 cursorHover">
            <path
                class="cursorHover"
                fill-rule="evenodd"
                d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 01-.517.608 7.45 7.45 0 00-.478.198.798.798 0 01-.796-.064l-.453-.324a1.875 1.875 0 00-2.416.2l-.243.243a1.875 1.875 0 00-.2 2.416l.324.453a.798.798 0 01.064.796 7.448 7.448 0 00-.198.478.798.798 0 01-.608.517l-.55.092a1.875 1.875 0 00-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 01-.064.796l-.324.453a1.875 1.875 0 00.2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 01.796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 01.517-.608 7.52 7.52 0 00.478-.198.798.798 0 01.796.064l.453.324a1.875 1.875 0 002.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 01-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 001.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 01-.608-.517 7.507 7.507 0 00-.198-.478.798.798 0 01.064-.796l.324-.453a1.875 1.875 0 00-.2-2.416l-.243-.243a1.875 1.875 0 00-2.416-.2l-.453.324a.798.798 0 01-.796.064 7.462 7.462 0 00-.478-.198.798.798 0 01-.517-.608l-.091-.55a1.875 1.875 0 00-1.85-1.566h-.344zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
                clip-rule="evenodd"
            />
        </svg>
    </button>
</div>

{#if $gameVolume === 0}
    <div class="absolute bottom-0 left-14">
        <button
            on:click={() => {
                $gameVolume = 0.6
            }}
            class="
            {!$gameState.settings.open && !$gameState.moveLock
                ? ' '
                : 'opacity-50 pointer-events-none '}
            hover:bg-neutral-900 text-neutral-200 hover:text-neutral-50 rounded-md px-3 py-2 select-none m-2 outline-none"
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 cursorHover">
                <path
                    class="cursorHover"
                    d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 001.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 00-1.06-1.06l-1.72 1.72-1.72-1.72z"
                />
            </svg>
        </button>
    </div>
{/if}

<svelte:window on:keyup|preventDefault={onKeyDown} />
