<script lang="ts">
    import { gameState } from '$lib/stores'
    import { items } from '$lib/items'
    import { fade } from 'svelte/transition'

    import type { Item, Items } from '$lib/types'

    const i: Items = items
    let inventory: Item[] = []
    let selectedItem: Item | undefined

    $: setInventory($gameState)

    function setInventory(gs: any) {
        inventory = []
        gs.inventory.owned.forEach((itemid: number) => {
            const item = i.find((x) => x.id === itemid)
            if (item?.isSecretKey === false) {
                if (item.id === $gameState.inventory.equipped) {
                    selectedItem = item
                }
                inventory.push(item)
            }
        })
        if ($gameState.inventory.equipped === 0) {
            selectedItem = undefined
        }
    }

    function onKeyDown(e: any) {
        if (e.keyCode == 69 || e.keyCode == 73) {
            toggleInventory()
        }
    }

    function toggleInventory() {
        if (!$gameState.settings.open && !$gameState.moveLock) {
            $gameState.inventory.open = !$gameState.inventory.open
        }
    }

    function selectItem(item: Item) {
        if (selectedItem === item) {
            selectedItem = undefined
            $gameState.inventory.equipped = 0
        } else {
            selectedItem = item
            $gameState.inventory.equipped = item.id
        }
    }
</script>

{#if $gameState.inventory.open}
    <div
        class="z-20 absolute w-[16.5rem] right-0 bottom-0 mb-20 text-neutral-100 backdrop-blur-md bg-white/10 rounded-xl select-none m-5 pt-6"
    >
        <h3 class="text-xl text-center mb-4 uppercase">inventory</h3>
        <div class="painted px-6 rounded-xl py-4 bg-gradient-to-b from-neutral-950 to-neutral-900">
            {#if selectedItem}
                <div
                    class="bg-no-repeat bg-center bg-contain w-full h-24 mb-5 mt-2"
                    style="background-image:url('/icons/{selectedItem.image}"
                />
                <h3 class="text-xl text-center">{selectedItem.name}</h3>
                <div class="flex content-center h-14 flex-wrapmb-3">
                    <p class=" text-center text-sm m-auto px-4">{selectedItem.description}</p>
                </div>
            {/if}
            {#if inventory.length < 1}
                <h3 class="text-xl text-center mb-4">empty</h3>
            {/if}
            <div class="flex flex-wrap">
                {#each inventory as item}
                    <button
                        on:click={() => {
                            selectItem(item)
                        }}
                        class="m-2 w-14 h-14 rounded-md p-1 bg-no-repeat bg-center bg-[size:75%]
                        {item === selectedItem ? 'border-neutral-300 bg-white/[0.2] border-2' : ' bg-white/[0.1]'}
                            "
                        style="background-image:url('/icons/{item.image}')"
                    />
                {/each}
                {#each { length: 3 - inventory.length } as _, i}
                    <div class="m-2 w-14 h-14 bg-neutral-900 rounded-md" />
                {/each}
            </div>
        </div>
    </div>
{/if}

<div class="absolute right-0 bottom-0" in:fade={{ duration: 500 }}>
    <button
        on:click={() => toggleInventory()}
        class="
        {$gameState.inventory.open ? 'bg-white/20 text-neutral-50' : 'text-neutral-50 bg-white/20 opacity-70 hover:opacity-100'}
        {$gameState.settings.open || $gameState.moveLock ? 'pointer-events-none opacity-50' : ' '}
          rounded-md px-3 py-2 select-none m-5 outline-none text-neutral-300 backdrop-blur-md hover:bg-white/20 bg-white/10"
    >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250" fill="currentColor" class="w-6 h-6 cursorHover">
            <polygon
                class="cursorHover"
                points="9.35 31.81 32 18.7 90.37 7 177.94 15.12 188.91 23.47 215.62 23.47 240.65 67.58 249 143.89 235.51 183.09 215.24 197.39 211.36 168.04 220.38 129.58 215.62 75.93 204.88 53.27 194.15 64.01 191.77 92.62 172.69 105.74 117.85 104.54 86.85 102.16 86.85 80.7 66.58 77.12 53.46 83.08 52.98 99.18 41.54 102.16 4.82 102.16 1 50.89 9.35 31.81"
            /><polygon
                points="90.5 118.63 148.92 122.2 181.97 122.06 194.15 148.66 194.15 191.58 194.15 214.24 177.46 232.12 133.35 241.9 47.5 239.27 6.96 224.97 3.38 180.85 5.47 131 26.11 116.24 53.54 118.63 54.73 131.74 54.73 143.66 83.34 148.43 83.34 134.13 84.54 121.01 90.5 118.63"
            />
        </svg>
    </button>
</div>

<svelte:window on:keyup|preventDefault={onKeyDown} />
