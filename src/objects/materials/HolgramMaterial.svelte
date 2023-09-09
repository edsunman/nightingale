<script>
    import { ShaderMaterial, TextureLoader, RepeatWrapping, SRGBColorSpace } from 'three'
    import { T, useFrame } from '@threlte/core'

    const texture = new TextureLoader().load('/texture/toy.png')
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.colorSpace = SRGBColorSpace

    export let opacity = 1
    export let dotSize = 50

    export const material = new ShaderMaterial({
        uniforms: { texture1: { value: texture }, time: { value: 0 }, opacity: { value: opacity }, dotSize: { value: dotSize } },
        vertexShader: `
            varying vec2 vUv;
            #include <common>
            #include <skinning_pars_vertex>
			void main()	{
                #include <skinbase_vertex>
                #include <begin_vertex>
                #include <beginnormal_vertex>
                #include <defaultnormal_vertex>
                #include <skinning_vertex>
                #include <project_vertex>
				vUv = uv;
				//gl_Position = projectionMatrix * mvPosition * 5.0;
			}
        `,
        fragmentShader: `
            varying vec2 vUv;
            uniform sampler2D texture1;
            uniform float time;
            uniform float opacity;
            uniform float dotSize;



			void main()	{

                vec4 baseColor = vec4( 0.11, 0.91, 0.91, opacity / 4. ); // transparent base color
				vec4 texColor =  vec4(0.11, 0.91, 0.91, opacity); // blue color
                vec2 uv = vUv;
                float offset = texture(texture1, uv * 5. + vec2(time * 1. + sin(time) * .1, 0)).x;
                uv *= dotSize;
                uv += vec2(offset);
                vec3 dotColor = vec3(float(length(uv - round(uv)) < 0.3));
                vec4 dot4 = vec4(dotColor,1.0);
                gl_FragColor = mix( texColor, baseColor, 1.0-dotColor.r );

			}
        `,
        transparent: true,
        opacity: 0.5
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
