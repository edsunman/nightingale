<script lang="ts">

    import { gameState } from "$lib/stores";

    function toggleInventory(){
        if(!$gameState.settings.open && !$gameState.moveLock){
            $gameState.inventory.open = !$gameState.inventory.open;
        }
    }

</script>

{#if $gameState.inventory.open}

<div class="absolute right-0 bottom-0 mb-16 text-neutral-100 bg-neutral-950 rounded-md px-3 py-2 select-none m-2">
    empty
</div>

{/if}


<div class="absolute right-0 bottom-0">
    <button on:click={() => toggleInventory()} class="
        {!$gameState.settings.open && !$gameState.moveLock ? 'text-neutral-100' : 'text-neutral-600 pointer-events-none'}
        bg-neutral-950 rounded-md px-3 py-2 select-none m-2" >
        inventory
    </button>
</div>