  /*
  
    const composer = new EffectComposer(renderer);
    const smaaEffect = new SMAAEffect();
    const fxaaEffect = new FXAAEffect();
  
  
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
        )  
    }
 */
    //$: setupEffectComposer($camera,$selectedObject)

    
  //  useRender((_, delta) => {
  //      composer.render(delta)
   // })