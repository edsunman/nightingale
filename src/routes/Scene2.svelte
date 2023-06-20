<script lang="ts">
   
    import { T, useFrame } from '@threlte/core'
    import Floor from './Floor.svelte'
    import Door from '../objects/Door.svelte'
    import { PositionalAudio } from '@threlte/extras'
	import { onMount } from 'svelte';
	import Item from '../objects/Item.svelte';

    const avoidArray :  Array<{ x: number, z: number }> = []

    let audio : any

    onMount(()=>{
        //console.log(audio)
    })

</script>  

<Floor
    levelSize={{x:20,z:10}}
    avoidArray={avoidArray}
    startingPosition={{x: 9, z:1}}
    startingRotation={{x: 0, z:0}}
    floorType="stone"
    sunIntensity={0.7}
/>

<T.Mesh position={[0.5, -0.01, 0.5]} visible={true} name="ground" receiveShadow  > 
  <T.BoxGeometry  args={[20, 0.01, 10]}   />
   <T.MeshStandardMaterial color="#595550" />
</T.Mesh>
<!--
<T.AmbientLight  intensity={0.2} />
-->
<T.PointLight position={[-4,1,4]} distance={4} color={"#ff80ed"} intensity={5} />
<Door position={[10.5,1,1]} rotation.y={1.57} activeSquare={{x:10,z:1}} scene={1} nextScenePosition={{x:-5,z:3}}/>

<Item id={1} position={{x:5,y:0.5,z:5}}/>

 <PositionalAudio
    autoplay
    loop
    refDistance={3}
    volume={0.1}
    src={'/music.mp3'}
    position={[0,0,0]}
    bind:ref={audio}
/>

