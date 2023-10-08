<script lang="ts">
    import { gameState } from '$lib/stores'
    import { items } from '$lib/items'

    function closeDescription() {
        $gameState.itemDescription.open = false
        $gameState.moveLock = false
    }

    function takeItem(id: number) {
        $gameState.inventory.owned.push($gameState.selectedItemId)
        $gameState = $gameState
        closeDescription()
    }
</script>

{#if $gameState.itemDescription.open}
    <div
        class="absolute left-[50%] top-[50%] z-20 m-2 translate-x-[-50%] translate-y-[-50%] select-none rounded-md bg-neutral-950 px-3 py-2 text-neutral-100"
    >
        <!-- <img 
            class="h-12"
            src="/{items.find(x => x.id === $gameState.selectedItemId)?.image}" alt={items.find(x => x.id === $gameState.selectedItemId)?.name}/> -->
        <button on:click={() => closeDescription()}>ignore</button>
        <button on:click={() => takeItem($gameState.selectedItemId)}>take</button>
    </div>
{/if}
