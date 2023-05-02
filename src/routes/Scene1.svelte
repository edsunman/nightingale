<script lang="ts">
    import { T, useFrame } from '@threlte/core';
	import { spring } from 'svelte/motion';
    import Floor from './Floor.svelte';
	import Purple from '../objects/Purple.svelte';
	import Blue from '../objects/Blue.svelte';


    let scale =  spring(1)

    let rotation = 0;

    let blue : any;
    let blue2 : any;

   

    const startingPosition = {x: 9, y: 0, z: 7};

    const avoidArray :  Array<{ x: number, z: number }> =
        [{x: 2, z:2 },{x: 2, z:3 },{x: 2, z:4 },{x: -6, z:-4 },{x: -5, z:-5 },{x: -4, z:-6 },{x: 5, z:3 },{x: 6, z:2 },{x: 7, z:1 },
        {x:-5,z:-4},{x:-4,z:-5},{x:5,z:-14},{x:3,z:-2},{x:4,z:-3}];

   /* for (let i = 0; i < 1000; i++) {

        avoidArray.push({x:10,z:7})
    } */

    useFrame((state, delta) => {
        rotation += delta
        // console.log(blue)
    })

</script>  

<Floor avoidArray={avoidArray} startingPosition={startingPosition} />

<T.Mesh position={[0.5, -0.01, 0.5]} visible={true} name="ground" receiveShadow > 
  <T.BoxGeometry  args={[36, 0.01, 36]}   />
  <T.MeshStandardMaterial color="#705f47" />
</T.Mesh>

<Purple position={{x: 4, y: 0, z: -3}} />

<Purple position={{x: 4, y: 0, z: 3}} />

<Blue name="blue" position={[ 7,  0,  -3]} />

<Blue name="blue 2" position={[ 9,  0,  -3]} />

<Blue name="blue 3" position={[ 11,  0,  -3]} />





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




