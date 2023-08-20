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

{#if showObjective}
    <div out:fade={{ duration: 300 }} >
        <ul class="list-disc absolute mt-16 pt-2 mx-6 text-neutral-100 select-none">
            {#each objectives as objective}
                {#if objective.id && $gameState.objectivesShown.includes(objective.id)}
                    <li
                        class="text-sm ml-5 pt-2 {objective.itemsStrike &&
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
<div
    in:fade={{ duration: 500 }}
    on:mouseenter={() => {
        showObjective = true
    }}
    on:mouseleave={() => {
        showObjective = false
    }}
    class="absolute my-5 mx-6 transition-opacity duration-300 hover:duration-0 text-neutral-100 opacity-50 hover:opacity-100 select-none"
>
    <p><small class="uppercase">Objective:</small></p>
    <p>Find a fuel cell</p>
</div>
