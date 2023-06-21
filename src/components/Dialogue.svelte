<script lang="ts">
    import { gameConversation } from '$lib/stores'
    import { script } from '$lib/script'

    import type { Script } from '$lib/types'

    const s : Script = script
</script>

{#if $gameConversation[0] !== 0}
    <small>{script[$gameConversation[0] - 1].name}:</small><br />
    {s[$gameConversation[0] - 1].speech.find((x) => x.id === $gameConversation[1])?.text}
{/if}
