 <script lang="ts" >

    import { gameState, gameConversation } from '$lib/stores';

    function selectSpeech(a : any) {
        if(a.leave){

            $gameState.moveLock = false;
            $gameConversation = [0,0]

        } else {

            $gameConversation = a.node;

        }
    }

 </script>



 <!-- Purple -->
{#if $gameConversation[0]===1}

    {#if $gameConversation[1]===1.1||$gameConversation[1]===4}

        <button on:click={() => selectSpeech({ node : [1,2], options : true })} class="block w-full mb-2" >
        
            What is this place?
        
        </button>

        <button on:click={() => selectSpeech({ node : [1,3], options : true })} class="block w-full mb-2" >
        
            Where can I buy fuel?
        
        </button>

        <button on:click={() => selectSpeech({ leave : true })} class="block w-full">
        
            Thanks. See ya!
        
        </button>

    {:else if $gameConversation[1]===2}

        <button on:click={() => selectSpeech({ node : [1,4], options : true })} class="block w-full">
            
            Oh cool.
        
        </button>

    {:else if $gameConversation[1]===3}

        <button on:click={() => selectSpeech({ node : [1,4], options : true })} class="block w-full">
            
            I'll check it out.
        
        </button>


    {/if}
{/if}