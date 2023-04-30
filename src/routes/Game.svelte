<script lang="ts">
import { gameState } from '$lib/stores';
    import Scene1 from './Scene1.svelte';
    import Scene2 from './Scene2.svelte';
    import Stats from 'three/examples/jsm/libs/stats.module';
    import { T, useFrame, useThrelte, useRender  } from '@threlte/core';
    import { onMount } from 'svelte';
    import { interactivity, OrbitControls  } from '@threlte/extras';
    import {
    BlendFunction,
    EffectComposer,
    EffectPass,
    RenderPass,
    OutlineEffect,
    SMAAEffect,
    FXAAEffect,
    BloomEffect,
    KernelSize
  } from 'postprocessing';

    interactivity();

    const stats = new Stats();

    const { scene, renderer, camera } = useThrelte();

    //renderer?.setPixelRatio(2);
    //console.log(renderer?.getPixelRatio())



    const composer = new EffectComposer(renderer);

    const smaaEffect = new SMAAEffect();

    const fxaaEffect = new FXAAEffect();

   

    //$: selectObject($selectedObject, $camera)
    
  

    const setupEffectComposer = (camera : any, object: any) => {

         const outlineEffect = new OutlineEffect(scene, $camera, {
            
			blendFunction: BlendFunction.SCREEN,
			edgeStrength: 2.5,
			pulseSpeed: 0.5,
			visibleEdgeColor: 0xffffff,
			hiddenEdgeColor: 0x22090a,
			height: 480,
			blur: false,
			xRay: false
		});

        if(object.isMesh){
                    outlineEffect.selection.add(object)
               // console.log(outlineEffect)
        }

        composer.removeAllPasses()
        composer.addPass(new RenderPass(scene, camera))


/*
       composer.addPass(
            new EffectPass(
                camera,
                outlineEffect
            )
        ) 


        composer.addPass(
            new EffectPass(
                camera,
                fxaaEffect
            )
        )  
 
       /*   
    composer.addPass(
            new EffectPass(
                camera,
                new BloomEffect({
                intensity: 1,
                luminanceThreshold: 0.15,
                height: 512,
                width: 512,
                luminanceSmoothing: 0.08,
                mipmapBlur: true,
                kernelSize: KernelSize.MEDIUM
                })
            )
        )   */
    }

    //$: setupEffectComposer($camera,$selectedObject)

    
  //  useRender((_, delta) => {
  //      composer.render(delta)
   // })

    useFrame((state, delta) => {
       // console.log(state)
        stats.update()
    })

    onMount(async () => {
        document.body.appendChild(stats.dom);
        console.log(composer)
    })

</script>

{#if $gameState.scene === 1}
    <Scene1 />
{:else if $gameState.scene === 2}
    <Scene2 />
{/if}



{#if $gameState.dev.camera}

    <T.PerspectiveCamera makeDefault position={[5, 5, 5]}  on:create={({ ref }) => { ref.lookAt(0, 1, 0) }} >
        <OrbitControls enablePan />
    </T.PerspectiveCamera>

{/if}