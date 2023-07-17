  <script lang="ts">

    import { gameState } from '$lib/stores'
    import { objectives } from '$lib/objectives';
    import { fade } from 'svelte/transition'
    let showObjective = false

  </script>
  
  {#if showObjective}
        <div in:fade={{ duration: 300 }} out:fade={{ duration: 300 }}>
            <ul class="list-disc absolute mt-16 pt-2 mx-6 text-neutral-100">
                {#each objectives as objective}
                    {#if (objective.itemRequired && $gameState.inventory.owned.includes(objective.itemRequired)) || !objective.itemRequired}
                        <li
                            class="text-sm ml-5 pt-2 {objective.itemsStrike && objective.itemsStrike.some(r => $gameState.inventory.owned.includes(r))
                                ? 'line-through'
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
        on:mouseenter={() => {
            showObjective = true
        }}
        on:mouseleave={() => {
            showObjective = false
        }}
        class="absolute my-5 mx-6 transition-opacity duration-300 text-neutral-100 opacity-50 hover:opacity-100"
    >
        <p><small>Objective:</small></p>
        <p>Find a fuel cell</p>
    </div>