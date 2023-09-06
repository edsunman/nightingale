<script lang="ts">
    import NodeObject from './NodeObject.svelte'

    import type { Scene } from '$lib/types'

    export let scene: Scene
</script>

{#each scene.categories as category}
    <NodeObject objects={category.objects} url={category.url} />
{/each}
