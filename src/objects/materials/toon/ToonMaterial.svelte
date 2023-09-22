<script>
    import { ShaderMaterial, TextureLoader, RepeatWrapping, SRGBColorSpace, UniformsLib } from 'three'
    import { T } from '@threlte/core'
    import fragmentShader from './toon-fragment.glsl?raw'
    import vertexShader from './toon-vertex.glsl?raw'

    const texture = new TextureLoader().load('/texture/playerAtlas.png')
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    // texture.colorSpace = SRGBColorSpace
    texture.flipY = false

    export const material = new ShaderMaterial({
        uniforms: { map: { value: texture }, ...UniformsLib.lights },
        vertexShader,
        fragmentShader,
        lights: false
    })

    $: {
        //material.uniforms.opacity.value = opacity
        //material.uniforms.dotSize.value = opacity * dotSize
    }
</script>

<T is={material} />
