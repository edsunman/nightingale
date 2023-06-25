<script lang="ts">
    import { T, useFrame } from '@threlte/core'
    import { MeshLine, MeshLineMaterial } from 'three.meshline'
    import { Vector3 , BufferGeometry,  CatmullRomCurve3, Color } from 'three'

    export let position : [x:number,y:number,z:number] 

    const lines : any[] = []

    function newLine(){
        const points = []
        points.push(new Vector3(0, 0, 0))
        for (let i = 1; i < 5; i++) {
            points.push(new Vector3((Math.random() * 1)-0.5, 0.23*i, (Math.random() * 1)-0.5))
        }
        const curve = new CatmullRomCurve3(points).getPoints(50)
        const geometry = new BufferGeometry().setFromPoints(curve)
        const line = new MeshLine()
        line.setGeometry(geometry)
        return line
    }

    for (let i = 0; i < 5; i++) {
           lines.push(newLine())
    }

    function newLineMaterial(){
        const material = new MeshLineMaterial()
        material.transparent = true
        material.depthTest = true
        material.lineWidth = 0.03
        material.dashArray = 1
        material.dashRatio = 0.98
        material.color = new Color(0xffffff)
        return material
    }
    
    const materials : any[] = []

    for (let i = 0; i < 5; i++) {
           materials.push(newLineMaterial())
    }
    

    useFrame((state, delta) => {
        materials[0].dashOffset -= delta*0.25
        materials[1].dashOffset -= delta*0.3
        materials[2].dashOffset -= delta*0.32
        materials[3].dashOffset -= delta*0.35
        materials[4].dashOffset -= delta*0.38
    })
</script>

<T.Mesh {position} geometry={lines[0]} material={materials[0]} />
<T.Mesh {position} geometry={lines[1]} material={materials[1]} />
<T.Mesh {position} geometry={lines[2]} material={materials[2]} />
<T.Mesh {position} geometry={lines[3]} material={materials[3]} />
<T.Mesh {position} geometry={lines[4]} material={materials[4]} />
