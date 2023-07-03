<script lang="ts">
    import { T  } from '@threlte/core'
	import { RepeatWrapping, sRGBEncoding } from 'three'
    import { Audio } from '@threlte/extras'
	
    import Floor from './Floor.svelte';
    import Character from '../objects/Character.svelte'
    import Rocks from '../objects/Rocks.svelte'
    import Door from '../objects/Door.svelte'
    import Spaceship from '../objects/Spaceship.svelte'
    import Wind from '../objects/effects/Wind.svelte'
    import Object from '../objects/Object.svelte'
    import Objects from '../objects/Objects.svelte'
    import Sparkes from '../objects/effects/Sparkes.svelte'

    const wrap = RepeatWrapping

    const avoidArray :  Array<{ x: number, z: number }> = [{x:5,z:-3},{x:-2,z:15},{x:-16,z:-16}]

</script>  


<Wind />


<Floor avoidArray={avoidArray} startingPosition={{x: 15, z:-14}} startingRotation={{x: 14, z:2}} levelSize={{x:50, z:50}} />

<T.Mesh position={[0.5, -0.01, 0.5]} visible={true} name="ground" receiveShadow  > 
  <T.BoxGeometry  args={[75, 0.01, 75]}   />
     <T.MeshStandardMaterial color="#c97841" />
</T.Mesh>

<Door position={[-24.5,1,7]} rotation.y={1.57} activeSquare={{x:-24,z:7}} scene={2} message="A door" />
<Door position={[-2.5,1,14]} rotation.y={1.57} activeSquare={{x:-2,z:14}} scene={3} message="A door" key={102} />

<Character 
    message="A hologram flickers through the dust"
    position={{ x: 11, y:0 , z:-11}}
    url={'/hologram-transformed.glb'}
    characterId={1}
    rotation={1.5708}
    currentActionKey={"idle"}
    beforeDialogueActionKey={"wave"}
    isHologram={true}
    lookatPlayer={true}
/>
<Character 
    message="A soldier"
    position={{ x: 5, y:0 , z:-3}}
    url={'/hologram-transformed.glb?v=2'}
    characterId={2}
    rotation={1.5708}
    currentActionKey={"idle"}
/>
<Character 
    message="An elderly woman"
    position={{ x: -16, y:0 , z:-16}}
    url={'/hologram-transformed.glb?v=3'}
    characterId={3}
    currentActionKey={"idle"}
/>
<Character 
    message="A soldier guards the door"
    position={{ x: -2, y:0 , z:15}}
    url={'/hologram-transformed.glb?v=4'}
    characterId={4}
    rotation={1.5708}
    currentActionKey={"idle"}
    lookatPlayerWhenTalking={false}
/>

<Object url={'/tech_landing_pad-transformed.glb'} scale={[4.9,5.2,5.4]} position={[14,-0.05,-17.5]} rotation.y={1.57} />
<Object url={'/tech_holo_pad-transformed.glb'} scale={0.4} position={[11,0,-11]} rotation.y={-1.57} />
<Sparkes position={[11,0,-11]} />
<Objects
    url={'/tech_crate-transformed.glb'}
    scale={[0.5, 0.5, 0.5]}
    instances={[
        { position: [9, 0.4, -10], rotation: [0, 1, 0] },
        { position: [8, 0.4, -11.5], rotation: [0, 1.57, 0] }
    ]}
/>

<Rocks />
<Spaceship position={[12, 2 , -17.5]} scale={1.8} rotation.y={0}/>

<T.AmbientLight  intensity={0.1} />

<Audio src={'/wind.ogg'}  on:create={({ ref })=>{}} autoplay={true} loop={true} volume={1}/>


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
