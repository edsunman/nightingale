<script lang="ts">
    import { T, useFrame } from '@threlte/core'   
    import { Instance, InstancedMesh } from '@threlte/extras'
    import { Vector3, BufferGeometry, Line, LineBasicMaterial, CatmullRomCurve3, Color } from 'three'

    export let position : [x: number, y: number, z: number] = [0,0,0]
    export let count = 15
    let percent = 0

    const curveArray : CatmullRomCurve3[] = []
    const positionsArray : any[] = []

    for(let i = 0; i < count; i++){
        const factorX = 2
        const factorY = 7
        const factorZ = 4
        const points = []
        points.push(new Vector3(Math.random()*factorX ,Math.random()*factorY, Math.random()*factorZ))
        points.push(new Vector3(Math.random()*factorX, Math.random()*factorY, Math.random()*factorZ))
        points.push(new Vector3(Math.random()*factorX, Math.random()*factorY, Math.random()*factorZ))
        const curve = new CatmullRomCurve3(points, true)
        curveArray.push(curve)
    }
     
    const curvePoints = curveArray[1].getPoints(10)
    const debugLine = new Line(
        new BufferGeometry().setFromPoints( curvePoints ),
        new LineBasicMaterial( { color: 0x00ff00 } )
    )

    useFrame((state, delta) => {
        if (delta < 0.5) {
            percent += 0.02 * delta
        }
        if(percent > 1) percent = 0
        positionsArray.length = 0
        for(let i = 0; i < count; i++){
            const point = curveArray[i].getPoint(percent)
            positionsArray.push([point.x,point.y,point.z])
        }
    })
</script>

<InstancedMesh name={'dust'} {position} rotation.x={0.5} frustumCulled={false}>
    <T.DodecahedronGeometry args={[0.01, 0]} />
    <T.MeshToonMaterial color="#888888" transparent={true} opacity={0.7} />
    {#each positionsArray as p}
        <Instance position={[p[0],p[1],p[2]]}></Instance>
    {/each}
</InstancedMesh>
<!--<T is={debugLine} />-->
