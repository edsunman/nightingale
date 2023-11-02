<script lang="ts">
    import SceneData from '../objects/SceneData.svelte'

    import type { GameData, Scene } from '$lib/types'
    import { Emitter } from '$lib/components'
    import { BoxGeometry, MeshBasicMaterial, ShaderMaterial, SphereGeometry, Vector3 } from 'three'
    import { T, useFrame } from '@threlte/core'
    import { useTexture, TransformControls } from '@threlte/extras'
    import fragmentShader from '../objects/materials/noise/noise-fragment.glsl?raw'
    import vertexShader from '../objects/materials/noise/noise-vertex.glsl?raw'
    import { gamePosition } from '$lib/stores'

    export let gameData: GameData
    const scene = gameData.scenes.find((s) => s.id === 0) as Scene

    const t = useTexture('/texture/bang.png')

    let start: any
    let stop: any
    let box: any
    let emmitPosition = new Vector3(4, 0, 0)

    let time = 0
    let sm: ShaderMaterial

    const updatePos = (box: any) => {
        //console.log(box)
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

    useFrame((_, delta) => {
        time += delta
        if (sm) {
            //sm.uniformsNeedUpdate = true
        }
    })
</script>

<SceneData {scene} />

{#await t then t}
    <Emitter
        debug
        position={emmitPosition}
        rotation={0}
        scale={new Vector3(0.1, 0.1, 0.1)}
        spriteSheet={3}
        count={1000}
        life={1}
        spread={180}
        velocity={3}
        dampen={10}
        wind={new Vector3(0, 0, 0)}
        gravity={new Vector3(0, -1, 0)}
        direction={new Vector3(0, 1, 0)}
        sizeRandom={1}
        explosiveness={0.6}
        color={'rgba(255,255,255,0) 0%, rgba(255,255,255,1) 20%, rgba(255,255,255,1) 80%, rgba(255,255,255,0) 100%'}
        size={'size(3) 0%, size(3) 100%'}
        rotationRandom={5}
        driftAmount={0}
        driftSpeed={0}
        alphaMap={t}
        bind:start
        bind:stop
        on:stateChanged={stateChanged}
    />
{/await}

<T.Mesh position.y={2}>
    <T.SphereGeometry />
    <T.ShaderMaterial bind:ref={sm} {fragmentShader} {vertexShader} uniforms={{ u_time: { value: 6 } }} uniforms.u_time.value={time} />
</T.Mesh>

<T.Mesh let:ref bind:ref={box} scale={[1, 1, 1]} position={[4, 1, 1]}>
    <T.BoxGeometry />
    <T.MeshBasicMaterial wireframe visible={false} />
    <TransformControls
        object={ref}
        on:mouseUp={() => {
            updatePos(box)
        }}
    />
</T.Mesh>

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
