<script lang="ts">
import { gameState } from '$lib/stores';
    import Scene from './Scene.svelte';
    import Stats from 'three/examples/jsm/libs/stats.module';
    import { T, useFrame } from '@threlte/core';
    import { onMount } from 'svelte';
    import { interactivity, OrbitControls  } from '@threlte/extras';

    interactivity()

    const stats = new Stats()   

    useFrame((state, delta) => {
       // console.log(state)
        stats.update()
    })

    onMount(async () => {
        document.body.appendChild(stats.dom);
    })

</script>


<Scene />


{#if $gameState.dev.camera}

    <T.PerspectiveCamera makeDefault position={[5, 5, 5]}  on:create={({ ref }) => { ref.lookAt(0, 1, 0) }} >
        <OrbitControls enablePan />
    </T.PerspectiveCamera>

{/if}