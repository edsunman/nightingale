<script lang="ts">
    import SceneData from '../objects/SceneData.svelte'

    import type { GameData, Scene } from '$lib/types'
    import Emitter from '$lib/components/Emitter.svelte'
    import { BoxGeometry, MeshBasicMaterial, Vector3 } from 'three'
    import { T } from '@threlte/core'
    import { useTexture, TransformControls } from '@threlte/extras'

    export let gameData: GameData
    const scene = gameData.scenes.find((s) => s.id === 0) as Scene

    const t = useTexture('/texture/smokeWhite.png')

    let start: any
    let stop: any
    let box: any
    let emmitPosition = new Vector3(0, 0, 0)

    const updatePos = (box: any) => {
        console.log(box)
        emmitPosition.x = box.position.x
        emmitPosition.y = box.position.y
        emmitPosition.z = box.position.z
    }

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

{#await t then t}
    <Emitter
        position={emmitPosition}
        scale={new Vector3(10, 10, 10)}
        count={100}
        life={5}
        spread={15}
        velocity={0}
        wind={new Vector3(0, 0, 0)}
        gravity={new Vector3(0, 0, 0)}
        direction={new Vector3(0, 0, 0)}
        sizeRandom={1}
        explosiveness={0}
        color={'rgba(255,255,255,0) 0%, rgba(255,255,255,1) 20%, rgba(255,255,255,1) 80%, rgba(255,255,255,0) 100%'}
        size={'size(2) 0%, size(2) 100%'}
        colorRandom={0.1}
        rotationRandom={3}
        dampen={0}
        map={t}
        bind:start
        bind:stop
        on:stateChanged={stateChanged}
    />
{/await}
<!--
<T.Mesh let:ref bind:ref={box} scale={[1, 1, 1]} position={[1, 1, 1]}>
    <T.BoxGeometry />
    <T.MeshBasicMaterial wireframe visible={false} />
    <TransformControls
        object={ref}
        on:mouseUp={() => {
            updatePos(box)
        }}
    />
</T.Mesh>
-->
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
