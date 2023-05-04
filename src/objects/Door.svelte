<script lang="ts" >

    import { gameScene, gameMessage, gamePosition } from "$lib/stores";
    import { T } from "@threlte/core";

    export let activeSquare = {x: 0, z: 0};
    export let scene : number;


    function doorClicked(e : any){

        const p = $gamePosition;

        if ($gamePosition.x === activeSquare.x && $gamePosition.z === activeSquare.z) {

            $gameScene = scene;
        } else {

            $gameMessage = 'A door'
        }

        
    }

</script>


<T.Mesh  castShadow name="door"  {...$$restProps}   on:click={(e) => {e.stopPropagation();doorClicked(e)}} >
    <T.BoxGeometry args={[1, 2, 0.1]} />
    <T.MeshStandardMaterial color="hotpink" />
</T.Mesh>