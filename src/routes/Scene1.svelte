<script lang="ts">
   
    import { T, useFrame } from '@threlte/core';

	import { spring } from 'svelte/motion';

    import Floor from './Floor.svelte'

    let scale =  spring(1)

    let rotation = 0;

    const startingPosition = {x: 0, y: 0, z: 0}

    const avoidArray :  Array<{ x: number, z: number }> =
        [{x: 2, z:2 },{x: 2, z:3 },{x: 2, z:4 },{x: -6, z:-4 },{x: -5, z:-5 },{x: -4, z:-6 },{x: 5, z:3 },{x: 6, z:2 },{x: 7, z:1 },
        {x:-5,z:-4},{x:-4,z:-5},{x:5,z:-14}];

    useFrame((state, delta) => {
        rotation += delta
    })

</script>  

<Floor avoidArray={avoidArray} startingPosition={startingPosition} />

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





