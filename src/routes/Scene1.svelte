<script lang="ts">
    import { T  } from '@threlte/core'
    import { useTexture } from '@threlte/extras'
	import { RepeatWrapping, sRGBEncoding } from 'three'
    import { Audio } from '@threlte/extras'
	
    import Floor from './Floor.svelte';
    import Character from '../objects/Character.svelte'
    import Rocks from '../objects/Rocks.svelte'
    import Door from '../objects/Door.svelte'
    import Ship from '../objects/Ship.svelte'

    const wrap = RepeatWrapping

    const avoidArray :  Array<{ x: number, z: number }> =
        [{x: -9, z:-13 },{x: 8, z:2 }]

</script>  

<Floor avoidArray={avoidArray} startingPosition={{x: 14, z:-1}} startingRotation={{x: 14, z:2}} levelSize={{x:50, z:50}} />

<T.Mesh position={[0.5, -0.01, 0.5]} visible={true} name="ground" receiveShadow  > 
  <T.BoxGeometry  args={[75, 0.01, 75]}   />
     <T.MeshStandardMaterial color="#d5783a" />
</T.Mesh>
<!--
<T.Mesh position={[0, 0.02, 2]} rotation.x={-1.5708} visible={true} name="cracks" receiveShadow  > 
<T.PlaneGeometry  args={[6, 6]}   />
 {#await useTexture('/desert-cracks.png') then texture}
        <T.MeshStandardMaterial transparent={true} opacity={0.4}>
            <T is={texture} attach="map" anisotropy={16} encoding={sRGBEncoding} />
        </T.MeshStandardMaterial>
    {/await}
</T.Mesh>
-->
<Door position={[-6.5,1,3]} rotation.y={1.57} activeSquare={{x:-6,z:3}} scene={2} message="A door" />
<Ship position={[14, 2 , -6]} scale={1.6} rotation.y={1.3}/>
<Rocks />
<!---
<Character
    message="A large man guards the door"
    position={{ x: -9, y:0 , z:-13}}
    url={'/blue-transformed.glb'}
    characterId={2}
/>
-->
<Character 
    message="A hologram flickers through the dust"
    position={{ x: 8, y:0 , z:-1}}
    url={'/hologram-transformed.glb'}
    characterId={1}
    rotation={1.5708}
    currentActionKey={"idle"}
    occasionalActionKey={"wave"}
    isHologram={true}
/>

<Character 
    message="A hologram flickers through the dust"
    position={{ x: 8, y:0 , z:2}}
    url={'/hologram-transformed.glb?v=2'}
    characterId={1}
    rotation={1.5708}
    currentActionKey={"idle"}
/>

<T.PointLight position={[-4,1,4]} distance={4} color={"#ff80ed"} intensity={5} />

<T.AmbientLight  intensity={0.1} />


<Audio src={'/wind.ogg'}  on:create={({ ref })=>{}} autoplay={true} loop={true} volume={1}/>


