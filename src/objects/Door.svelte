<script lang="ts" >

    import { gameScene, gameMessage, gamePosition, gameState } from "$lib/stores"
    import { T } from "@threlte/core"
    import { useCursor } from "$lib/util/useCursor"

    export let nextScenePosition = {x: 0, z: 0}
    export let activeSquare = {x: 0, z: 0}
    export let scene : number
    export let key : number = 0

    const { onPointerEnter, onPointerLeave } = useCursor()

    function openDoor(){
        $gameState.nextScenePosition = nextScenePosition;          
        $gameScene = scene;
    }

    function doorClicked(e : any){

        if ($gamePosition.x === activeSquare.x && $gamePosition.z === activeSquare.z) {
            if(key>0){
                if ($gameState.inventory.owned.includes(key)){
                    openDoor()
                } else {
                    $gameMessage = 'The door is locked'
                }
            } else {
                openDoor()
            }
        } else {
            $gameMessage = 'A door'
        }
    }

</script>


<T.Mesh
    castShadow
    name="door" 
    {...$$restProps} 
    on:click={(e) => {e.stopPropagation(); doorClicked(e)}}
    on:pointerenter={onPointerEnter} 
    on:pointerleave={onPointerLeave}
>
    <T.BoxGeometry args={[1, 2, 0.1]} />
    <T.MeshStandardMaterial color="hotpink" />
</T.Mesh>