<script lang="ts">
    import SceneData from '../objects/SceneData.svelte'

    import type { GameData, Scene } from '$lib/types'
    import Emitter from '$lib/components/Emitter.svelte'
    import { Vector3 } from 'three'

    export let gameData: GameData
    const scene = gameData.scenes.find((s) => s.id === 0) as Scene

    let start: any
    let stop: any

    //@ts-ignore
    window.start = () => {
        start()
    }
    //@ts-ignore
    window.stop = () => {
        stop()
    }

    const stateChanged = (event: CustomEvent) => {
        console.log(event.detail.state)
    }
</script>

<SceneData {scene} />

<Emitter
    particleCount={100}
    particleLife={4}
    spread={90}
    velocity={5}
    direction={new Vector3(0, 2, 0)}
    size={20}
    explosiveness={0}
    colorGradient={'rgba(255,0,0,0) 0%, rgba(255,26,9,1) 15%, rgba(255,193,68,1) 86%, rgba(255,214,76,0) 100%'}
    bind:start
    bind:stop
    on:stateChanged={stateChanged}
    debug
    dampen
/>
<!--
{#each { length: 200 } as _, i}
    <Emitter
        particleCount={100}
        particleLife={3}
        bind:start
        bind:stop
        on:stateChanged={stateChanged}
        position={{ x: 0, y: 0, z: 3 * i }}
    />
{/each}-->
