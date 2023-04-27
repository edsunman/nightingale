<script lang="ts">
    import { gameState, selectedObject } from '$lib/stores';
	import { GLTF, useGltfAnimations } from '@threlte/extras'
    import { T, useFrame } from '@threlte/core';
    import * as THREE from 'three';

    let position = { x: 3, y:0 , z:-2};

	let currentActionKey = "idle"


    export let { gltf, actions } = useGltfAnimations();

    $: $actions[currentActionKey]?.play();

    $: transitionTo(currentActionKey);

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

    function clicked(e : any){
        console.log(e)
        e.stopPropagation()
    }

	
</script>

<GLTF bind:gltf={$gltf} position={[position.x,position.y,position.z]} url="/purple.glb" on:create={(ref) => loaded(ref)}  

  on:pointerover={(e) => {
        $selectedObject = e.eventObject;
    }} 
    on:pointerout={(e) => {
        $selectedObject = {};
    }} 
/>

<T.Mesh castShadow name="collision box" visible={false} on:click={(e) => {clicked(e)}}  position={[position.x,position.y+0.7,position.z]} >
  <T.BoxGeometry args={[0.5, 2, 0.5]} />
  <T.MeshStandardMaterial color="hotpink" />
</T.Mesh>

<T.PointLight position={[position.x+1,position.y+2,position.z+1]} distance={4} color={"#ffffff"} intensity={5} />
