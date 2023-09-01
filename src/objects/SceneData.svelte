<script lang="ts">
    import NodeObject from './NodeObject.svelte'

    import type { GameData, Category } from '$lib/types';

    export let gameData: GameData
    export let sceneId: number
    const categories = gameData.scenes.find((s) => s.id === sceneId)?.categories || []
  //  let categories: Category[] = []
    //if (sceneData) sceneObjects = sceneData.
</script>

{#each categories as category}
    <NodeObject objects={category.objects} url={category.url} />
{/each}