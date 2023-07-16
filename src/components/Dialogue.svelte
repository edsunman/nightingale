<script lang="ts">
    import { gameConversation, gameState } from '$lib/stores'
   // import { script } from '$lib/script'

    import type { Script, Character, Speech } from '$lib/types'

    export let script : Script
    let character : Character
    let characterPosition
    let speech : Speech
    let alreadyChosen = false

    $ : updateSpeech($gameConversation)

    function updateSpeech(gc : any){
        const characterLookup = script.find(x => x.id === gc[0])

        if(!characterLookup) {
            console.error('No character found with id ' + gc[0])
        }

        characterPosition = script.findIndex(x => x.id === gc[0])
        if (characterLookup) {
            character = characterLookup
        }
        let speechLookup 
        if(gc[1]===1){ // first selected speech
            speechLookup = script[characterPosition].speech.find((x) => x.order === 1)
        } else {
            speechLookup = script[characterPosition].speech.find((x) => x.id === gc[1])
        }
        if (speechLookup) {
            speech = speechLookup
            alreadyChosen = $gameState.seenSpeech.includes(speech.id)
        }
    }

</script>

{#if $gameConversation[0] !== 0}
    <small>{character.name}:</small><br />
    {#if alreadyChosen && speech.textRepeat}
        {speech.textRepeat}
    {:else}
        {speech.text}
    {/if}
{/if}
