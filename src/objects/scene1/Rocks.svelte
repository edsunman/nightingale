<script>
    import { T } from '@threlte/core'
    import { useGltf, InstancedMesh, Instance } from '@threlte/extras'
    import seedrandom from 'seedrandom'

    const gltf = useGltf('/objects/desert_assets-transformed.glb', { useDraco: true })

    let sRandom = seedrandom('seed')

    const items = Array.from({ length: 120 }, () => ({
        x: sRandom() * 80 - 40,
        z: sRandom() * 80 - 40,
        scale: sRandom() * 0.2 + 0.16,
        rotation: {
            x: sRandom() * 360,
            y: sRandom() * 360,
            z: sRandom() * 360
        }
    }))

</script>

{#await gltf then gltf}
    <InstancedMesh geometry={gltf.nodes.Rock.geometry} castShadow receiveShadow >
        <T.MeshToonMaterial color="#9c5c32" />
        {#each items as item}
            <Instance
                position.y={0}
                position.z={item.z}
                position.x={item.x}
                scale={item.scale}
                rotation.y={(item.rotation.y * Math.PI) / 180}
                rotation.x={(item.rotation.x * Math.PI) / 180}
                rotation.z={(item.rotation.z * Math.PI) / 180}
            />
        {/each}
    </InstancedMesh>
{/await}
