<script lang="ts">

    // TODO : This would be better as a child of the scene and not bound to each character

    import { gameMovingTo, gameConversation, gameSelectedCharacterPosition } from '$lib/stores'
    import { page } from '$app/stores'
    import { onMount } from 'svelte'
    import type { Speech } from '$lib/types'

    export let position = { x: 1, y: 0, z: 1 }
    export let characterId: number
    export const clicked = (e : any) => stopIncidental()

    const waitTime = 3000
    const radius = 6

    let incidentalDialogue: number[] = []
    let interval : ReturnType<typeof setInterval>
    let intervalCount = 0
    let running = false
    let characterSpeech: Speech[]
    
    if(characterId>0){
        characterSpeech = $page.data.script.find((x: any) => x.id === characterId).speech
    }
    

    $: checkPlayerPosition($gameMovingTo)

    function checkPlayerPosition(gmt: { x: number; z: number }) {
        if ((gmt.x !== 0 && gmt.z !== 0) && characterId>0) {
            if (
                (position.x + radius > gmt.x &&
                gmt.x > position.x - radius &&
                position.z + radius > gmt.z &&
                gmt.z > position.z - radius)
                && !running
            ) {
                incidentalDialogue.length = 0
                intervalCount = 0
                characterSpeech.forEach((speech) => {
                    if (speech.incidental) {
                        incidentalDialogue.push(speech.id)
                    }
                })
                incidentalDialogue.push(0)
                startIncidental()
            }
        }
    }

    function startIncidental() {
        running = true
        clearInterval(interval)
        interval = setInterval(() => {
          //  console.log(intervalCount)
            showDialogue(incidentalDialogue[intervalCount])
            intervalCount++
        }, waitTime)
    }

    function stopIncidental() {
        running = false
        clearInterval(interval)
    }

    function showDialogue(speechId: number) {
        if (speechId > 0) {
            $gameSelectedCharacterPosition = { x: position.x, y: 2.6, z: position.z }
            $gameConversation = [characterId, speechId]
        } else {
            stopIncidental()
            $gameConversation = [0,0]
        }
    }

    onMount(() => {
        //console.log(characterSpeech)
    })
</script>
