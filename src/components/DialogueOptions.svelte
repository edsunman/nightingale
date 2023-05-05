 <script lang="ts" >

    import { gameState, gameConversation } from '$lib/stores'
    import { script } from '$lib/script'

    let options : any[] = []
    let characterId : number = 0
    let length = 0;

    $ : setOptions($gameConversation);

    function setOptions(g : any) {

        options = [];
        length = 0;

        if (g[0]!==0) {
            characterId = g[0];
            const o = script[g[0]-1].speech.find(x => x.id === g[1])?.options
            if (o) {
                o.forEach(option => {
                    length ++;
                    options.push(option)
                })
            }
        }
    }

    function selectSpeech(c : number, a : any) {
        if(!a.linkId){
            $gameState.moveLock = false;
            $gameConversation = [0,0]
        } else {
            $gameConversation = [c,a.linkId]
        }
    }



 </script>

{#each options as option,i}
    {#if option.item===undefined||$gameState.inventory.owned.includes(option.item)}
        <button on:click={() => selectSpeech(characterId,option)} class="block w-full {length === i+1 ? '' : 'mb-3'} " >
            {option.text}
            {#if !option.linkId}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="inline w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
            {/if}
        </button>
    {/if}
{/each}

