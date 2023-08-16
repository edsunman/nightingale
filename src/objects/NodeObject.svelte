<script lang="ts">
    import { SRGBColorSpace } from 'three'
    import { T, forwardEventHandlers } from '@threlte/core'
    import { useGltf, InstancedMesh, Instance, useTexture } from '@threlte/extras'
    import HolgramMaterial from './materials/HolgramMaterial.svelte'

    import type { InstanceObject } from '$lib/types'

	export let objects: InstanceObject[]
	export let url: string

    const gltf = useGltf(url, { useDraco: true })
    const texture = useTexture('/texture/objectAtlas.png')

    const items: number[] = []
    const nodes: string[] = [
        'Container',
        'Building',
        'Desk',
        'Wall',
        'Satalite',
        'SpikeBuilding',
        'SmallBuilding',
        'LandingPad',
        'Crate',
        'Door',
        'Server'
    ]

    for (let i = 0; i < 50; i++) {
        const position = i * 5
        items.push(position)
    }
</script>

{#await gltf then gltf}
    {#each objects as object}
        <InstancedMesh geometry={gltf.nodes[object.name].geometry} castShadow receiveShadow={object.receiveShadow}>
            {#if object.material==='Hologram'}
                <HolgramMaterial/>
            {:else}
            {#await texture then t}
                <T.MeshToonMaterial color="#ffffff">
                    <T is={t} attach="map" flipY={false} colorSpace={SRGBColorSpace} />
                </T.MeshToonMaterial>
            {/await}
            {/if}
            {#each object.instances as { position, rotation }}
                <Instance
                    scale={[object.scale[0], object.scale[1], object.scale[2]]}
                    position={[position[0], position[1], position[2]]}
                    rotation={[rotation[0], rotation[1], rotation[2]]}
                />
            {/each}
        </InstancedMesh>
    {/each}
{/await}
