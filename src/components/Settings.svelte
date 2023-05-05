<script lang="ts">

    import { gameState } from "$lib/stores"

    function toggleSettings(){
        if(!$gameState.inventory.open && !$gameState.moveLock){
            $gameState.settings.open = !$gameState.settings.open
        }
    }

</script>

{#if $gameState.settings.open}
    <div class="absolute bottom-0 mb-16 text-neutral-100 bg-neutral-950 rounded-md px-3 py-2 select-none m-2">
        Settings
    </div>
{/if}


<div class="absolute bottom-0">
    <button on:click={() => toggleSettings()} class="
        {!$gameState.inventory.open && !$gameState.moveLock ? 'text-neutral-100' : 'text-neutral-600 pointer-events-none'}
         bg-neutral-950 rounded-md px-3 py-2 select-none m-2" >
        settings
    </button>
</div>