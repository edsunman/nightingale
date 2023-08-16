<script lang="ts">
    import { T } from '@threlte/core'
    import Floor from '../objects/Floor.svelte'
    import type { AvoidObject, InstanceObject } from '$lib/types'
    import NodeObject from '../objects/NodeObject.svelte'

    import type { GameData } from '$lib/types'

    export let gameData : GameData

    const avoidArray: AvoidObject[] = []

    const objects: InstanceObject[] = [
        {
            name: 'LandingPad',
            scale: [4.9, 5.2, 5.4],
            instances: [
                { position: [24, -0.05, -25.5], rotation: [0, 1.57, 0] },
                { position: [-23, -0.05, -20], rotation:[0, 0, 0] },
                { position: [-11, -0.05, 24], rotation:[0, 1.57, 0] }
            ]
        },
         {
            name: 'HologramPad',
            scale: [0.4,0.4, 0.4],
            instances: [
                { position: [21, 0, -18], rotation: [0, -1.57, 0] }
            ]
        }
    ]

     for (let i = 0; i < 50; i++) {
        //objects[0].instances.push({ position: { x: i + 50, y: 0, z: 45 }, rotation: { x: 1, y: 2, z: 3 } })
     }

</script>


<Floor {avoidArray} startingPosition={{ x:0, z: 0 }} startingRotation={{ x: 0, z: -1 }} levelSize={{ x: 20, z: 20 }} />

<T.Mesh position={[0.5, -0.01, 0.5]} visible={true} name="ground" receiveShadow>
    <T.BoxGeometry args={[20, 0.01, 20]} />
    <T.MeshToonMaterial color="#555555"  />
</T.Mesh>

<NodeObject {objects} url={'/objects/tech_assets-transformed.glb'} />

