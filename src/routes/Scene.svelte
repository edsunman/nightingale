<script lang="ts">

    import { T, useFrame, useThrelte } from '@threlte/core';
    import { interactivity, OrbitControls, Grid  } from '@threlte/extras';
    import Stats from 'three/examples/jsm/libs/stats.module';
    import { onMount } from 'svelte';
    import { cameraPosition, selectedGridSpace, playerPosition, playerAnimation, playerRotation } from '$lib/stores';
    import Character from './Character.svelte'
    import * as THREE from 'three';
	import { spring } from 'svelte/motion';
	import { flattenJSON } from 'three/src/animation/AnimationUtils';

    interactivity()

  

    const stats = new Stats()   

    let scale =  spring(1)

    let direction = new THREE.Vector3();

    export let cameraSwitch = true;

    let avoidArray :  Array<{ x: number, z: number }> =
        [{x: 2, z:2 },{x: 2, z:3 },{x: 2, z:4 },{x: -6, z:-4 },{x: -5, z:-5 },{x: -4, z:-6 },{x: 5, z:3 },{x: 6, z:2 },{x: 7, z:1 },
        {x:-5,z:-4},{x:-4,z:-5}];

    let avoidObjects : any[] = [];

    let positionArray : Array<{ x: number, z: number }> = [];
    //let positionArray : Array<{ x: number, z: number }> = [{x: 0, z:0 },{x: -2, z:5 },{x: -3, z:5 }];

    let pathArray : Array<{ x: number, z: number }> = [{x: -2, z:2 }];

    let rotation = 0;
    const playerSpeed = 4;

    let settingOff = true;
    let arrived = false;

    let player: any;
    let lightPosition = {x:3,y:7,z:7};

    const endRotation = new THREE.Quaternion().setFromEuler( new THREE.Euler( 0, 0, 0 ) )
    const rotationMatrix = new THREE.Matrix4();

    const raycaster = new THREE.Raycaster();

    let light : any;
    let lightTarget : any;


    useFrame((state, delta) => {

        stats.update()

        rotation += delta;      
       
        if(positionArray.length > 0){ // player movement

            const radians = Math.atan2( positionArray[0].z-$playerPosition.z,  positionArray[0].x - $playerPosition.x);

            const modifier = {x : Math.cos(radians), z : Math.sin(radians)}

            if(($playerPosition.x < positionArray[0].x+0.05 && $playerPosition.x > positionArray[0].x-0.05)&&
                ($playerPosition.z < positionArray[0].z+0.05 && $playerPosition.z > positionArray[0].z-0.05)
            ){
                
                // dont need to move so snap to grid
                $playerPosition.z = positionArray[0].z
                $playerPosition.x = positionArray[0].x

                settingOff = true;
                arrived = false;
                positionArray.shift()

            } else  {

                // get moving
                if(settingOff){

                    const v = new THREE.Vector3(positionArray[0].x,0,positionArray[0].z );
                    const p = new THREE.Vector3($playerPosition.x,0,$playerPosition.z)
                    const u = new THREE.Vector3(0,1,0)
                   
                    rotationMatrix.lookAt(v,p,u)                  
				    endRotation.setFromRotationMatrix( rotationMatrix );


                }

                settingOff = false;

                if($player){ // check it has loaded
                    $player.scene.children[0].quaternion.rotateTowards( endRotation, delta*10 )

                }

                
                

                $playerPosition.x += modifier.x*delta*playerSpeed
                $playerPosition.z += modifier.z*delta*playerSpeed
                $playerAnimation = 'run'

            }
        } else {

            if(!arrived) {
                //console.log('array now empty')
                $playerAnimation = 'idle'
            }

            arrived = true;
        }

        $cameraPosition.x = $playerPosition.x+9;
        $cameraPosition.z = $playerPosition.z+9;
        
       // lightPosition.x = $cameraPosition.x;
      //  lightPosition.z = $cameraPosition.z;

        //console.log(lightPosition)
    })


const { scene } = useThrelte()
    let cam : any;

    onMount(async () => {
        document.body.appendChild(stats.dom)

      //  const helper = new THREE.CameraHelper(cam);
    //    scene.add( helper ) 

      //  console.log(light)

      //  const helper3 = new THREE.DirectionalLightHelper( light );
     //   scene.add( helper3 );
    })

   
    

</script>  

