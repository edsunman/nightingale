<script lang="ts">
    import { gameConversation, gameState } from '$lib/stores'

    import type { Script, Character, Speech } from '$lib/types'

    export let script: Script
    let character: Character
    let characterPosition
    let speech: Speech
    let dialogueLine: string
    let alreadyChosen = false

    $: updateSpeech($gameConversation)

    function updateSpeech(gc: any) {
        const characterLookup = script.find((x) => x.id === gc[0])

        if (!characterLookup) {
            console.error('No character found with id ' + gc[0])
            return
        }
        characterPosition = script.findIndex((x) => x.id === gc[0])
        if (characterLookup) {
            character = characterLookup
        }
        let speechLookup
        if (gc[1] === 1) {
            // first selected speech
            speechLookup = script[characterPosition].speech.find((x) => x.order === 1)
        } else {
            speechLookup = script[characterPosition].speech.find((x) => x.id === gc[1])
        }
        if (!speechLookup) {
            console.error('Speech not found: ' + gc[1])
            return
        }
        speech = speechLookup

        alreadyChosen = $gameState.seenSpeech.includes(speech.id)

        dialogueLine = alreadyChosen && speech.textRepeat ? speech.textRepeat : speech.text

        if (dialogueLine.length > 45) {
            const wordCount = findWordCount(dialogueLine)
            const [part1, part2] = splitWords(dialogueLine, Math.ceil(wordCount / 2))
            dialogueLine = part1 + '<br/>' + part2
        }
    }

    function findWordCount(s: string) {
        const m = s.match(/[^\s]+/g)
        return m ? m.length : 0
    }

    function splitWords(text: string, numWords: number) {
        const words = text.split(' ')
        let part1 = '',
            part2 = ''
        words.forEach((word, idx) => {
            if (idx < numWords) {
                part1 += ' ' + word
            } else {
                part2 += ' ' + word
            }
        })
        return [part1.trim(), part2.trim()]
    }
</script>

{#if $gameConversation[0] !== 0}
    {#if !speech.incidental}
        <p class="leading-tight"><small class="uppercase text-neutral-400">{character.name}:</small></p>
    {/if}
    <p class="font-serif tracking-wide">{@html dialogueLine}</p>
{/if}
