  <script lang="ts">

    import { gameState } from '$lib/stores'
    import { objectives } from '$lib/objectives';
    import { fade } from 'svelte/transition'
    let showObjective = false

  </script>
  
  {#if showObjective}
        <div out:fade={{ duration: 300 }}>
            <ul class="list-disc absolute mt-16 pt-2 mx-6 text-neutral-100">
                {#each objectives as objective}
                    {#if (objective.itemRequired && $gameState.inventory.owned.includes(objective.itemRequired)) || !objective.itemRequired}
                        <li
                            class="text-sm ml-5 pt-2 {objective.itemsStrike && objective.itemsStrike.some(r => $gameState.inventory.owned.includes(r))
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
        on:mouseenter={() => {
            showObjective = true
        }}
        on:mouseleave={() => {
            showObjective = false
        }}
        class="absolute my-5 mx-6 transition-opacity duration-300 hover:duration-0 text-neutral-100 opacity-50 hover:opacity-100"
    >
        <p><small class="uppercase">Objective:</small></p>
        <p>Find a fuel cell</p>
    </div>