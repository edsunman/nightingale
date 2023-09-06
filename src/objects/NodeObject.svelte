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
            {#if object.material === 'hologram'}
                <HolgramMaterial />
            {:else}
                {#await texture then t}
                    <T.MeshToonMaterial color="#ffffff">
                        <T is={t} attach="map" flipY={false} colorSpace={SRGBColorSpace} />
                    </T.MeshToonMaterial>
                {/await}
            {/if}
            {#each object.instances as instance}
                {#if object.noClickThrough}
                    <Instance
                        on:click={() => {
                            return
                        }}
                        scale={[object.scale_x, object.scale_y, object.scale_z]}
                        position={[instance.position_x, instance.position_y, instance.position_z]}
                        rotation={[instance.rotation_x, instance.rotation_y, instance.rotation_z]}
                    />
                {:else}
                    <Instance
                        scale={[object.scale_x, object.scale_y, object.scale_z]}
                        position={[instance.position_x, instance.position_y, instance.position_z]}
                        rotation={[instance.rotation_x, instance.rotation_y, instance.rotation_z]}
                    />
                {/if}
            {/each}
        </InstancedMesh>
    {/each}
{/await}
