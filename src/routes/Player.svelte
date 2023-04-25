<script lang="ts">
    import { gameState } from '$lib/stores';
	import { GLTF, useGltfAnimations } from '@threlte/extras'
    import { T, useFrame } from '@threlte/core';
    import * as THREE from 'three';

    import type { PlayerState } from '$lib/types';

    export let playerState : PlayerState;  

	let currentActionKey = playerState.annimation
    let lightTarget : any;

    const endRotation = new THREE.Quaternion().setFromEuler( new THREE.Euler( 0, 0, 0 ) )
    const rotationMatrix = new THREE.Matrix4();
    let movementVector = new THREE.Vector3();
    let deltaSpeed = 0.015;

    export let { gltf, actions } = useGltfAnimations();

    $: $actions[playerState.annimation]?.play();

    $: transitionTo(playerState.annimation);

    function transitionTo(nextActionKey: string, duration = 0.2) {

        const currentAction = $actions[currentActionKey]  ;     
        const nextAction = $actions[nextActionKey];
       
        if (!nextAction || currentAction === nextAction) return;
        
        nextAction.enabled = true;

        if (currentAction) {
            currentAction.crossFadeTo(nextAction, duration, true)
        }

        nextAction.play()
        currentActionKey = nextActionKey
    }

    function loaded(ref: any) {
        ref.ref.traverse( function ( object : any  ) { object.castShadow = true; object.receiveShadow = false; } );
    }

    useFrame((state, delta) => { // player movement

        const p = playerState.position
        const path = playerState.path
       
        if(path.length > 0){ 

            const radians = Math.atan2( path[0].z-p.z,  path[0].x - p.x);
            const modifier = {x : Math.cos(radians), z : Math.sin(radians)}

            if((p.x < path[0].x+0.04 && p.x > path[0].x-0.04)&&
                (p.z < path[0].z+0.04 && p.z > path[0].z-0.04)
            ){            
                // dont need to move so snap to grid
                playerState.position.z = path[0].z;
                playerState.position.x = path[0].x;

                //if($gltf){                    
                //    $gltf.scene.position.set(path[0].x,0,path[0].z)
                //}
                
                playerState.settingOff = true;
                playerState.arrived = false;
                playerState.path.shift();

            } else { // get moving 
               
                //console.log(v)
                //console.log(v)

                if(playerState.settingOff){
                    
                    deltaSpeed = delta;
                    const v = new THREE.Vector3(path[0].x,0,path[0].z );
                    const pv = new THREE.Vector3(p.x,0,p.z);
                    const u = new THREE.Vector3(0,1,0);
                   
                    rotationMatrix.lookAt(v,pv,u);          
				    endRotation.setFromRotationMatrix( rotationMatrix );
                   
                    movementVector = v.sub(pv).normalize();
                    console.log(movementVector)
                    movementVector
                }
                playerState.settingOff = false;

                if($gltf){ // check it has loaded
                //console.log($gltf.scene)
                   $gltf.scene.children[0].quaternion.rotateTowards( endRotation, delta*10 );
                    
                 //  $gltf.scene.translateOnAxis(movementVector,playerSpeed);
                 //  playerState.position.x = $gltf.scene.position.x;
                 //  playerState.position.z = $gltf.scene.position.z;

                }

                playerState.position.x = p.x+modifier.x*deltaSpeed*4
                playerState.position.z = p.z+ modifier.z*deltaSpeed*4
                playerState.annimation = 'run';
            }
        } else {
            if(!playerState.arrived) {
                playerState.annimation = 'idle';
            }
            playerState.arrived = true;
        }

        $gameState.position = playerState.position;
        
    })
	
</script>

<GLTF bind:gltf={$gltf} on:create={(ref) => loaded(ref)} 
   position.x={playerState.position.x}
    position.y={playerState.position.y}
    position.z={playerState.position.z}
    url="/green.glb"
/>

<!--  -->
{#if !$gameState.dev.camera}
 <T.OrthographicCamera name="main camera" makeDefault 
    position={[playerState.position.x+9,playerState.position.y+9,playerState.position.z+9]}    
    on:create={({ ref }) => { ref.lookAt(playerState.position.x+8,playerState.position.y+8,playerState.position.z+8) }}
    zoom={80}
 />
{/if}
<T.DirectionalLight name="sun" intensity={0.8} castShadow 
    on:create={(ref) => {
        ref.ref.shadow.mapSize.width = 2000;
        ref.ref.shadow.mapSize.height = 2000;
        ref.ref.shadow.camera.top = 8;
        ref.ref.shadow.camera.right = 4;
        ref.ref.shadow.camera.left = -14;
        ref.ref.shadow.camera.bottom = -6;
    }}
    position={[playerState.position.x+9,playerState.position.y+10,playerState.position.z+10]} 
    target={lightTarget} 
/>

<T.Mesh visible={false} bind:ref={lightTarget} scale={[1,1,1]} position={[playerState.position.x+8,playerState.position.y+8,playerState.position.z+8]}>
    <T.BoxGeometry args={[1, 0.1, 1]} />
</T.Mesh>
    

<T.Mesh receiveShadow visible={true} scale={[1,1,1]} position={[playerState.position.x, playerState.position.y, playerState.position.z]}>
    <T.BoxGeometry args={[1, 0.1, 1]} />
    <T.MeshStandardMaterial color="#9932CC" />
</T.Mesh>


