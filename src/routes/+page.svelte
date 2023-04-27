<script lang="ts">

    import { gameState } from '$lib/stores';
    import { Canvas } from '@threlte/core';
    import Game from './Game.svelte';


  
</script>

<div style="height:600px; width:1200px; margin:0 auto;position:relative">
    <Canvas>
        <Game />       
    </Canvas>
    <div style="position:absolute; top:20px; width:150px; white-space: nowrap;left:20px; background-color:#202020; color:azure; font-family: monospace">
        <button on:click={() => {$gameState.dev.camera = !$gameState.dev.camera}} >switch camera</button><br/>
        <button on:click={() => {$gameState.dev.grid = !$gameState.dev.grid}} >switch grid</button><br/>
        <button on:click={() => {$gameState.dev.avoidObjactsVisible = !$gameState.dev.avoidObjactsVisible}} >avoid objects</button><br/><br/>
        <p>Player position:</p>
        <p>
            x: {$gameState.position.x.toFixed(3)}<br/>
            y: {$gameState.position.y.toFixed(3)}<br/>
            z: {$gameState.position.z.toFixed(3)}
        </p>
        <p>
            Movement locked:
            <input type=checkbox bind:checked={$gameState.moveLock}>
        </p>
                
        

    </div>
</div>