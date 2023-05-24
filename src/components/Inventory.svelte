<script lang="ts">

    import { gameState } from "$lib/stores"
    import { items } from "$lib/items"

    function onKeyDown(e : any){
        if(e.keyCode==69) {
            toggleInventory()
        }
    }

    function toggleInventory(){
        if(!$gameState.settings.open && !$gameState.moveLock){
            $gameState.inventory.open = !$gameState.inventory.open
        }
    }

</script>

{#if $gameState.inventory.open}
    <div class="absolute w-48 right-0 bottom-0 mb-16 text-neutral-100 bg-neutral-950 rounded-md select-none m-2 px-6 py-6">
        <h3 class="text-2xl text-center mb-4">inventory</h3>
        <div class="flex flex-wrap">
            {#each $gameState.inventory.owned as item}
                {#if item > 0}
                     <div class="m-2 w-14 h-14 bg-neutral-900 rounded-md p-1">
                        <img 
                            class="h-12"
                            src="/{items.find(x => x.id === item)?.image}"
                            alt={items.find(x => x.id === item)?.name}/>
                     </div>
                {/if}
            {/each}
            {#each {length: 6-($gameState.inventory.owned.length-1)} as _, i}
            <div class="m-2 w-14 h-14 bg-neutral-900 rounded-md"></div>
            {/each}
        </div>
    </div>
{/if}


<div class="absolute right-0 bottom-0">
    <button on:click={() => toggleInventory()} class="
        {!$gameState.settings.open && !$gameState.moveLock ? 'text-neutral-100' : 'text-neutral-600 pointer-events-none'}
        bg-neutral-950 rounded-md px-3 py-2 select-none m-2" >
        inventory
    </button>
</div>

<svelte:window on:keyup|preventDefault={onKeyDown} />