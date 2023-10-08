<script lang="ts">
    import { gameMessage } from '$lib/stores'
    import { fade } from 'svelte/transition'

    let messageVisible = false
    let messageTimeout: number

    $: fadeInMessage($gameMessage)

    function fadeInMessage(m: { message: string; type: number }) {
        if (m.message) {
            messageVisible = true
            clearTimeout(messageTimeout)
            messageTimeout = setTimeout(function () {
                messageVisible = false
                $gameMessage.message = ''
            }, 5000)
        }
    }
</script>

{#if messageVisible}
    <div in:fade={{ duration: 100 }} out:fade={{ duration: 500 }} class="absolute top-12 z-20 w-full text-center">
        <div class="m-2 inline-block select-none rounded-md bg-neutral-300 px-3 py-2 text-neutral-900">
            <h3>{$gameMessage.message}</h3>
        </div>
    </div>
{/if}
