<script lang="ts">
	import { GLTF, useGltfAnimations } from '@threlte/extras'
    import { playerAnimation } from '$lib/stores';
	import { useFrame } from '@threlte/core';
	
    export let position : [number, number, number] = [1,1,1];
    export let rotation : number = 0;

	let currentActionKey = 'idle'
    //let ref:any;

    export let { gltf, actions  } = useGltfAnimations();

 

    $:$actions[$playerAnimation]?.play()
    //$: console.log($playerAnimation)

    $: transitionTo($playerAnimation)

  /*  useFrame((state, delta) => {

        console.log(delta)
    }) */

    function transitionTo(nextActionKey: string, duration = 0.2) {

        const currentAction = $actions[currentActionKey]
        
        const nextAction = $actions[nextActionKey]
       
        if (!nextAction || currentAction === nextAction) return
        // Function inspired by: https://github.com/mrdoob/three.js/blob/master/examples/webgl_animation_skinning_blending.html
        
        nextAction.enabled = true
        if (currentAction) {
        currentAction.crossFadeTo(nextAction, duration, true)
        }
        // Not sure why I need this but the source code does not
        nextAction.play()
        currentActionKey = nextActionKey
    }

    function loaded(ref: any) {
        ref.ref.traverse( function ( object : any  ) { object.castShadow = true; object.receiveShadow = false; } );
    }
	
</script>

<GLTF bind:gltf={$gltf} on:create={(ref) => loaded(ref)} position={position} rotation.y={rotation} url="/green.glb" />