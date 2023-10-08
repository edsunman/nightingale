<script>
    import { ShaderMaterial, TextureLoader, RepeatWrapping, SRGBColorSpace } from 'three'
    import { T, useFrame } from '@threlte/core'
    import fragmentShader from './hologram-fragment.glsl?raw'
    import vertexShader from './hologram-vertex.glsl?raw'

    const texture = new TextureLoader().load('/texture/toy.png')
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.colorSpace = SRGBColorSpace

    export let opacity = 1
    export let dotSize = 50

    export const material = new ShaderMaterial({
        uniforms: { texture1: { value: texture }, time: { value: 0 }, opacity: { value: opacity }, dotSize: { value: dotSize } },
        vertexShader,
        fragmentShader,
        transparent: true,
        opacity: 0.5,
        toneMapped: false
    })

    $: {
        material.uniforms.opacity.value = opacity
        material.uniforms.dotSize.value = opacity * dotSize
    }

    useFrame(() => {
        material.uniforms.time.value += 0.01
    })
</script>

<T is={material} />
