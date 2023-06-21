<script lang="ts">
    import { gameState } from '$lib/stores'
    import { items } from '$lib/items'

    import type { Item, Items } from '$lib/types'

    const i: Items = items
    let inventory: Item[] = []
    let selectedItem: Item

    $: setInventory($gameState)

    function setInventory(gs: any) {
        inventory = []
        gs.inventory.owned.forEach((itemid: number) => {
            const item = i.find((x) => x.id === itemid)
            if (item?.isSecretKey===false) {
                if (!selectedItem) {
                    selectedItem = item
                }
                inventory.push(item)
            }
        })
    }

    function onKeyDown(e: any) {
        if (e.keyCode == 69) {
            toggleInventory()
        }
    }

    function toggleInventory() {
        if (!$gameState.settings.open && !$gameState.moveLock) {
            $gameState.inventory.open = !$gameState.inventory.open
        }
    }

    function selectItem(item: Item) {
        selectedItem = item
    }
</script>

{#if $gameState.inventory.open}
    <div class="absolute w-[16.5rem] right-0 bottom-0 mb-16 text-neutral-100 bg-neutral-950 rounded-md select-none m-2 px-6 py-6">
        {#if selectedItem}
            <div class="bg-no-repeat bg-center bg-contain w-full h-24" style="background-image:url('/{selectedItem.image}" />
            <h3 class="text-xl text-center mb-4">{selectedItem.name}</h3>
        {/if}
        <div class="flex flex-wrap">
            {#each inventory as item}
                <button
                    on:click={() => {
                        selectItem(item)
                    }}
                    class="m-2 w-14 h-14 bg-neutral-900 rounded-md p-1 bg-no-repeat bg-center bg-[size:60%]
                       {item === selectedItem ? 'border-neutral-300 border-2' : ''}
                        "
                    style="background-image:url('/{item.image}')"
                />
            {/each}
            {#each { length: 6 - inventory.length } as _, i}
                <div class="m-2 w-14 h-14 bg-neutral-900 rounded-md" />
            {/each}
        </div>
    </div>
{/if}

<div class="absolute right-0 bottom-0">
    <button
        on:click={() => toggleInventory()}
        class="
        {!$gameState.settings.open && !$gameState.moveLock ? 'text-neutral-100' : 'text-neutral-600 pointer-events-none'}
        bg-neutral-950 rounded-md px-3 py-2 select-none m-2"
    >
        inventory
    </button>
</div>

<svelte:window on:keyup|preventDefault={onKeyDown} />
