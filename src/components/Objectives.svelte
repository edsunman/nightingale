<script lang="ts">
    import { gameState, gameMessage } from '$lib/stores'
    import { objectives } from '$lib/objectives'
    import { fade } from 'svelte/transition'
    import type { GameState } from '$lib/types'

    let showObjective = false

    $: updateObjectives($gameState)
    function updateObjectives(gs: GameState) {
        objectives.forEach((objective) => {
            if (
                objective.itemRequired &&
                gs.inventory.owned.includes(objective.itemRequired) &&
                !gs.objectivesShown.includes(objective.id)
            ) {
                setTimeout(() => {
                    $gameState.objectivesShown.push(objective.id)
                    $gameMessage = { message: 'New Objective: ' + objective.text, type: 1 }
                }, 3000)
            }
        })
    }
    // {objective.itemsStrike && objective.itemsStrike.some(r => $gameState.inventory.owned.includes(r))
</script>

<div
    role="list"
    in:fade={{ duration: 500 }}
    on:mouseenter={() => {
        showObjective = true
    }}
    on:mouseleave={() => {
        showObjective = false
    }}
    class="absolute mx-6 my-5 select-none text-neutral-50 opacity-70 transition-opacity duration-300 hover:opacity-100 hover:duration-0"
>
    <p><small class="uppercase">Objective:</small></p>
    <p>Find a fuel cell</p>
</div>

{#if showObjective}
    <div
        out:fade={{ duration: 300 }}
        class="absolute mx-6 mt-20 select-none rounded-md bg-white/10 px-3 py-2 text-neutral-100 backdrop-blur-md"
    >
        <ul class="list-disc">
            {#each objectives as objective}
                {#if objective.id && $gameState.objectivesShown.includes(objective.id)}
                    <li
                        class="ml-5 mr-3 py-1 text-sm {objective.itemsStrike &&
                        objective.itemsStrike.some((r) => $gameState.inventory.owned.includes(r))
                            ? 'line-through opacity-70'
                            : ''}"
                    >
                        {objective.text}
                    </li>
                {/if}
            {/each}
        </ul>
    </div>
{/if}
