  <script lang="ts" >

    import { gameConversation } from '$lib/stores';

    import { script } from '$lib/script';

 </script>
 
{#if $gameConversation[0]===1}

    <small>{script[$gameConversation[0]-1].name}:</small><br/>

    {script[$gameConversation[0]-1].speech.find(x => x.id === $gameConversation[1])?.text}

{/if}
                    