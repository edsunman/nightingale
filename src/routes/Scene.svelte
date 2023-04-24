<script lang="ts">
    import { gameState } from '$lib/stores';
    import { T, useFrame } from '@threlte/core';
    import { interactivity, OrbitControls  } from '@threlte/extras';
    import Stats from 'three/examples/jsm/libs/stats.module';
    import { onMount } from 'svelte';
	import { spring } from 'svelte/motion';

    import Floor from './Floor.svelte'

    interactivity()

    const stats = new Stats()   

    let scale =  spring(1)

    let rotation = 0;

    useFrame((state, delta) => {

        stats.update()

        rotation += delta;           
    })


    onMount(async () => {
        document.body.appendChild(stats.dom);
    })


</script>  

<Floor />

{#if $gameState.devCamera}

    <T.PerspectiveCamera makeDefault position={[5, 5, 5]}  on:create={({ ref }) => { ref.lookAt(0, 1, 0) }} >
        <OrbitControls enablePan />
    </T.PerspectiveCamera>

{/if}


<T.PointLight position={[-4,1,4]} distance={4} color={"#ff80ed"} intensity={5} />

<T.AmbientLight  intensity={0.2} />
<!-- pink spinny box -->
<T.Mesh  castShadow name="grow box" 
    scale={$scale}
    on:pointerenter={() => scale.set(1.5)}
    on:pointerleave={() => scale.set(1)}
    on:click={(e) => {e.stopPropagation()}}
    position={[8,1,8]} rotation.y={rotation}>
  <T.BoxGeometry args={[1, 2, 1]} />
  <T.MeshStandardMaterial color="hotpink" />
</T.Mesh>

<T.Mesh castShadow name="spinny box" on:click={(e) => e.stopPropagation()}  position={[-2,1,-2]} rotation.y={rotation}>
  <T.BoxGeometry args={[1, 2, 1]} />
  <T.MeshStandardMaterial color="hotpink" />
</T.Mesh>





