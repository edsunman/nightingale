<script>
    import { T } from '@threlte/core'
    import { useGltf, InstancedMesh, Instance } from '@threlte/extras'
    import seedrandom from 'seedrandom'

    const gltf = useGltf('/objects/stone_assets-transformed.glb', { useDraco: true })

    let sRandom = seedrandom('seed14')

    const rotationValues = [0, 3.14159]

    const items = Array.from({ length: 21 }, () => ({
        x: sRandom() * 18 - 9,
        z: sRandom() * 7 - 3,
        scale: 0.1,
        rotation: {
            x: 0,
            y: Math.floor(sRandom() * 2),
            z: 0
        }
    }))
</script>

{#await gltf then gltf}
    <InstancedMesh geometry={gltf.nodes.Brick.geometry} castShadow receiveShadow>
        <T.MeshToonMaterial color="#585858" />
        {#each items as item}
            <Instance
                position.y={0}
                position.z={item.z}
                position.x={item.x}
                scale={[0.3, 0.05, 0.3]}
                rotation.y={rotationValues[item.rotation.y]}
                rotation.x={0}
                rotation.z={0}
            />
        {/each}
    </InstancedMesh>
{/await}

