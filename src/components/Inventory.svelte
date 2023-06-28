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
            if (item?.isSecretKey === false) {
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
    <div
        class="absolute w-[16.5rem] right-0 bottom-0 mb-16 text-neutral-100 backdrop-blur-md bg-white/10 rounded-xl select-none m-2 pt-6"
    >
        {#if selectedItem}
            <div class="bg-no-repeat bg-center bg-contain w-full h-24 mb-3" style="background-image:url('/{selectedItem.image}" />
            <h3 class="text-xl text-center mb-2">{selectedItem.name}</h3>
            <p class="text-center text-sm mb-3 px-4">{selectedItem.description}</p>
        {/if}
        {#if inventory.length < 1}
            <h3 class="text-xl text-center mb-4">empty</h3>
        {/if}
        <div class="px-6 rounded-xl py-4 bg-gradient-to-b from-neutral-950 to-neutral-900">
            <div class="flex flex-wrap">
                {#each inventory as item}
                    <button
                        on:click={() => {
                            selectItem(item)
                        }}
                        class="m-2 w-14 h-14 bg-neutral-800 rounded-md p-1 bg-no-repeat bg-center bg-[size:60%]
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
    </div>
{/if}

<div class="absolute right-0 bottom-0">
    <button
        on:click={() => toggleInventory()}
        class="
        {!$gameState.settings.open && !$gameState.moveLock && !$gameState.inventory.open
            ? 'text-neutral-200 hover:text-neutral-50 bg-neutral-950'
            : 'text-neutral-600 bg-neutral-900'}
        {$gameState.settings.open || $gameState.moveLock ? 'pointer-events-none' : ''}
          hover:bg-neutral-900 rounded-md pr-3 pl-3 py-2 select-none m-2 outline-none"
    >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" class="w-6 h-6 cursorHover">
            <path
                class="cursorHover"
                d="M153.6,332.8v128h204.8v-128H153.6z M409.6,313.25V460.8c0,28.3-22.9,51.2-51.2,51.2H153.6c-28.28,0-51.2-22.9-51.2-51.2
		V313.25c-15.7-14.08-25.6-34.5-25.6-57.25v-76.8c0-42.4,34.4-76.8,76.8-76.8h204.8c42.43,0,76.8,34.4,76.8,76.8V256
		C435.2,278.75,425.33,299.2,409.6,313.25z M153.6,153.6c-14.13,0-25.6,11.47-25.6,25.6V256c0,14.15,11.48,25.6,25.6,25.6h204.8
		c14.15,0,25.6-11.45,25.6-25.6v-76.8c0-14.13-11.45-25.6-25.6-25.6H153.6z M281.6,281.6h-51.2V256c0-14.13,11.48-25.6,25.6-25.6
		c14.15,0,25.6,11.48,25.6,25.6V281.6z M281.6,332.8v25.6c0,14.15-11.45,25.6-25.6,25.6c-14.13,0-25.6-11.45-25.6-25.6v-25.6H281.6z
		 M166.4,0c21.23,0,38.4,17.2,38.4,38.4v76.8c0,21.23-17.18,38.4-38.4,38.4c-21.2,0-38.4-17.18-38.4-38.4V38.4
		C128,17.2,145.2,0,166.4,0z M345.6,0C366.83,0,384,17.2,384,38.4v76.8c0,21.23-17.17,38.4-38.4,38.4c-21.2,0-38.4-17.18-38.4-38.4
		V38.4C307.2,17.2,324.4,0,345.6,0z"
            />
        </svg>
    </button>
</div>

<svelte:window on:keyup|preventDefault={onKeyDown} />
