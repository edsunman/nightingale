<script lang="ts">
    import { gameState } from '$lib/stores';
    import { T, useFrame } from '@threlte/core';
	import { spring } from 'svelte/motion';
    import { HTML } from '@threlte/extras'
    import { fade } from 'svelte/transition';
    import Floor from './Floor.svelte';
	import Purple from '../objects/Purple.svelte';




    let scale =  spring(1)

    let rotation = 0;

    const startingPosition = {x: 9, y: 0, z: 7}

    const avoidArray :  Array<{ x: number, z: number }> =
        [{x: 2, z:2 },{x: 2, z:3 },{x: 2, z:4 },{x: -6, z:-4 },{x: -5, z:-5 },{x: -4, z:-6 },{x: 5, z:3 },{x: 6, z:2 },{x: 7, z:1 },
        {x:-5,z:-4},{x:-4,z:-5},{x:5,z:-14},{x:3,z:-2}];

    useFrame((state, delta) => {
        rotation += delta
    })

</script>  

<Floor avoidArray={avoidArray} startingPosition={startingPosition} />

<T.Mesh position={[0.5, -0.01, 0.5]} visible={true} name="ground" receiveShadow > 
  <T.BoxGeometry  args={[36, 0.01, 36]}   />
  <T.MeshStandardMaterial color="#705f47" />
</T.Mesh>

<Purple />



<T.PointLight position={[-4,1,4]} distance={4} color={"#ff80ed"} intensity={5} />

<T.AmbientLight  intensity={0.2} />
<!-- pink spinny box -->
<T.Mesh  castShadow name="grow box" 
    scale={$scale}
    on:pointerenter={() => scale.set(1.5)}
    on:pointerleave={() => scale.set(1)}
    on:click={(e) => {;console.log(e);e.stopPropagation()}}
    position={[8,1,8]} rotation.y={rotation}>
  <T.BoxGeometry args={[1, 2, 1]} />
  <T.MeshStandardMaterial color="hotpink" />
</T.Mesh>

<T.Mesh
    castShadow
    name="spinny box"
    on:click={(e) => e.stopPropagation()}    
    position={[-2,1,-2]}
>
  <T.BoxGeometry args={[1, 2, 1]} />
  <T.MeshStandardMaterial color="hotpink" />
</T.Mesh>



{#if $gameState.inConvo}
    <HTML position={[3,2.7,-2]} center>
        <h3 transition:fade={{duration: 100}} class="text-neutral-100 bg-neutral-950 hidden md:block rounded-md px-3 py-2 select-none whitespace-nowrap">
           <small>Philomele:</small><br/>Why would you say that? So shocking...
        </h3>
    </HTML>
{/if}