{#if cameraSwitch}

    <T.PerspectiveCamera makeDefault position={[5, 5, 5]}  on:create={({ ref }) => { ref.lookAt(0, 1, 0) }} >
        <OrbitControls enablePan />
    </T.PerspectiveCamera>

{:else}

    <T.OrthographicCamera
        bind:ref={cam}
        makeDefault 
        position={[$cameraPosition.x,$cameraPosition.y,$cameraPosition.z]}    
        on:create={({ ref }) => { ref.lookAt($cameraPosition.x -1 , $cameraPosition.y -1, $cameraPosition.z -1) }}
        zoom={80}
    />

{/if}

{#each avoidArray as block}
    <T.Mesh name={"jimmy"} scale={[1,1,1]} visible={true} position={[block.x, 0, block.z]}  on:create={({ ref }) => { avoidObjects.push(ref) }}>
        <T.BoxGeometry args={[1, 0.1, 1]} />
        <T.MeshStandardMaterial color="#161616" />
    </T.Mesh>
{/each}

<T.Mesh visible={false} bind:ref={lightTarget} scale={[1,1,1]} position={[$cameraPosition.x-1,$cameraPosition.y-1,$cameraPosition.z-1]}>
        <T.BoxGeometry args={[1, 0.1, 1]} />
    </T.Mesh>

{#each pathArray as block}
    <T.Mesh scale={[1,1,1]} position={[block.x, 0, block.z]}>
        <T.BoxGeometry args={[1, 0.1, 1]} />
        <T.MeshStandardMaterial color="#1bd1aa" />
    </T.Mesh>
{/each}



<T.DirectionalLight intensity={0.8} castShadow bind:ref={light} on:create={(ref) => {
    //console.log(ref)

    ref.ref.shadow.mapSize.width = 2000;
    ref.ref.shadow.mapSize.height = 2000;
    ref.ref.shadow.camera.top = 8;
    ref.ref.shadow.camera.right = 4;
    ref.ref.shadow.camera.left = -14;
    ref.ref.shadow.camera.bottom = -6;
    //console.log(ref)

    }} position={[$cameraPosition.x,$cameraPosition.y+1,$cameraPosition.z+1]} 
    target={lightTarget}  />
 
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


<!-- floor -->
<T.Mesh position={[0.5, -0.01, 0.5]} name="floor" receiveShadow  on:click={(e) => {

    positionArray = [];

    if (e.intersections[0].eventObject.name==="floor"){

        const point = e.intersections[0].point;
        const grid = { x : Math.round(point.x), z : Math.round(point.z)}


        const gridVec = new THREE.Vector3(grid.x,0,grid.z );
        const playerVec = new THREE.Vector3($playerPosition.x, 0, $playerPosition.z);
        
        direction.subVectors(  gridVec, playerVec ).normalize();
        raycaster.set(playerVec, direction)

        const intersects = raycaster.intersectObjects( avoidObjects, false );
        const dist = Math.sqrt((grid.x - playerVec.x) ** 2 + (grid.z - playerVec.z) ** 2);
       
        if(intersects.length>0){ // pointing towards wall

            const ip = intersects[0].point;
            let gridIp = {x:0,z:0}

            if($playerPosition.x<ip.x){
                gridIp.x = Math.round(ip.x-0.5)
            } else if ($playerPosition.x>ip.x) {
                gridIp.x = Math.round(ip.x+0.5)
            } else {
                gridIp.x = Math.round(ip.x)
            }

            if($playerPosition.z<ip.z){
                gridIp.z = Math.round(ip.z-0.5)
            } else if ($playerPosition.z>ip.z) {
                gridIp.z = Math.round(ip.z+0.5)
            } else {
                 gridIp.z = Math.round(ip.z)
            }

            if( intersects[0].distance > dist ) {                               
                positionArray.push({ x: grid.x, z: grid.z });              
            } else {         
                positionArray.push({ x: gridIp.x, z: gridIp.z });
            }

        } else {               
            positionArray.push({ x: grid.x, z: grid.z });             
        }

         selectedGridSpace.set({ x: grid.x, y: 0, z: grid.z });
         settingOff = true;
         
    }
}} > 

  <T.BoxGeometry  args={[20, 0.01, 20]}   />
  <T.MeshStandardMaterial color="#705f47" />
</T.Mesh>

<Character bind:gltf={player} position={[$playerPosition.x, $playerPosition.y, $playerPosition.z]} rotation={$playerRotation} />

<!-- Selected grid square -->
<T.Mesh  receiveShadow visible={true}
    scale={[1,1,1]}
    position={[$selectedGridSpace.x, $selectedGridSpace.y, $selectedGridSpace.z]}>
  <T.BoxGeometry args={[1, 0.05, 1]} />
  <T.MeshStandardMaterial color="MediumSlateBlue" />
</T.Mesh>

<!-- Player grid square -->
<T.Mesh visible={false} scale={[1,1,1]} position={[$playerPosition.x, $playerPosition.y, $playerPosition.z]}>
   <T.BoxGeometry args={[1, 0.1, 1]} />
<T.MeshStandardMaterial color="#9932CC" />
</T.Mesh>

<Grid
    visible={false}
    position={[0.5,0.001,0.5]}
    cellColor="#ffffff"
    sectionColor="#ffffff"
    sectionThickness={0}
    fadeDistance={20}
    cellSize={1}
/>
