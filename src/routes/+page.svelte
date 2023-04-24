<script lang="ts">
  import { Canvas } from '@threlte/core'
  import Scene from './Scene.svelte'
  import { cameraPosition,selectedGridSpace, playerPosition, playerAnimation } from '$lib/stores';

  let cSwitch = false;

  
</script>

<div style="height:600px; width:1200px; margin:0 auto;position:relative">
    <Canvas>
        <Scene cameraSwitch={cSwitch} on:credate={(ref)=>{console.log(ref)}}/>
    </Canvas>
    <div style="position:absolute; top:20px; width:150px; white-space: nowrap;left:20px; background-color:#202020; color:azure; font-family: monospace">
        <button on:click={() => {cSwitch = !cSwitch}} >switch camera</button><br/>
        
        Camera position:<br/>
        x : {$cameraPosition.x}<br/>
        y : {$cameraPosition.y}<br/>
        z : {$cameraPosition.z}<br/><br/><br/>
        Selected grid space:<br/>
        x : {$selectedGridSpace.x}<br/>
        y : {$selectedGridSpace.y}<br/>
        z : {$selectedGridSpace.z}<br/><br/><br/>
        Player position:<br/>
        x : {$playerPosition.x}<br/>
        y : {$playerPosition.y}<br/>
        z : {$playerPosition.z}<br/><br/>
        Player animation:<br/>
        {$playerAnimation}

    </div>
</div>