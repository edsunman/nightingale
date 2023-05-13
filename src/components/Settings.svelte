<script lang="ts">

    import { gameState, gamePixelRatio, gameVolume } from "$lib/stores"

    function toggleSettings(){
        if(!$gameState.inventory.open && !$gameState.moveLock){
            $gameState.settings.open = !$gameState.settings.open
        }
    }

</script>

{#if $gameState.settings.open}
    <div class="absolute bottom-0 mb-16 text-neutral-100 bg-neutral-950 rounded-md px-3 py-2 select-none m-2">
        <p>
            Resolution<br/>
            <select>
                <option value=0 >Default</option>
                <option value=1 >Force Low</option>
                <option value=2 >Force High</option>
            </select>
        </p>
        <p>
            Volume<br/>
            <input type="range" min=0 max=1 step=0.1 bind:value={$gameVolume}  />
        </p>
        
    </div>
{/if}


<div class="absolute bottom-0">
    <button on:click={() => toggleSettings()} class="
        {!$gameState.inventory.open && !$gameState.moveLock ? 'text-neutral-100' : 'text-neutral-600 pointer-events-none'}
         bg-neutral-950 rounded-md px-3 py-2 select-none m-2" >
        settings
    </button>
</div>