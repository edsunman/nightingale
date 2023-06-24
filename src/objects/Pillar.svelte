<script lang="ts">
    import { T, useFrame } from '@threlte/core'
    import { gamePosition } from '$lib/stores'

    let isPillarVisible = true
    let opacity = 1
    export let matrix : number[] = []

    useFrame(() => {
        const p = $gamePosition
        const m = matrix
        isPillarVisible = true

        if ((m[0] > p.x && p.x > m[1] && m[2] > p.z && p.z > m[3]) || 
            (m[4]> p.x && p.x > m[5] && m[6] > p.z && p.z > m[7]) ||
            (m[8] > p.x && p.x > m[9] && m[10] > p.z && p.z > m[11]) ||
            (m[12]> p.x && p.x > m[13] && m[14] > p.z && p.z > m[15]))
            {
            isPillarVisible = false
        }

        if (isPillarVisible) {
            if (opacity === 0.9) opacity = 1
            else if (opacity < 0.9) opacity += 0.1
        } else {
            if (opacity === 0.1) opacity = 0
            else if (opacity > 0.1) opacity -= 0.1
        }
    })
</script>

<T.Mesh {...$$restProps} visible={true}>
    <T.CylinderGeometry args={[0.5, 0.5, 5]} />
    <T.MeshToonMaterial color="#666666" transparent={true} {opacity} />
</T.Mesh>

