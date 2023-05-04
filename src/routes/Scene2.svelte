<script lang="ts">
   
    import { T, useFrame } from '@threlte/core';

    import Floor from './Floor.svelte'
    import Door from '../objects/Door.svelte';

    const avoidArray :  Array<{ x: number, z: number }> = [];

    useFrame((state, delta) => {
     
    })

</script>  

<Floor levelSize={{x:20,z:10}} avoidArray={avoidArray} startingPosition={{x: 9, y:0, z:1}} startingRotation={{x: 0, y:0, z:1}} />

<T.Mesh position={[0.5, -0.01, 0.5]} visible={true} name="ground" receiveShadow  > 
  <T.BoxGeometry  args={[20, 0.01, 10]}   />
   <T.MeshStandardMaterial color="green" />
</T.Mesh>


<T.AmbientLight  intensity={0.2} />


<Door position={[10.5,1,1]} rotation.y={1.57} activeSquare={{x:10,z:1}} scene={1}/>


