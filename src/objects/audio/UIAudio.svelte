<script lang="ts">
    import { gameState, gameVolume, gamePosition, gameMessage } from '$lib/stores'
    import { AudioListener, Audio } from '@threlte/extras'

    import type { GameState } from '$lib/types'

    let inventoryOpen = false
    let equippedItem = 0
    let openInventoryAudio  : any
    let itemSelectAudio : any
    let newObjectiveAudio  : any
    let audio: any

    $: inventoryOpenSound($gameState)

    function inventoryOpenSound(gs: GameState) {
        if (!inventoryOpen && gs.inventory.open) {
            inventoryOpen = true
            openInventoryAudio.play()
        }
        if (!gs.inventory.open) {
            inventoryOpen = false
        }
    }

    $: itemEquippedSound($gameState)

    function itemEquippedSound(gs: GameState) {
        if (equippedItem !== gs.inventory.equipped) {
            const source = itemSelectAudio.context.createBufferSource()
            const gainNode = itemSelectAudio.context.createGain()
            source.buffer = itemSelectAudio.buffer
            gainNode.gain.value = $gameVolume
            source.connect(gainNode)
            gainNode.connect(itemSelectAudio.context.destination)
            source.start()

            equippedItem = gs.inventory.equipped
        }
    }

    $: newObjectiveSound($gameMessage)

    function newObjectiveSound(gm: {'message': string, 'type': number}) {
        if (gm.type === 1 && gm.message) {
            newObjectiveAudio.play()
        }
    }
    

</script>

<AudioListener bind:ref={audio}  masterVolume={$gameVolume} position={[$gamePosition.x, 2, $gamePosition.z]} rotation.y={0.78} />
<Audio src={'/audio/openBag.mp3'}  bind:ref={openInventoryAudio} autoplay={false} loop={false} volume={1} />
<Audio src={'/audio/item.mp3'}  bind:ref={itemSelectAudio} autoplay={false} loop={false} volume={1} />
<Audio src={'/audio/objective.mp3'}  bind:ref={newObjectiveAudio} autoplay={false} loop={false} volume={1} />