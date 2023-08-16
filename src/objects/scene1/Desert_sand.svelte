
<script>
    import { T } from '@threlte/core'
    import { useGltf, InstancedMesh, Instance } from '@threlte/extras'

    const gltf = useGltf('/objects/desert_assets-transformed.glb', { useDraco: true })

    const items = [
        {
            x: 32,
            z: -4,
            rotation: 0
        },
        {
            x: 44,
            z: 27,
            rotation: 3
        },
        {
            x: 45,
            z: 13,
            rotation: 4
        },
        {
            x: 41,
            z: 0,
            rotation: 0.75
        },
        {
            x: 43,
            z: -13,
            rotation: 1.57
        },
        {
            x: 45,
            z: -30,
            rotation: 3.14
        },
        {
            x: 33,
            z: -45,
            rotation: 5
        },
        {
            x: 18,
            z: -42,
            rotation: 2.8
        },
        {
            x: -1,
            z: -42,
            rotation: 2
        },
        {
            x: -18,
            z: -42,
            rotation: 0
        },
        {
            x: -30,
            z: -42,
            rotation: 0
        },
        {
            x: -47,
            z: 27,
            rotation: 0.75
        },
        {
            x: -42,
            z: 13,
            rotation: 4
        },
        {
            x: -46,
            z: 0,
            rotation: 0.75
        },
        {
            x: -43,
            z: -13,
            rotation: 1.57
        },
        {
            x: -40,
            z: -30,
            rotation: 3.14
        },
        //
        {
            x: 38,
            z: 40,
            rotation: 4
        },
        {
            x: 18,
            z: 45,
            rotation: 2.8
        },
        {
            x: 2,
            z: 45,
            rotation: 3.7
        },
        {
            x: -18,
            z: 42,
            rotation: -0.2
        },
        {
            x: -32,
            z: 44,
            rotation: 3
        },
        {
            x: -12,
            y: -0.15,
            z: 6,
            rotation: 0
        }
    ]
</script>

{#await gltf then gltf}
    <InstancedMesh geometry={gltf.nodes.Sand.geometry} castShadow receiveShadow>
        <T.MeshToonMaterial color="#a16138" />
        {#each items as item}
            <Instance
                on:click={() => {
                    return
                }}
                position.y={item.y ? item.y : -0.05}
                position.z={item.z}
                position.x={item.x}
                scale={[2.5, 0.3, 2.5]}
                rotation.y={item.rotation}
                rotation.x={0}
                rotation.z={0}
            />
        {/each}
    </InstancedMesh>
{/await}
