<script lang="ts">
    import { gameMovingTo } from '$lib/stores'
    import { T, useFrame } from '@threlte/core'
    import { InstancedMesh, Instance, useTexture } from '@threlte/extras'
    import { SRGBColorSpace } from 'three'
    import { randomNumber, findClosestPoint } from '$lib/util'

    const smokeTexture = useTexture('/texture/smoke.png')
    let spinRotation = 0
    let positions = [
        { x: 34, z: -26 },
        { x: 22, z: 26 },
        { x: -28, z: 17 },
        { x: -11, z: -27 },
        { x: 8, z: 0 }
    ]
    let position = positions[0]

    $: checkArea($gameMovingTo)

    function checkArea(gmt: any) {
        position = findClosestPoint(gmt, positions)
    }

    let clouds = Array.from({ length: 40 }, () => ({
        x: randomNumber(-1, 1),
        z: randomNumber(-8, 8),
        rotationSpeed: randomNumber(-0.5, 0.5),
        rotationOffset: randomNumber(0, 6)
    }))

    useFrame(() => {
        spinRotation += 0.05
        clouds.forEach((cloud, i, self) => {
            self[i].z -= 0.08
            if (self[i].z < -8) {
                self[i].z = 8
            }
        })
        clouds = clouds
    })
</script>

<T.Group position={[position.x, 0, position.z]}>
    {#await smokeTexture then texture}
        <InstancedMesh name={'dust'}>
            <T.PlaneGeometry args={[4, 4]} />
            <T.MeshToonMaterial color="#ffffff" transparent={true} depthWrite={false} opacity={0.05}>
                <T is={texture} attach="map" flipY={false} colorSpace={SRGBColorSpace} />
            </T.MeshToonMaterial>
            {#each clouds as cloud}
                <Instance
                    position={[cloud.x, 2, cloud.z]}
                    rotation={[-1, 0.7, spinRotation * cloud.rotationSpeed + cloud.rotationOffset]}
                />
            {/each}
        </InstancedMesh>
    {/await}
</T.Group>
