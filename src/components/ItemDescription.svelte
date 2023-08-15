<script lang="ts">

    import { gameState } from "$lib/stores"
    import { items } from "$lib/items"

    function closeDescription(){
         $gameState.itemDescription.open = false
         $gameState.moveLock = false
    }

    function takeItem(id : number){
        $gameState.inventory.owned.push($gameState.selectedItemId)
        $gameState = $gameState
        closeDescription()
    } 

</script>

{#if $gameState.itemDescription.open}
    <div class="absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] text-neutral-100 bg-neutral-950 rounded-md px-3 py-2 select-none m-2 z-20">
      <!-- <img 
            class="h-12"
            src="/{items.find(x => x.id === $gameState.selectedItemId)?.image}" alt={items.find(x => x.id === $gameState.selectedItemId)?.name}/> -->
       <button on:click={() => closeDescription()}>ignore</button>
       <button on:click={() => takeItem($gameState.selectedItemId)}>take</button>
    </div>
{/if}