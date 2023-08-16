<script lang="ts">
    import NodeObject from './NodeObject.svelte'

    import type { GameData, SceneObject } from '$lib/types';

    export let gameData: GameData
    export let sceneId: number
    const sceneData = gameData.scenes.find((s) => s.id === sceneId)
    let sceneObjects: SceneObject[] = []
    if (sceneData) sceneObjects = sceneData.objects
</script>

{#each sceneObjects as collection}
    <NodeObject objects={collection.objects} url={collection.url} />
{/each}