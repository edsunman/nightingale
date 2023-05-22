 <script lang="ts" >

    import { gameState, gameConversation } from '$lib/stores'
    import { script } from '$lib/script'

    import type { Script } from '$lib/types'

    const s : Script = script
    let options : any[] = []
    let characterId : number = 0

    $ : setOptions($gameConversation)

    function setOptions(g : any) {
        options = []
        if (g[0]!==0) {
            characterId = g[0]
            const o = s[g[0]-1].speech.find(x => x.id === g[1])?.options
            if (o) {
                o.forEach(option => {
                    if(option.item===undefined||$gameState.inventory.owned.includes(option.item)){
                        options.push(option)
                    }
                })
            }
        }
    }

    function selectSpeech(n : number) {
        if(n+1>options.length){
            return false
        }
        const a = options[n]
        if(!a.linkId){
            $gameState.moveLock = false;
            $gameConversation = [0,0]
        } else {
            $gameConversation = [characterId,a.linkId]
        }
    }

     function onKeyDown(e : any){
        if(e.keyCode==49) {
            selectSpeech(0) 
        } else if(e.keyCode==50) {
            selectSpeech(1) 
        } else if(e.keyCode==51) {
            selectSpeech(2) 
        }
    }

 </script>

{#each options as option,i}
    <button on:click={() => selectSpeech(i)} class="block w-full {options.length === i+1 ? '' : 'mb-3'} " >
        <small class="text-neutral-500">{i+1}.</small> {option.text}
        {#if !option.linkId}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="inline w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
        {/if}
    </button>
{/each}

<svelte:window on:keyup|preventDefault={onKeyDown} />