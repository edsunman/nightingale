<script lang="ts">
    
    import { gamePosition, gameMessage, gameState } from "$lib/stores"
    import { items } from "$lib/items";
    import { T } from '@threlte/core'
    import { useCursor } from "$lib/util/useCursor"

    export let id : number
    export let position :  { x: number, y: number, z: number }

    let owned = false;
    const item = items.find(x => x.id === id)

    const { onPointerEnter, onPointerLeave } = useCursor()

    $ : isOwned($gameState)

    function isOwned(gs : any){
        gs.inventory.owned.includes(item?.id) ? owned = false : owned = true
    }

    function itemClicked(e : any){
        const player = $gamePosition
        if((player.x >= position.x-1 && player.x <= position.x+1)&&(player.z >= position.z-1 && player.z <= position.z+1)) {
            let itemId = 0
            if(item?.id) itemId = item?.id
            $gameState.selectedItemId = itemId
            $gameState.itemDescription.open = true
            $gameState.moveLock = true
        } else {
            $gameMessage = item?.message ?? ''
        }
    }
</script>

{#if owned===true}
    <T.Mesh name={item?.name} visible={true}
        position={[position.x,position.y,position.z]}
        on:click={(e) => {e.stopPropagation(); itemClicked(e)}}
        on:pointerenter={onPointerEnter} 
        on:pointerleave={onPointerLeave}
    >
        <T.BoxGeometry args={[1, 1, 1]} />
        <T.MeshStandardMaterial color="brown" />
    </T.Mesh>
{/if}