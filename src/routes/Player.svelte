<script lang="ts">
    import { gameState, gamePosition } from '$lib/stores';
	import { GLTF, useGltfAnimations } from '@threlte/extras'
    import { T, useFrame } from '@threlte/core';
    import { Vector3, Matrix4, Euler, Quaternion } from 'three';

    import type { PlayerState } from '$lib/types';

    export let playerState : PlayerState;  

	let currentActionKey = playerState.annimation
    let lightTarget : any;

    const endRotation = new Quaternion().setFromEuler( new Euler( 0, 0, 0 ) )
    const rotationMatrix = new Matrix4();
    let movementVector = new Vector3();

    export let { gltf, actions } = useGltfAnimations();

    $: $actions[playerState.annimation]?.play();

    //$: transitionTo(playerState.annimation);

    function transitionTo(nextActionKey: string, duration = 0.2) {

        const currentAction = $actions[currentActionKey]  ;     
        const nextAction = $actions[nextActionKey];
        //console.log('current => '+currentActionKey)
        //console.log('next => '+nextActionKey)
       
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

                if(playerState.settingOff){
                    
                    const v = new Vector3(path[0].x,0,path[0].z );
                    const pv = new Vector3(p.x,0,p.z);
                    
                   
                    rotationMatrix.lookAt(v,pv,new Vector3(0,1,0));          
				    endRotation.setFromRotationMatrix( rotationMatrix );
                   
                    movementVector = v.sub(pv).normalize();
                    
                    movementVector
                }
                playerState.settingOff = false;

                if($gltf){ // check it has loaded

                   $gltf.scene.children[0].quaternion.rotateTowards( endRotation, delta*10 );
                    
                 //  $gltf.scene.translateOnAxis(movementVector,playerSpeed);
                 //  playerState.position.x = $gltf.scene.position.x;
                 //  playerState.position.z = $gltf.scene.position.z;

                }

                if(delta<0.5){ // check for one off spikes caused by switching tabs etc
                    playerState.position.x = p.x+modifier.x*delta*4
                    playerState.position.z = p.z+ modifier.z*delta*4
                }

                transitionTo('run');

            }

        } else {

            if(!playerState.arrived) {
                transitionTo('idle');
            }

            playerState.arrived = true;
        }

        $gamePosition = playerState.position;
        
    })
	
</script>

<GLTF
    bind:gltf={$gltf}
    on:create={(ref) => loaded(ref)} 
    position.x={playerState.position.x}
    position.y={playerState.position.y}
    position.z={playerState.position.z}
    url="/green.glb"
/>

<!--  -->
{#if !$gameState.dev.camera}
    <T.OrthographicCamera name="main camera"
        makeDefault
        position={[playerState.position.x+9,playerState.position.y+10,playerState.position.z+9]}    
        on:create={({ ref }) => { ref.lookAt(playerState.position.x+8,playerState.position.y+9,playerState.position.z+8) }}
        zoom={80}
    />
{/if}

<T.DirectionalLight name="sun"
    intensity={0.8} castShadow 
    shadow.mapSize.width={1500}
    shadow.mapSize.height={1500}
    shadow.camera.top={9}
    shadow.camera.right={4}
    shadow.camera.left={-14}
    shadow.camera.bottom={-6}
    position={[playerState.position.x+9,playerState.position.y+10,playerState.position.z+10]} 
    target={lightTarget} 
/>

<T.Mesh
    bind:ref={lightTarget}
    visible={false}   
    scale={[1,1,1]}
    position={[playerState.position.x+8,playerState.position.y+8,playerState.position.z+8]}>
</T.Mesh>
    

<T.Mesh name="player grid square"
    receiveShadow
    visible={false}
    scale={[1,1,1]}
    position={[playerState.position.x, playerState.position.y, playerState.position.z]}
>
    <T.BoxGeometry args={[1, 0.1, 1]} />
    <T.MeshStandardMaterial color="#9932CC" />
</T.Mesh>


