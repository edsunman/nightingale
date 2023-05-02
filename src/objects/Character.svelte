<script lang="ts">
    import { gameState, gamePosition, gameMessage, gameConversation, gameSelectedCharacterPosition } from '$lib/stores';
    import { T, useFrame } from '@threlte/core';
    import { useGltf, useGltfAnimations } from '@threlte/extras';
    import { Vector3, Matrix4, Euler, Quaternion, Group } from 'three';

    export const ref = new Group();
    export let position = { x: 1, y:0 , z:1};
    let x = Math.random() * 10

    export let url : string;
    export let characterId : number;

    const gltf = useGltf(url, { useDraco: true });
    export const { actions, mixer } = useGltfAnimations(gltf, ref);

    let currentActionKey = "idle";
    let rotation = 2;
    let armature : any;
    let spinning = false;

    const endRotation = new Quaternion().setFromEuler( new Euler( 0, 0, 0 ) );
    const rotationMatrix = new Matrix4();
    
    const currentPosition = new Vector3(position.x,0,position.z);


    $: $actions[currentActionKey]?.play();

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

    useFrame((state, delta) => {

        if ($gltf){
            
            armature.quaternion.rotateTowards( endRotation, delta*10 );
            if (endRotation.equals(armature.quaternion)&&spinning) {
                
                transitionTo("idle")
                spinning = false;
                
            }
        }

        rotation += delta
    })

    function clicked(e : any){

        const player = $gamePosition;

        if($gameConversation[0]===0) {

            if((player.x >= position.x-1 && player.x <= position.x+1)&&(player.z >= position.z-1 && player.z <= position.z+1)) {
                
                const lookAtVector = new Vector3(player.x,0,player.z);
                rotationMatrix.lookAt(lookAtVector,currentPosition,new Vector3(0,1,0));          
                endRotation.setFromRotationMatrix( rotationMatrix );

                if(!endRotation.equals(armature.quaternion)){
                    spinning = true;
                    transitionTo("walk");
                }

                $gameSelectedCharacterPosition = position
                $gameState.moveLock = true;
                $gameConversation = [characterId,1]
               // $gameState.dialogueOptions = true;

            } else {

                $gameMessage = 'A purple character'

            }
        }
    }
    
</script>

<T is={ref} position={[position.x,position.y,position.z]} name="purple" dispose={false} {...$$restProps}>
  {#if $gltf}
    <T.Group name="Scene" >
      <T.Group name="Armature" bind:ref={armature} scale={0.01}  >
        <T is={$gltf.nodes.mixamorigHips} />
        <T.SkinnedMesh castShadow
          name="Beta_Joints"
          geometry={$gltf.nodes.Beta_Joints.geometry}
          material={$gltf.materials['Beta_Joints_MAT.002']}
          skeleton={$gltf.nodes.Beta_Joints.skeleton}
        />
        <T.SkinnedMesh castShadow
          name="Beta_Surface"
          geometry={$gltf.nodes.Beta_Surface.geometry}
          material={$gltf.materials['asdf1:Beta_HighLimbsGeoSG2.001']}
          skeleton={$gltf.nodes.Beta_Surface.skeleton}
        />
      </T.Group>
    </T.Group>
  {/if}

  <slot {ref} />
</T>
<T.Mesh position={[position.x,position.y+0.75,position.z]} name="collision box" visible={false}
    on:click={(e) => {e.stopPropagation();clicked(e);}}  >
    <T.BoxGeometry args={[0.5, 1.5, 0.5]} />
    <T.MeshStandardMaterial color="hotpink" />
</T.Mesh>