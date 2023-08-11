<script lang="ts">
    import { gameMessage } from '$lib/stores'
    import { fade } from 'svelte/transition'

    let messageVisible = false
    let messageTimeout: number

    $: fadeInMessage($gameMessage)

    function fadeInMessage(m: { message: string; type: number }) {
        if (m.message) {
            console.log(m.type)
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
    <div in:fade={{ duration: 100 }} out:fade={{ duration: 500 }} class="z-20 absolute text-center w-full top-12">
        <div class="inline-block text-neutral-900 bg-neutral-300 rounded-md px-3 py-2 select-none m-2">
            <h3>{$gameMessage.message}</h3>
        </div>
    </div>
{/if}
