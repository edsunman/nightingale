<script lang="ts">
    import { gameState, gameConversation, gameMessage } from '$lib/stores'
    import { items } from '$lib/items'

    import { fade } from 'svelte/transition'

    import type { Script, Items, Character, Speech, Option } from '$lib/types'

    export let script: Script
    const itemsArray: Items = items
    const optionsArray: Option[] = []
    let character: Character
    let speech: Speech
    let characterPosition
    let showDialogueOptions = false
    let timeOut : number

    $: updateDialogue($gameConversation)

    function updateDialogue(gc: any) {
        if (gc[0] !== 0) {
            const characterLookup = script.find((x) => x.id === gc[0])
            characterPosition = script.findIndex((x) => x.id === gc[0])
            if (!characterLookup) {
                console.error('No character found with id ' + gc[0])
                return
            }
            character = characterLookup
            let speechLookup
            if (gc[1] === 1) {
                speechLookup = script[characterPosition].speech.find((x) => x.order === 1)
            } else {
                speechLookup = script[characterPosition].speech.find((x) => x.id === gc[1])
            }
            if (!speechLookup) {
                console.error('No character found with id ' + gc[0])
                return
            }
            speech = speechLookup
            if (speech.incidental) {
            } else {
                $gameState.inventory.open = false
                showDialogueOptions = false
                setOptions(gc)
                $gameState.moveLock = true
                if (speech.options && speech.options.length > 0) {
                    timeOut = setTimeout(() => {
                        nextStep()
                    }, 1500)
                } else if (speech.linkId) {
                    timeOut = setTimeout(() => {
                        nextStep()
                    }, 4000)
                }
            }
        }
    }

    function nextStep() {
        if ($gameState.moveLock) {
            clearTimeout(timeOut)
            if (speech.options && speech.options.length > 0) {
                    showDialogueOptions = true
            } else if (speech.linkId) {
                    $gameConversation = [character.id, speech.linkId]
            }
        }
    }
    function setOptions(g: any) {
        optionsArray.length = 0
        if (g[0] !== 0) {
            const o = speech.options

            if (o) {
                o.forEach((option) => {
                    option.alreadyChosen = false
                    if ($gameState.selectedConvoOptions.includes(option.id) && option.linkId) {
                        option.alreadyChosen = true
                    }
                    if (option.item) {
                        const item = itemsArray.find((x) => x.id === option.item)
                        option.itemName = item?.name
                    }
                    if (!(option.hideItem && $gameState.inventory.owned.includes(option.hideItem))) {
                        if (option.item && $gameState.inventory.owned.includes(option.item)) {
                            optionsArray.push(option)
                        } else if (!option.item) {
                            optionsArray.push(option)
                        }
                    }
                })
            }
        }
    }

    function selectSpeech(n: number) {
        if (n + 1 > optionsArray.length || !showDialogueOptions) {
            return false
        }
        const option = optionsArray[n]
        if (!$gameState.selectedConvoOptions.find((x) => x === option.id)) {
            $gameState.selectedConvoOptions.push(option.id)
        }
        if (!$gameState.seenSpeech.find((x) => x === speech.id)) {
            $gameState.seenSpeech.push(speech.id)
        }
        if (option.receiveItem) {
            const item = itemsArray.find((x) => x.id === option.receiveItem)
            if (item) {
                const ownedArray = $gameState.inventory.owned
                ownedArray.indexOf(option.receiveItem) === -1 ? ownedArray.push(option.receiveItem) : null
                if (!item.isSecretKey) {
                    $gameMessage = { 'message' : 'You received a ' + item.name , 'type' : 2 }
                }
            }
        }
        if (option.giveItem) {
            const item = itemsArray.find((x) => x.id === option.giveItem)
            if (item) {
                $gameState.inventory.owned = $gameState.inventory.owned.filter((m) => m !== option.giveItem)
                $gameState.inventory.equipped === option.giveItem ? ($gameState.inventory.equipped = 0) : null
                $gameMessage = { 'message' : 'You gave ' + character.name + ' the ' + item.name , 'type' : 2 }
            }
        }
        if (!option.linkId) {
            $gameState.moveLock = false
            $gameConversation = [0, 0]
            showDialogueOptions = false
            //$gameState.seenSpeech.length = 0
        } else {
            $gameConversation = [character.id, option.linkId]
        }
    }

    function onKeyDown(e: any) {
        if (e.keyCode == 49) {
            selectSpeech(0)
        } else if (e.keyCode == 50) {
            selectSpeech(1)
        } else if (e.keyCode == 51) {
            selectSpeech(2)
        } else if (e.keyCode == 52) {
            selectSpeech(3)
        } else if (e.keyCode == 32) { // spacebar
            nextStep()
        }
    }
</script>

{#if showDialogueOptions}
    <div in:fade={{ duration: 100 }} class="absolute text-center w-full pt-1 bottom-20 md:bottom-6 select-none">
        <div class="inline-block">
            {#each optionsArray as option, i}
                <button
                    on:click={() => selectSpeech(i)}
                    class="font-serif tracking-wide flex-1 mr-4 max-w-sm px-6 py-2 rounded-md bg-neutral-900 hover:bg-neutral-800 block w-full
    {option.alreadyChosen ? 'text-neutral-500 hover:text-neutral-400' : 'text-neutral-50'}
    {optionsArray.length === i + 1 ? '' : 'mb-2 md:mb-3'} "
                >
                    <small class="text-neutral-500 font-sans">{i + 1}.</small>
                    {#if option.item && option.item < 100}<small class="font-sans text-cyan-500">&nbsp[{option.itemName}]&nbsp</small>
                    {/if}
                    {option.text}
                    {#if !option.linkId}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 250 250" class="inline w-5 h-5 ml-1">
                            <polygon
                                points="89.56 110.32 197.8 110.2 174.47 85.91 181.22 70.48 195.68 67.59 231.54 103.45 242.14 114.05 246 120.8 246 126.2 238.29 137.19 196.51 178.97 183.01 181.86 175.3 172.22 178.19 156.8 198.76 136.22 183.34 136.22 142.85 137.19 92.89 136.22 85.18 131.4 82.29 120.8 89.56 110.32"
                            /><polygon
                                points="114.98 25 46.2 25 30.75 28.32 16.63 40.78 13.31 57.06 13.31 197.61 19.95 212.73 29.92 219.38 44.54 224 118.97 224 135.42 218.55 147.88 206.92 151.2 186.98 147.88 177.84 135.42 172.03 127.11 175.35 124.62 180.34 124.62 196.95 118.8 199.44 50.69 199.44 47.36 198.61 37.4 188.64 38.23 55.73 43.21 49.09 121.29 49.92 125.45 56.57 125.45 65.7 131.26 74.01 141.23 75.67 149.54 69.03 151.2 47.76 142.89 32.48 125.28 25 114.98 25"
                            />
                        </svg>
                    {/if}
                </button>
            {/each}
        </div>
    </div>
{/if}
<svelte:window on:keyup|preventDefault={onKeyDown} />
