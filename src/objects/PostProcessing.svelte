<script lang="ts">
    import { gameOutlineObjects, gameState } from '$lib/stores'
    import { useThrelte, useRender } from '@threlte/core'
    import { EffectComposer, EffectPass, RenderPass, BloomEffect, OutlineEffect, BlendFunction, Selection } from 'postprocessing'
    import { HalfFloatType } from 'three'

    const { renderer, scene, size, camera } = useThrelte()
    const composer = new EffectComposer(renderer, { multisampling: 4, frameBufferType: HalfFloatType })
    const outlineSelection = new Selection()

    let bloomEffect: any
    let outlineEffect: any

    const setupEffects = (camera: any) => {
        outlineEffect = new OutlineEffect(scene, camera, {
            blendFunction: BlendFunction.ALPHA,
            edgeStrength: 100,
            pulseSpeed: 1.0,
            visibleEdgeColor: 0xffffff,
            hiddenEdgeColor: 0xffffff,
            xRay: false,
            blur: true,
            resolutionScale: 0.8
        })

        bloomEffect = new BloomEffect({
            intensity: 1,
            luminanceThreshold: 1,
            radius: 0.5
        })
    }

    const setupEffectComposer = (camera: any, meshToOutline?: any) => {
        composer.removeAllPasses()
        composer.addPass(new RenderPass(scene, camera))
        composer.addPass(new EffectPass(camera, bloomEffect))

        if (meshToOutline !== undefined) {
            outlineSelection.set(meshToOutline)
        } else {
            outlineSelection.clear()
        }
        outlineEffect.selection = outlineSelection

        composer.addPass(new EffectPass(camera, outlineEffect))
    }

    $: composer.setSize($size.width, $size.height)
    $: {
        setupEffects($camera)
        setupEffectComposer($camera)
    }

    const outlineObjectsChanged = (gol: any) => {
        if (!$gameState.moveLock) {
            setupEffectComposer($camera, gol)
        }
    }

    $: outlineObjectsChanged($gameOutlineObjects)

    useRender((_, delta) => {
        composer.render(delta)
    })
</script>
