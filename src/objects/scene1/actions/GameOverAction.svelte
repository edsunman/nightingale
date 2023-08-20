<script lang="ts">
    import { gameState } from "$lib/stores"

    export let inArea : boolean

    $ : gameOver(inArea)

    function gameOver(inArea: boolean){
        if(inArea){
           $gameState.gameOver = true
        }
    }
</script>