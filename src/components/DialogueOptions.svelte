<script lang="ts">
    import { gameState, gameConversation, gameMessage } from '$lib/stores'
    //import { script } from '$lib/script'
    import { items } from '$lib/items'

    import { fade } from 'svelte/transition'

    import type { Script, Items, Character, Speech } from '$lib/types'

    export let script: Script
    const itemsArray: Items = items
    const optionsArray: any[] = []
    let character: Character
    let speech: Speech
    let characterPosition
    let showDialogueOptions = false

    $: updateDialogue($gameConversation)

    function updateDialogue(g: any) {
        if (g[0] !== 0) {
            const characterLookup = script.find((x) => x.id === g[0])
            characterPosition = script.findIndex((x) => x.id === g[0])
            if (characterLookup) {
                character = characterLookup
            }
            let speechLookup
            if (g[1] === 1) {
                // first selected speech
                speechLookup = script[characterPosition].speech.find((x) => x.order === 1)
            } else {
                speechLookup = script[characterPosition].speech.find((x) => x.id === g[1])
            }

            if (speechLookup) {
                speech = speechLookup
            }
            $gameState.inventory.open = false
            showDialogueOptions = false
            setOptions(g)

            $gameState.moveLock = true
            if (speech.options && speech.options.length > 0) {
                setTimeout(() => {
                    showDialogueOptions = true
                }, 1500)
            } else if (speech.linkId) {
                setTimeout(() => {
                    $gameConversation = [g[0], speech.linkId]
                }, 2000)
            }
        }
    }

    //$: setOptions($gameConversation)

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
                    if (option.item && $gameState.inventory.owned.includes(option.item)) {
                        optionsArray.push(option)
                    } else if (!option.item) {
                        optionsArray.push(option)
                    }
                })
            }
        }
    }

    function selectSpeech(n: number) {
        if (n + 1 > optionsArray.length) {
            return false
        }
        const option = optionsArray[n]
        if (!$gameState.selectedConvoOptions.find((x) => x === option.id)) {
            $gameState.selectedConvoOptions.push(option.id)
        }
        if(!$gameState.seenSpeech.find(x => x === speech.id)) {
                $gameState.seenSpeech.push(speech.id)
        }
        if (option.receiveItem) {
            const item = itemsArray.find((x) => x.id === option.receiveItem)
            if (item) {
                const ownedArray = $gameState.inventory.owned
                ownedArray.indexOf(option.receiveItem) === -1 ? ownedArray.push(option.receiveItem) : null
                if (!item.isSecretKey) {
                    $gameMessage = 'You received ' + item.name
                }
            }
        }
        if (!option.linkId) {
            $gameState.moveLock = false
            $gameConversation = [0, 0]
            showDialogueOptions = false
            $gameState.seenSpeech.length = 0
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
        }
    }
</script>

{#if showDialogueOptions}
    <div in:fade={{ duration: 100 }} class="absolute text-center w-full pt-1 bottom-12 md:bottom-6">
        <div class="inline-block text-neutral-100 bg-gradient-to-b from-neutral-950 to-neutral-900 rounded-xl p-3 m-3">
            {#each optionsArray as option, i}
                <button
                    on:click={() => selectSpeech(i)}
                    class="flex-1 mr-4 h-10 px-6 font-semibold rounded-md bg-neutral-900 hover:bg-neutral-800 block w-full
    {option.alreadyChosen ? 'text-neutral-500 hover:text-neutral-400' : 'text-neutral-200 hover:text-neutral-50'}
    {optionsArray.length === i + 1 ? '' : 'mb-3'} "
                >
                    <small class="text-neutral-500">{i + 1}.</small>
                    {option.text}
                    {#if !option.linkId}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="inline w-6 h-6"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                            />
                        </svg>
                    {/if}
                </button>
            {/each}
        </div>
    </div>
{/if}
<svelte:window on:keyup|preventDefault={onKeyDown} />
