<script lang="ts">
    import { gameState, gameMovingTo } from '$lib/stores'
    import { T } from '@threlte/core'
    import { Vector3, Line, BufferGeometry, LineBasicMaterial } from 'three'
    import { isPointInside } from '$lib/util';

    export let id: number
    export let points: { x: number; z: number }[]
    export let debug = false
    export let noRepeat = false
    export let requiredItem = 0

    const debugLine = new Line()
    let inArea = false

    if (debug && points.length > 0) {
        const debugPoints = []
        for (let i = 0; i < points.length; i++) {
            debugPoints.push(new Vector3(points[i].x, 0.2, points[i].z))
        }
        debugPoints.push(new Vector3(points[0].x, 0.2, points[0].z))
        debugLine.material = new LineBasicMaterial({ color: 0x00ff00 })
        debugLine.geometry = new BufferGeometry().setFromPoints(debugPoints)
    }

    $: checkArea($gameMovingTo)

    function checkArea(gmt: { x: number; z: number }) {
        const enteredArea = isPointInside(gmt, points)
        if (enteredArea) {
            const alreadyBeenHere = $gameState.areasEntered.indexOf(id)
            if(noRepeat && alreadyBeenHere>=0) return
            if(requiredItem>0 && $gameState.inventory.owned.indexOf(requiredItem) === -1) return
            $gameState.areasEntered.indexOf(id) === -1 ? $gameState.areasEntered.push(id) : null
            $gameState = $gameState
            inArea = true
        } else {
            inArea = false
        }
    }
</script>

<slot {inArea} />

{#if debug}
    <T is={debugLine} />
{/if}
