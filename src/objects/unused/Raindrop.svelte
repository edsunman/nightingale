<script lang="ts">
    import { T, useFrame } from '@threlte/core'
    import { Instance } from '@threlte/extras'

    export let position: [x: number, y: number, z: number]
    let scale = 1

    useFrame((state, delta) => {
        if (delta < 0.5) {
            position[1]-=delta
        }
        if(position[1]< -1) {
            position[1] = 10
            scale = 1
        }
        //if(position[1] < 1) scale-=delta

        if (scale < 0.2) scale = 0 
    })
</script>

<Instance position.x={position[0]} position.y={position[1]} position.z={position[2]} scale={scale}/>
