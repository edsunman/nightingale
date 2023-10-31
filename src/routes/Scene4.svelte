<script lang="ts">
    import SceneData from '../objects/SceneData.svelte'
    import { T } from '@threlte/core'

    import type { GameData, Scene } from '$lib/types'

    export let gameData: GameData
    const scene = gameData.scenes.find((s) => s.id === 4) as Scene
</script>

<SceneData {scene} />
<T.AmbientLight intensity={0.15} />
