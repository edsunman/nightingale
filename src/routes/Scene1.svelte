<script lang="ts">
    import { gameMessage, gamePosition, gameScene } from '$lib/stores';
    import { T, useFrame } from '@threlte/core';
	import { spring } from 'svelte/motion';
    import { useTexture } from '@threlte/extras'
	import { RepeatWrapping, sRGBEncoding } from 'three';
	
    import Floor from './Floor.svelte';
    import Character from '../objects/Character.svelte';
    import Rock from '../objects/Rock.svelte';
    import Door from '../objects/Door.svelte';
    import Ship from '../objects/Ship.svelte';

    let scale =  spring(1)

    let rotation = 0;

    const wrap = RepeatWrapping;


    const avoidArray :  Array<{ x: number, z: number }> =
        [{x: 1, z:1 },{x: 5, z:1 }];

    useFrame((state, delta) => {
        rotation += delta
        // console.log(blue)
    })

    //injectPlugin(itemsPlugin)


</script>  

<Floor avoidArray={avoidArray} startingPosition={{x: 14, z:-1}} startingRotation={{x: 14, z:2}} />

<T.Mesh position={[0.5, -0.01, 0.5]} visible={true} name="ground" receiveShadow  > 
  <T.BoxGeometry  args={[128, 0.01, 128]}   />
   {#await useTexture('/desert-tile.png') then texture}
        <T.MeshLambertMaterial >
            <T is={texture} attach="map" repeat={6} wrapS={wrap} wrapT={wrap} encoding={sRGBEncoding} />
        </T.MeshLambertMaterial>
    {/await}
</T.Mesh>

<T.Mesh position={[0, 0.02, 2]} rotation.x={-1.5708} visible={true} name="cracks" receiveShadow  > 
<T.PlaneGeometry  args={[6, 6]}   />
 {#await useTexture('/desert-cracks.png') then texture}
        <T.MeshStandardMaterial transparent={true} opacity={0.4}>
            <T is={texture} attach="map" anisotropy={16} encoding={sRGBEncoding} />
        </T.MeshStandardMaterial>
    {/await}
</T.Mesh>


<Door position={[-6.5,1,3]} rotation.y={1.57} activeSquare={{x:-6,z:3}} scene={2} message="A door" />

<Ship position={[14, 2 , -6]} scale={1.6} rotation.y={1.3}/>


<Rock position={[-1,0,1]}  scale={0.4}/>

<Rock position={[-1.5,0,1]} rotation.x={-1.5708} rotation.z={1.6} scale={0.6}/>

<Ship position={[14, 2 , -6]} scale={1.6} rotation.y={1.3}/>


<!--
<T.Mesh position={[4, 2, 4]} visible={true} name="ball"  > 
<T.SphereGeometry  args={[1, 32, 16 ]}   />
<T.ShaderMaterial vertexShader={vShader} fragmentShader={fShader} uniforms={uniforms} />
</T.Mesh>
-->


<Character
    message="A blue character"
    position={{ x: 1, y:0 , z:1}}
    url={'/blue-transformed.glb'}
    characterId={2}
/>

<Character 
    message="A purple character"
    position={{ x: 5, y:0 , z:1}}
    url={'/purple-transformed.glb'}
    characterId={1}
/>
<!--
<T.PointLight position={[-4,1,4]} distance={4} color={"#ff80ed"} intensity={5} />
-->
<T.AmbientLight  intensity={0.1} />

<!-- pink spinny box 
<T.Mesh  castShadow name="grow box" 
    scale={$scale}
    on:pointerenter={() => scale.set(1.5)}
    on:pointerleave={() => scale.set(1)}
    on:click={(e) => {;console.log(e);e.stopPropagation()}}
    position={[8,1,8]} rotation.y={rotation}>
  <T.BoxGeometry args={[1, 2, 1]} />
  <T.MeshStandardMaterial color="hotpink" />
</T.Mesh>
-->



