<script lang="ts">
    import { gameState, gamePadState } from '$lib/stores'
    import { items } from '$lib/items'
    import { fade } from 'svelte/transition'

    import type { Item } from '$lib/types'

    const i: Item[] = items
    let inventory: Item[] = []
    let selectedItem: Item | undefined
    let highlightedSlot = 0

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
        if (e.key === 'i') {
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

    $: gamePadUsed($gamePadState)

    function gamePadUsed(gps: typeof $gamePadState) {
        if (gps.clusterRight === 1) {
            toggleInventory()
        } else if (gps.right === 1) {
            if (!$gameState.inventory.open) return
            if (highlightedSlot < inventory.length - 1) {
                highlightedSlot++
            }
        } else if (gps.left === 1) {
            if (!$gameState.inventory.open) return
            if (highlightedSlot > 0) {
                highlightedSlot--
            }
        } else if (gps.clusterBottom === 1) {
            if (!$gameState.inventory.open) return
            if (inventory.length < 1) return
            const item = inventory[highlightedSlot]
            selectItem(item)
        }
    }
</script>

{#if $gameState.inventory.open}
    <div
        class="absolute bottom-0 right-0 z-20 m-5 mb-20 w-[16.5rem] select-none rounded-xl bg-white/10 pt-6 text-neutral-100 backdrop-blur-md"
    >
        <h3 class="mb-4 text-center text-xl uppercase">inventory</h3>
        <div class="painted rounded-xl bg-gradient-to-b from-neutral-950 to-neutral-900 px-6 py-4">
            {#if selectedItem}
                <div
                    class="mb-5 mt-2 h-24 w-full bg-contain bg-center bg-no-repeat"
                    style="background-image:url('/icons/{selectedItem.image}"
                />
                <h3 class="text-center text-xl">{selectedItem.name}</h3>
                <div class="flex-wrapmb-3 flex h-14 content-center">
                    <p class=" m-auto px-4 text-center text-sm">{selectedItem.description}</p>
                </div>
            {/if}
            {#if inventory.length < 1}
                <h3 class="mb-4 text-center text-xl">empty</h3>
            {/if}
            <div class="flex flex-wrap">
                {#each inventory as item, j}
                    <button
                        on:click={() => {
                            selectItem(item)
                        }}
                        class="m-2 h-14 w-14 rounded-md bg-[size:75%] bg-center bg-no-repeat p-1
                        {item === selectedItem ? 'border-2 border-neutral-300' : ''}
                        {j === highlightedSlot ? 'bg-white/[0.2]' : ' bg-white/[0.1]'}
                            "
                        style="background-image:url('/icons/{item.image}')"
                    />
                {/each}
                {#each { length: 3 - inventory.length } as _, i}
                    <div class="m-2 h-14 w-14 rounded-md bg-neutral-900" />
                {/each}
            </div>
        </div>
    </div>
{/if}

<div class="absolute bottom-0 right-0" in:fade={{ duration: 500 }}>
    <button
        on:click={() => toggleInventory()}
        class="
        {$gameState.inventory.open ? 'bg-white/20 text-neutral-50' : 'bg-white/20 text-neutral-50 opacity-70 hover:opacity-100'}
        {$gameState.settings.open || $gameState.moveLock ? 'pointer-events-none opacity-50' : ' '}
          m-5 select-none rounded-md bg-white/10 px-3 py-2 text-neutral-300 outline-none backdrop-blur-md hover:bg-white/20"
    >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250" fill="currentColor" class="cursorHover h-6 w-6">
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
