<script lang="ts">
    import { gameState } from '$lib/stores'
    import { useFrame } from '@threlte/core'
    import * as TWEEN from '@tweenjs/tween.js'
    import { onMount } from 'svelte'

    export let cameraOffset = { x: 0, z: 0 }

    let cameraMoving = false
    let cameraFinishedMoving = false
    let tween : any

    $: cameraArrived(cameraFinishedMoving)

    function cameraArrived(cfm: boolean) {
        if (cfm) {
            $gameState.moveLock = false
            $gameState.showHud = true
            $gameState.inventory.owned.push(105)
        }
    }

    $: {
        if ($gameState.mainMenu === false && !cameraFinishedMoving && tween) {
            tween.to({ x: 0, z: 0 }, 6000).start()
            cameraMoving = true
        }
    }

    onMount(()=>{
        if($gameState.mainMenu){
            cameraOffset = {x: 14, z: 14}
            tween = new TWEEN.Tween(cameraOffset)
            tween.easing(TWEEN.Easing.Quadratic.InOut)
        }
    })

    useFrame((context, delta) => {
        if (cameraOffset.x === 0) {
            cameraMoving = false
            cameraFinishedMoving = true
        }
        if (cameraMoving) {
            TWEEN.update()
            cameraOffset = cameraOffset
        }
    })
</script>
