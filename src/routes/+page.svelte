<script lang="ts">

    import { gameState, gameMessage, gamePosition,gameConversation } from '$lib/stores';
    import { Canvas } from '@threlte/core';
    import { fade } from 'svelte/transition';
    import Game from './Game.svelte';
	import DialogueOptions from '../components/DialogueOptions.svelte';
	import Dialogue from '../components/Dialogue.svelte';
    import { script } from '$lib/script';
    

    let clientWidth, clientHeight;
    let showDialogueOptions = false;
    let messageVisible = false;



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

    $ : updateDialogue($gameConversation);

    function updateDialogue(g : any){

        showDialogueOptions = false;
        
        if (g[0]!==0) {

            if(script[g[0]-1].speech.find(x => x.id === g[1])?.showOptions) {
                
                setTimeout(() => {showDialogueOptions = true}, 1500);
                
            }  else {
                
                const nextLine = g[1]+0.1;
                setTimeout(() => {$gameConversation = [g[0],nextLine]}, 2500)
            }
        }
    }



</script>

<div class="h-screen lg:h-[700px] lg:aspect-[16/9] m-auto top-0 bottom-0 left-0 right-0 absolute overflow-hidden"
    bind:clientWidth={clientWidth} bind:clientHeight={clientHeight} >


        <div class="absolute bottom-0"><h3 class="text-neutral-100 bg-neutral-950 rounded-md px-3 py-2 select-none m-2">settings</h3></div>
        <div class="absolute right-0 bottom-0"><h3 class="text-neutral-100 bg-neutral-950 rounded-md px-3 py-2 select-none m-2" >inventory</h3></div>
        
        {#if showDialogueOptions}
            <div in:fade={{ duration: 100 }} class="absolute text-center w-full pt-1 bottom-12 md:bottom-6">
                <div class="inline-block text-neutral-100 bg-neutral-950 rounded-md p-3 m-3 ">
                    <DialogueOptions />
                </div>
            </div>
         {/if}
         {#if $gameConversation[0]!==0}
            <div class="absolute text-center w-full" style="bottom:{(clientHeight/2)+100}px ">
                <h3 class="text-neutral-100 bg-neutral-950 md:hidden inline-block rounded-md px-3 py-2 select-none ">
                   <Dialogue/>
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
        <p>Conversation State:</p>
        <p>{$gameConversation[0]} - {$gameConversation[1]}</p>
    </div>
 {/if}