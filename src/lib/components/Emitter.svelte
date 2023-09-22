<script lang="ts">
    import { T, useFrame, useThrelte } from '@threlte/core'
    import {
        BufferGeometry,
        Float32BufferAttribute,
        Vector3,
        AdditiveBlending,
        TextureLoader,
        type Texture,
        ShaderMaterial
    } from 'three'
    import { randomNumber } from '$lib/util'
    import { createEventDispatcher } from 'svelte'
    import { ramdomPointInsideCube, randomDirectionSpread, createGradientObject } from './util'
    import fragmentShader from './fragment.glsl?raw'
    import vertexShader from './vertex.glsl?raw'

    // Maybe rename to emmitterPosition and emmitterScale for clarity?
    export let position = new Vector3(0, 0, 0)
    export let scale = new Vector3(0, 0, 0)
    export let count = 10
    export let life = 2
    export let explosiveness = 0
    export let spread = 0
    export let direction = new Vector3(0, 1, 0)
    export let gravity = new Vector3(0, 0, 0)
    export let wind = new Vector3(0, 0, 0)
    export let velocity = 1
    export let velocityRandom = 0
    export let size = ''
    export let sizeRandom = 0
    export let color: string = ''
    export let colorRandom = 0
    export let rotation = 0
    export let rotationRandom = 0
    export let dampen = 0
    export let oneShot = false
    export let debug = false
    export let boundingSphereRadius = 5
    export let map: Texture | undefined = undefined

    let emitterLife = 0
    let state = ''
    let newPosition
    let paused = false
    let pausedTime: number
    let useMap = map ? 1 : 0
    let area = scale.x > 0 || scale.y > 0 || scale.z > 0 ? true : false
    let material: ShaderMaterial

    const positionAttributeArray: number[] = []
    const lifeAttributeArray: number[] = []
    const parsedColorGradient = createGradientObject(color, 16)
    const parsedSizeGradient = createGradientObject(size, 4)
    const dispatch = createEventDispatcher()
    const geometry = new BufferGeometry()

    export const start = () => {
        if (state !== 'finished') {
            console.warn('start() was called but the emitter is ' + state + ', not finished.')
            return
        }
        paused = false
        emitterLife = 0
    }

    export const stop = () => {
        if (oneShot) {
            console.warn('stop() has no effect when oneShot is set to true.')
            return
        }
        if (state !== 'running') {
            console.warn('stop() was called but the emitter is ' + state + ', not running.')
            return
        }
        paused = true
        pausedTime = emitterLife
    }

    const smokeTexture = new TextureLoader().load('/texture/smokeWhite.png')

    const particles: any = []

    const setupParticles = () => {
        for (let i = 0; i < count; i++) {
            const pDirection = new Vector3().copy(direction.normalize())
            if (spread > 0) pDirection.copy(randomDirectionSpread(pDirection, spread))
            // console.log(pDirection)
            const pVelocity =
                velocityRandom > 0 ? randomNumber(velocity - velocityRandom / 2, velocity + velocityRandom / 2) : velocity
            const pSize = sizeRandom > 0 ? randomNumber(-sizeRandom / 2, sizeRandom / 2) : 0
            const pColor = colorRandom > 0 ? randomNumber(-colorRandom / 2, colorRandom / 2) : 0
            const pRotation =
                rotationRandom > 0 ? randomNumber(rotation - rotationRandom / 2, rotation + rotationRandom / 2) : rotation
            pDirection.multiplyScalar(pVelocity)
            particles.push({
                position: { x: 0, y: 0, z: 0 },
                sizeRandom: pSize,
                colorRandom: pColor,
                alpha: 1,
                life: -(life / count) * i * (1 - explosiveness),
                maxLife: life,
                rotation: pRotation,
                velocity: pDirection,
                randomValue: randomNumber(0, 1)
            })
        }

        const sizes = []
        const colors: any = []
        const rotations: any = []
        const velocities: any = []
        const randomValues: any = []
        for (let particle of particles) {
            positionAttributeArray.push(particle.position.x, particle.position.y, particle.position.z)
            sizes.push(particle.sizeRandom)
            colors.push(particle.colorRandom)
            rotations.push(particle.rotation)
            lifeAttributeArray.push(particle.life)
            velocities.push(particle.velocity.x, particle.velocity.y, particle.velocity.z)
            randomValues.push(particle.randomValue)
        }

        geometry.setAttribute('position', new Float32BufferAttribute(positionAttributeArray, 3))
        geometry.setAttribute('sizeRandom', new Float32BufferAttribute(sizes, 1))
        geometry.setAttribute('colorRandom', new Float32BufferAttribute(colors, 1))
        geometry.setAttribute('rotation', new Float32BufferAttribute(rotations, 1))
        geometry.setAttribute('life', new Float32BufferAttribute(lifeAttributeArray, 1))
        geometry.setAttribute('randomValue', new Float32BufferAttribute(randomValues, 1))
        geometry.setAttribute('velocity', new Float32BufferAttribute(velocities, 3))

        geometry.attributes.sizeRandom.needsUpdate = true
        geometry.attributes.velocity.needsUpdate = true
        geometry.attributes.colorRandom.needsUpdate = true
        geometry.attributes.rotation.needsUpdate = true
        geometry.attributes.life.needsUpdate = true
        geometry.attributes.randomValue.needsUpdate = true
    }

    setupParticles()

    const distributePreBirthParticles = () => {
        particles.forEach((particle: any, i: number) => {
            particle.life = -(life / count) * i * (1 - explosiveness)
        })
    }

    const positionNewParticle = (index: number) => {
        if (area) {
            newPosition = ramdomPointInsideCube(position, scale)
            positionAttributeArray[index * 3] = newPosition.x
            positionAttributeArray[index * 3 + 1] = newPosition.y
            positionAttributeArray[index * 3 + 2] = newPosition.z
        } else {
            positionAttributeArray[index * 3] = position.x
            positionAttributeArray[index * 3 + 1] = position.y
            positionAttributeArray[index * 3 + 2] = position.z
        }
    }

    const stateChanged = () => {
        dispatch('stateChanged', {
            state
        })
    }

    const positionUpdated = (p: any) => {
        if (!geometry.boundingSphere) {
            geometry.computeBoundingSphere()
        }
        if (!geometry.boundingSphere) return
        geometry.boundingSphere.radius = boundingSphereRadius
        geometry.boundingSphere.center = position
        if (material) {
            //    console.log(material)
        }
    }

    $: positionUpdated(position)

    useFrame((context, delta) => {
        if (delta < 0.5) {
            emitterLife += delta
            let newState = 'running'
            if (emitterLife < life) {
                // emmitting new particles
                newState = 'starting'
            }
            if (oneShot) {
                if (emitterLife >= life) {
                    // emmitting no more particles
                    newState = 'stopping'
                }
                if (emitterLife >= life + life * (1 - explosiveness) + 0.1) {
                    // all particles have died
                    newState = 'finished'
                }
            } else if (paused) {
                if (emitterLife >= pausedTime) {
                    // emmitting no more particles
                    newState = 'stopping'
                }
                if (emitterLife >= pausedTime + life + 0.1) {
                    // all particles have died
                    newState = 'finished'
                }
            }
            if (state !== newState) {
                state = newState
                stateChanged()
                if (state === 'finished') distributePreBirthParticles()
            }

            if (state === 'starting') {
                // move unborn particles to emitter position
                particles.forEach((particle: any, index: number) => {
                    if (particle.life <= 0) {
                        positionNewParticle(index)
                    }
                })
            }
            if (state !== 'finished') {
                // update particles
                lifeAttributeArray.length = 0
                particles.forEach((particle: any, index: number) => {
                    particle.life += delta
                    //console.log(1 - particle.life / particleLife)
                    if (particle.life > particle.maxLife) {
                        // particle died
                        if (state === 'running' && !paused) {
                            particle.life = 0
                            positionNewParticle(index)
                        }
                    }
                    lifeAttributeArray.push(particle.life)
                })
                const lifeAttribute = (geometry.getAttribute('life') as any).set(lifeAttributeArray)
                lifeAttribute.needsUpdate = true
                geometry.setAttribute('position', new Float32BufferAttribute(positionAttributeArray, 3))
            }
        }
    })
