<script lang="ts">

    import { gameState, gamePixelRatio, gameVolume, gameScene, gamePosition } from "$lib/stores"

    function onKeyDown(e : any){
        if(e.keyCode==27) {
            toggleSettings()
        }
        if(e.keyCode==77){
            if($gameVolume === 0) {
                const vp = $gameState.volumePreference
                $gameVolume = vp ? vp : 1
            } else {
                $gameState.volumePreference = $gameVolume
                $gameVolume = 0
            }
        }
    }

    function toggleSettings(){
        if(!$gameState.moveLock){
            $gameState.inventory.open = false
            $gameState.settings.open = !$gameState.settings.open
        }
    }

    function saveGame(){
        const s = btoa(JSON.stringify({scene: $gameScene, position: $gamePosition, inventory: $gameState.inventory, spokenWith: $gameState.charctersSpokenWith}))
        localStorage.setItem("Nightingale Save Data", s)
        $gameState.settings.open = false
    }

    function loadGame(){
        const s = localStorage.getItem("Nightingale Save Data")
        if(s) {
            const j = JSON.parse(atob(s))
            $gameState.nextScenePosition = j.position
            if($gameScene===j.scene){
                $gameScene = 0
                setTimeout(()=>{$gameScene = j.scene}, 100)
            } else {
                 $gameScene = j.scene
            }
            $gameState.inventory = j.inventory
            $gameState.settings.open = false
            $gameState.charctersSpokenWith = j.spokenWith
        }
    }

</script>

{#if $gameState.settings.open}
    <div class="absolute w-80 top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] text-neutral-100 bg-neutral-950 rounded-md px-8 py-6 select-none m-2 z-20">
        <h3 class="text-2xl text-center mb-4">settings</h3>
        <p class="my-3">
            <button on:click={() => saveGame()}>Save</button>
            <button on:click={() => loadGame()}>Load</button>
        </p>
        <p class="my-3">
            resolution<br/>
            <select class="my-3 p-2 border-neutral-800 border-2 text-neutral-100 bg-neutral-950 w-full">
                <option value=0 >default</option>
                <option value=1 >low</option>
                <option value=2 >high</option>
            </select>
        </p>
        <p class="my-3">
            volume<br/>
            <input class="my-3 w-full" type="range" min=0 max=1 step=0.1 bind:value={$gameVolume}  />
        </p>
        
    </div>
     <div class="w-full h-full bg-black opacity-50 z-10 absolute" on:click={() => toggleSettings()} on:keydown={() => toggleSettings()}></div>
{/if}


<div class="absolute bottom-0">
    <button on:click={() => toggleSettings()} class="
        {!$gameState.settings.open && !$gameState.moveLock ? 'text-neutral-100' : 'text-neutral-600 pointer-events-none'}
         bg-neutral-950 rounded-md px-3 py-2 select-none m-2" >
        settings
    </button>
</div>
<svelte:window on:keyup|preventDefault={onKeyDown} />