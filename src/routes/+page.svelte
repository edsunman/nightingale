<script lang="ts">

    import { gameState, gameMessage, gamePosition } from '$lib/stores';
    import { Canvas } from '@threlte/core';
    import { fade } from 'svelte/transition';
    import Game from './Game.svelte';
    

    let clientWidth, clientHeight;

    let messageVisible = false;

    function selectedSpeech(n : number) {
        $gameState.inConvo = false;
        $gameState.moveLock = false;
    }

    $ : fadeInMessage($gameMessage);

    function fadeInMessage(m : string) {
        if($gameMessage) {
            messageVisible = true;
            setTimeout(function() {
                messageVisible = false;
                $gameMessage = ''
            }, 3500)
        }
    }


</script>

<div class="h-screen lg:h-[700px] lg:aspect-[16/9] m-auto top-0 bottom-0 left-0 right-0 absolute overflow-hidden"
    bind:clientWidth={clientWidth} bind:clientHeight={clientHeight} >


        <div class="absolute bottom-0"><h3 class="text-neutral-100 bg-neutral-950 rounded-md px-3 py-2 select-none m-2">settings</h3></div>
        <div class="absolute right-0 bottom-0"><h3 class="text-neutral-100 bg-neutral-950 rounded-md px-3 py-2 select-none m-2" >inventory</h3></div>
        
        {#if $gameState.inConvo}
            <div in:fade={{duration: 100, delay: 2000 }} out:fade={{duration: 100 }} class="absolute text-center w-full pt-1 bottom-12">
                <div class="inline-block text-neutral-100 bg-neutral-950 rounded-md p-3 m-3 ">
                    <h3 class="mb-3" >Why's that?</h3>
                    <h3 class="mb-3" >You'll be seeing the inside of an ambulence if you're not careful.</h3>
                    <button on:click={() => selectedSpeech(3)} >Ok bud. See you later.</button>
                </div>
            </div>
         
            <div  class="absolute text-center w-full" style="bottom:{(clientHeight/2)+100}px ">
                <h3 transition:fade={{duration: 100}} class="text-neutral-100 bg-neutral-950 md:hidden inline-block rounded-md px-3 py-2 select-none ">
                    <small>Philomele:</small><br/>Why would you say that? So shocking...
                </h3>
            </div> 
        {/if}
        {#if messageVisible}
            <div in:fade={{duration: 100 }} out:fade={{duration: 500 }}  class="absolute text-center w-full top-16" >
                <div class="inline-block text-neutral-900 bg-neutral-300 rounded-md px-3 py-2 select-none m-2">
                    <h3>{$gameMessage}</h3>
                </div>
            </div>
        {/if}
    <Canvas>
        <Game />       
    </Canvas>



</div>
{#if $gameState.dev.status}
    <div class="mt-12" style="position:absolute; top:20px; width:150px; white-space: nowrap;left:20px; background-color:#202020; color:azure; font-family: monospace">
        <button on:click={() => {$gameState.dev.camera = !$gameState.dev.camera}} >switch camera</button><br/>
        <button on:click={() => {$gameState.dev.grid = !$gameState.dev.grid}} >switch grid</button><br/>
        <button on:click={() => {$gameState.dev.avoidObjactsVisible = !$gameState.dev.avoidObjactsVisible}} >avoid objects</button><br/><br/>
        <p>Player position:</p>
        <p>
            x: {$gamePosition.x.toFixed(3)}<br/>
            y: {$gamePosition.y.toFixed(3)}<br/>
            z: {$gamePosition.z.toFixed(3)}
        </p>
        <p>
            Movement locked:
            <input type=checkbox bind:checked={$gameState.moveLock}>
        </p>

    </div>
 {/if}