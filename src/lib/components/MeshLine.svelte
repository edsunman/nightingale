<script lang="ts">
    import { T } from '@threlte/core'
    import { MeshLine, MeshLineMaterial } from '$lib/components/MeshLine'
    import { Color, Mesh } from 'three'
    import type { MeshLineProps } from './MeshLine.svelte'

    type Props = Required<MeshLineProps>

    export let points : Props['points']
    export let pointWidth :  Props['pointWidth'] = ( p ) => 1
    export let transparent :  Props['transparent'] = false
    export let depthTest : Props['depthTest'] = true
    export let depthWrite : Props['depthWrite'] = true
    export let lineWidth : Props['lineWidth'] = 1
    export let dashArray : Props['dashArray'] = 0
    export let dashRatio : Props['dashRatio'] = 0
    export let color : Props['color'] = '#ffffff'
    export let dashOffset : Props['dashOffset'] = 0
    export let opacity : Props['opacity'] = 1

    export let ref: Mesh

    const line = new MeshLine()
    line.setPoints(points, pointWidth)

    $: line.setPoints(points, pointWidth)

    const material = new MeshLineMaterial() as any
    material.transparent = transparent
    material.depthTest = depthTest
    material.lineWidth = lineWidth
    material.dashArray = dashArray
    material.dashRatio = dashRatio
    material.color = new Color(color)
    material.dashOffset = dashOffset
    material.depthWrite = depthWrite
    material.opacity = opacity

    $ : {
       material.dashOffset = dashOffset
       material.opacity = opacity
    }
    
    // TODO : add proper disposal

</script>


<T.Mesh bind:ref  {...$$restProps} geometry={line} material={material} />