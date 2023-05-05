<script lang="ts" >

    import { gameScene, gameMessage, gamePosition, gameState } from "$lib/stores"
    import { T } from "@threlte/core"
    import { useCursor } from "$lib/useCursor"

    export let nextScenePosition = {x: 0, z: 0}
    export let activeSquare = {x: 0, z: 0}
    export let scene : number

    const { onPointerEnter, onPointerLeave } = useCursor()

    function doorClicked(e : any){
        if ($gamePosition.x === activeSquare.x && $gamePosition.z === activeSquare.z) {
            $gameState.nextScenePosition = nextScenePosition;          
            $gameScene = scene;
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