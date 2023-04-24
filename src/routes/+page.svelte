<script lang="ts">

    import { gameState } from '$lib/stores';
    import { Canvas } from '@threlte/core';
    import Scene from './Scene.svelte';


  
</script>

<div style="height:600px; width:1200px; margin:0 auto;position:relative">
    <Canvas>
        <Scene  on:credate={(ref)=>{console.log(ref)}}/>
    </Canvas>
    <div style="position:absolute; top:20px; width:150px; white-space: nowrap;left:20px; background-color:#202020; color:azure; font-family: monospace">
        <button on:click={() => {$gameState.devCamera = !$gameState.devCamera}} >switch camera</button><br/>
        
        

    </div>
</div>