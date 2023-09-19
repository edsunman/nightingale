<script lang="ts">
    import { T, useFrame, useThrelte } from '@threlte/core'
    import { useTexture, TransformControls } from '@threlte/extras'
    import fragmentShader from './fragment.glsl?raw'
    import vertexShader from './vertex.glsl?raw'
    import { BufferGeometry, Float32BufferAttribute, Vector3, AdditiveBlending, TextureLoader, Color, MultiplyBlending } from 'three'
    import { randomNumber } from '$lib/util'
    import { createEventDispatcher } from 'svelte'
    import { ramdomPointInsideCube, randomDirectionSpread, createGradientObject } from './util'

    const dispatch = createEventDispatcher()

    const geometry = new BufferGeometry()

    export let particleCount = 10
    export let particleLife = 2
    export let oneShot = false
    export let position: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 }
    export let debug = false
    export let explosiveness = 0
    export let spread = 0
    export let direction = new Vector3(0, 1, 0)
    export let velocity = 1
    export let velocityRandom = 0
    export let area = false
    export let size = 1
    export let sizeRandom = 0
    export let dampen = false
    export let colorGradient: string = ''

    let emitterScale = new Vector3(10, 1, 10)

    let emitterLife = 0
    let state = ''
    let newPosition
    let paused = false
    let pausedTime: number

    const positionAttributeArray: number[] = []
    const lifeAttributeArray: number[] = []
    const parsedGradient = createGradientObject(colorGradient)
    //console.log(parsedGradient)

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

    const updateBox = (ref: any) => {
        //console.log(ref)
        position = ref.position
        geometry.computeBoundingSphere()
    }

    const smokeTexture = new TextureLoader().load('/texture/smokeWhite.png')

    const particles: any = []

    const setupParticles = () => {
        for (let i = 0; i < particleCount; i++) {
            const pDirection = new Vector3().copy(direction.normalize())
            if (spread > 0) pDirection.copy(randomDirectionSpread(pDirection, spread))
            const pVelocity =
                velocityRandom > 0 ? randomNumber(velocity - velocityRandom / 2, velocity + velocityRandom / 2) : velocity
            const pSize = sizeRandom > 0 ? randomNumber(size - sizeRandom / 2, size + sizeRandom / 2) : size
            console.log(pVelocity)
            pDirection.multiplyScalar(pVelocity)
            particles.push({
                position,
                size: pSize,
                color: new Color(randomNumber(), randomNumber(), randomNumber()),
                alpha: 1,
                life: -(particleLife / particleCount) * i * (1 - explosiveness),
                maxLife: particleLife,
                rotation: randomNumber(-2, 2),
                velocity: pDirection
            })
        }

        const sizes = []
        const colors: any = []
        const angles: any = []
        const velocities: any = []
        for (let particle of particles) {
            positionAttributeArray.push(particle.position.x, particle.position.y, particle.position.z)
            sizes.push(particle.size)
            colors.push(particle.color.r, particle.color.g, particle.color.b, particle.alpha)
            angles.push(particle.rotation)
            lifeAttributeArray.push(particle.life)
            velocities.push(particle.velocity.x, particle.velocity.y, particle.velocity.z)
        }

        geometry.setAttribute('position', new Float32BufferAttribute(positionAttributeArray, 3))
        geometry.setAttribute('size', new Float32BufferAttribute(sizes, 1))
        geometry.setAttribute('particleColor', new Float32BufferAttribute(colors, 4))
        geometry.setAttribute('angle', new Float32BufferAttribute(angles, 1))
        geometry.setAttribute('life', new Float32BufferAttribute(lifeAttributeArray, 1))
        geometry.setAttribute('velocity', new Float32BufferAttribute(velocities, 3))

        geometry.attributes.size.needsUpdate = true
        geometry.attributes.velocity.needsUpdate = true
        geometry.attributes.particleColor.needsUpdate = true
        geometry.attributes.angle.needsUpdate = true
        geometry.attributes.life.needsUpdate = true
    }

    setupParticles()

    const distributePreBirthParticles = () => {
        particles.forEach((particle: any, i: number) => {
            particle.life = -(particleLife / particleCount) * i * (1 - explosiveness)
        })
    }

    const positionNewParticle = (index: number) => {
        if (area) {
            newPosition = ramdomPointInsideCube(position, emitterScale)
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

    useFrame((context, delta) => {
        if (delta < 0.5) {
            emitterLife += delta
            let newState = 'running'
            if (emitterLife < particleLife) {
                // emmitting new particles
                newState = 'starting'
            }
            if (oneShot) {
                if (emitterLife >= particleLife) {
                    // emmitting no more particles
                    newState = 'stopping'
                }
                if (emitterLife >= particleLife + particleLife * (1 - explosiveness)) {
                    // all particles have died
                    newState = 'finished'
                }
            } else if (paused) {
                if (emitterLife >= pausedTime) {
                    // emmitting no more particles
                    newState = 'stopping'
                }
                if (emitterLife >= pausedTime + particleLife) {
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

<T.Points {geometry}>
    <T.ShaderMaterial
        {vertexShader}
        {fragmentShader}
        depthTest
        depthWrite={false}
        transparent
        vertexColors
        uniforms={{
            diffuseTexture: {
                value: smokeTexture
            },
            maxLifetime: {
                value: particleLife
            },
            dampen: {
                value: dampen ? 1.0 : 0.0
            },
            stops: {
                value: parsedGradient.stops
            },
            colors: {
                value: parsedGradient.colors
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
{#if debug}
    <T.Mesh let:ref scale={[1, 1, 1]} position={[position.x, position.y, position.z]}>
        <T.BoxGeometry />
        <T.MeshBasicMaterial wireframe visible={false} />
        <TransformControls
            object={ref}
            on:mouseUp={() => {
                updateBox(ref)
            }}
        />
    </T.Mesh>
{/if}
