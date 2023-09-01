<script lang="ts">
    import { T } from '@threlte/core'
    import { ShaderMaterial, Color, Vector2 } from 'three'
    import { fragmentShader } from './fragment'
    import { vertexShader } from './vertex'

    import type { ColorRepresentation } from 'three'

    let ref: any

    export let opacity: number = 1
    export let color: ColorRepresentation = '#ffffff'
    export let dashOffset: number = 0
    export let dashArray: number = 0
    export let dashRatio: number = 0.5
    export let attenuate: boolean = false
    export let width: number = 1
    export let scaleOut: number = 0

    const material = new ShaderMaterial({
        uniforms: {
            lineWidth: { value: width },
            color: { value: new Color(color).convertLinearToSRGB() },
            opacity: { value: opacity },
            resolution: { value: new Vector2(1, 1) },
            sizeAttenuation: { value: attenuate ? 0 : 1 },
            dashArray: { value: dashArray },
            dashOffset: { value: dashOffset },
            dashRatio: { value: dashRatio },
            useDash: { value: dashArray > 0 ? 1 : 0 },
            scaleOut: { value: scaleOut },
            alphaTest: { value: 0 },
        }
    })

    $: {
        material.uniforms.dashOffset.value = dashOffset
    }

    $: {
        material.uniforms.lineWidth.value = width
    }

    $: {
        material.uniforms.opacity.value = opacity
    }
</script>

<T is={material} {...$$restProps} {fragmentShader} {vertexShader} />