</script>

<T.Points
    {geometry}
    {...$$restProps}
    on:create={(r) => {
        //console.log(r)
    }}
>
    <T.ShaderMaterial
        bind:ref={material}
        {vertexShader}
        {fragmentShader}
        depthTest
        depthWrite={false}
        transparent
        vertexColors
        uniforms={{
            map: {
                value: map
            },
            useMap: {
                value: useMap
            },
            maxLifetime: {
                value: life
            },
            dampen: {
                value: dampen
            },
            colorStops: {
                value: parsedColorGradient.stops
            },
            colors: {
                value: parsedColorGradient.values
            },
            sizeStops: {
                value: parsedSizeGradient.stops
            },
            sizes: {
                value: parsedSizeGradient.values
            },
            wind: {
                value: [wind.x, wind.y, wind.z]
            },
            gravity: {
                value: [gravity.x, gravity.y, gravity.z]
            },
            emitterPosition: {
                value: position
            }
        }}
    />
</T.Points>
<!--
{#each particles as particle}
    <T.Mesh position={[particle.velocity.x, particle.velocity.y, particle.velocity.z]}>
        <T.BoxGeometry args={[0.05, 0.05, 0.05]} />
        <T.MeshBasicMaterial />
    </T.Mesh>
{/each} -->

<T.Mesh let:ref scale={[scale.x, scale.y, scale.z]} position={[position.x, position.y, position.z]}>
    <T.BoxGeometry />
    <T.MeshBasicMaterial wireframe visible={debug} />
    <slot {ref} />
</T.Mesh>
