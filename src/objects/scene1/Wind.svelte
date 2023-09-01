<script lang="ts">
    import { gameCameraPosition } from '$lib/stores'
    import { T, useFrame } from '@threlte/core'
    import { Vector3, CatmullRomCurve3 } from 'three'
    import { quadInOut } from 'svelte/easing'
    import { randomNumber } from '$lib/util'
    import MeshLineMaterial from '$lib/components/MeshLineMaterial.svelte'
    import MeshLineGeometry from '$lib/components/MeshLineGeometry.svelte'

    let fullPoints: any = []
    let points: any = []
    let groupPosition: [number, number, number] = [0, 1, 0]
    let hide = false
    let pointOffset = 0
    let linearOpacity = 0
    let opacity = 0
    let fadingIn = true

     const lines = [
        {
            width: 0.06,
            rotationZ: 0,
            opacity: 0.4
        },
        {
            width: 0.09,
            rotationZ: 1.885,
            opacity: 0.7
        },
        {
            width: 0.12,
            rotationZ: 3.7699,
            opacity: 1
        }
    ]

    const genratePoints =() => {
        const p = []
        p.push(new Vector3(randomNumber(-0.5,0.5), 0, 10))
        p.push(new Vector3(randomNumber(-0.8,0), 0, 5))
        p.push(new Vector3(randomNumber(0,0.8),0, 0))
        p.push(new Vector3(randomNumber(-0.8,0), 0, -5))
        p.push(new Vector3(randomNumber(-0.5,0.5), 0, -10))
        const curve = new CatmullRomCurve3(p)
        fullPoints = curve.getPoints(240)
    }

    const selectPoints = (offset:number, length:number) : any => {
        let pointsCount = fullPoints.length
        let extraPoints = []
        let offsetPoint = Math.floor((pointsCount+length) * offset)

        for (let i = 0; i < length; i++) {
            extraPoints.push(fullPoints[0])
        }
        for (let i = 0; i < pointsCount; i++) {
            extraPoints.push(fullPoints[i])
        }

        for (let i = 0; i < length; i++) {
            extraPoints.push(fullPoints[pointsCount-1])
        }

        return extraPoints.slice(offsetPoint,offsetPoint+length)
    }

    const moveLines = () => {
        const pX = $gameCameraPosition.x
        const pZ = $gameCameraPosition.z
        const distance = 6
        groupPosition[0] = randomNumber(pX - distance, pX + distance) 
        groupPosition[2] = randomNumber(pZ - distance, pZ + distance) 
        groupPosition[1] = hide ? -1 : 1
    }

    genratePoints()

    points = selectPoints(0,40)

    useFrame((context, delta) => {
        pointOffset += 0.007
        if (pointOffset>=1) pointOffset = 0
        if (linearOpacity<0) linearOpacity = 0
        if (0.2<pointOffset && pointOffset<0.5){
            fadingIn = true
        } else if (pointOffset>0.5) {
            fadingIn = false
        }
        if(fadingIn){
            linearOpacity += 0.02
        } else {
            linearOpacity -= 0.02
        }
        if (linearOpacity<0) linearOpacity = 0
        if (linearOpacity>1) linearOpacity = 1

        if (pointOffset===0) {
           genratePoints()
           moveLines()
           hide = !hide
        }

        
        opacity = quadInOut(linearOpacity)

        points = selectPoints(pointOffset,40)
    })

</script>

<T.Group position={groupPosition}>
    {#each lines as line, i}
        <T.Mesh rotation.z={i} position.z={i*1.2} >
            <MeshLineGeometry {points} shape='taper'  />
            <MeshLineMaterial opacity={opacity * line.opacity} width={line.width} transparent depthWrite={false} />
        </T.Mesh>
    {/each}
</T.Group>
