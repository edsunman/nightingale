<script lang="ts">
    import { gameMovingTo } from '$lib/stores'
    import { T, useFrame } from '@threlte/core'
    import { InstancedMesh, Instance, useTexture, Portal } from '@threlte/extras'
    import { MeshBasicMaterial, PlaneGeometry, SRGBColorSpace, Vector3 } from 'three'
    import { randomNumber, findClosestPoint } from '$lib/util'

    const smokeTexture = useTexture('/texture/smokeWhite.png')
    let spinRotation = 0

    let clouds1 = Array.from({ length: 20 }, () => ({
        x: randomNumber(-0.5, 0.5) + 2.5,
        z: randomNumber(-2, 2) + 0.2,
        rotationSpeed: randomNumber(-0.5, 0.5),
        rotationOffset: randomNumber(0, 6)
    }))

    let clouds2 = Array.from({ length: 20 }, () => ({
        x: randomNumber(-0.5, 0.5) - 4,
        z: randomNumber(-2, 2) + 0.2,
        rotationSpeed: randomNumber(-0.5, 0.5),
        rotationOffset: randomNumber(0, 6)
    }))

    let clouds = clouds1.concat(clouds2)

    useFrame(() => {
        spinRotation += 0.008
    })
</script>

<T.Group >
    {#await smokeTexture then texture}
        <InstancedMesh name={'dust'}>
            <T.PlaneGeometry args={[1.4, 1.4]} />
            <T.MeshToonMaterial color="#ffffff" transparent={true} depthWrite={false} opacity={0.1}>
                <T is={texture} attach="map" flipY={false} colorSpace={SRGBColorSpace} />
            </T.MeshToonMaterial>
            {#each clouds as cloud}
                <Instance
                    position={[cloud.x, 0.7, cloud.z]}
                    rotation={[-1, 0.7, spinRotation * cloud.rotationSpeed + cloud.rotationOffset]}
                />
            {/each}
        </InstancedMesh>
    {/await}
</T.Group>
