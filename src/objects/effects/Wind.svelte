<script lang="ts">
    import { gamePosition } from '$lib/stores'
    import { T, useFrame, useThrelte } from '@threlte/core'
    import { Vector3 , BufferGeometry,  CatmullRomCurve3, Color } from 'three'
    import { MeshLine, MeshLineMaterial} from 'three.meshline'


    let randomPos = () => Math.random() * (1 - 0) + 0
    let windPercent = 0
    let position : [number,number,number] = [0,0.5,0]


    const lines : any[] = []

    
    function line(this:any, i:number) : any {
        const points = []
        points.push(new Vector3(randomPos(),randomPos(), 6))
        points.push(new Vector3(randomPos(), randomPos(), 4))
        points.push(new Vector3(randomPos(), randomPos(), 0))
        points.push(new Vector3(randomPos(), randomPos(), -4))
        points.push(new Vector3(randomPos(), randomPos(), -6))
        const curve = new CatmullRomCurve3(points)
        const curvePoints = curve.getPoints(50)
        const geometry = new BufferGeometry().setFromPoints(curvePoints)
        const meshLine = new MeshLine()
        meshLine.setGeometry(geometry,function( p : any ) { return 1 * Math.pow(4 * p * (1 - p), 1)} )
        this.geometry = meshLine

        const material = new MeshLineMaterial()
        material.transparent = true
        material.depthTest = true
        material.lineWidth = (i * 0.02) + 0.01
        material.dashArray = 1
        material.dashRatio = 0.8
        material.color = new Color(0xffffff)
        material.taper = 'linear'
        material.opacity = 0
        this.material = material

        this.zPosition =  i
        this.xPosition = i / 4
        this.opacityTarget = (i * 0.3) + 0.3
    }


    function generateLines(){
        lines.length = 0
        for (let i = 0; i < 3; i++) {
            lines.push(new (line as any)(i))
        }
    }

    generateLines()
    /*
    function getSectionOfCurve(a : THREE.Vector3[], offset = 0, length = 1){
        const arrayLength = a.length
        const percent = offset*100
        const offsetPercent = ((percent / 100) * arrayLength)
        const slicedArray = a.slice(0+offsetPercent, arrayLength*length+offsetPercent)
        return slicedArray
    }

    const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints( curvePoints ),
        new THREE.LineBasicMaterial( { color: 0x00ff00 } )
    )*/

    function moveLines(){
        const pX = $gamePosition.x
        const pZ = $gamePosition.z
        const distance = 15
        generateLines()
        position[0] = Math.random() * ((pX + distance) - (pX - distance)) + (pX - distance)
        position[2] = Math.random() * ((pZ + distance) - (pZ - distance)) + (pZ - distance)
    }

    useFrame((state,delta)=>{
        if (delta < 0.5) {
            windPercent += 0.6 * delta
            
            if (windPercent<0.5) {
               lines[0].material.opacity += delta * lines[0].opacityTarget
               lines[1].material.opacity += delta * lines[1].opacityTarget
               lines[2].material.opacity += delta * lines[2].opacityTarget
            } else {
                lines[0].material.opacity -= delta * (lines[0].opacityTarget)
                lines[1].material.opacity -= delta * (lines[1].opacityTarget)
                lines[2].material.opacity -= delta * (lines[2].opacityTarget)
            }
            
            lines[0].material.dashOffset = -windPercent-0.1
            lines[1].material.dashOffset = -windPercent-0.1
            lines[2].material.dashOffset = -windPercent-0.1
           
        }
      
        if(windPercent > 1) {           
            windPercent = 0
            lines[0].material.opacity = 0
            lines[1].material.opacity = 0
            lines[2].material.opacity = 0
            moveLines()
        }
        
      
    })
    
    


</script>

<T.Group {position} >
    <T.Mesh  geometry={lines[0].geometry} material={lines[0].material} position.z={lines[0].zPosition} position.x={lines[0].xPosition} />
    <T.Mesh  geometry={lines[1].geometry} material={lines[1].material} position.z={lines[1].zPosition} position.x={lines[1].xPosition} />
    <T.Mesh  geometry={lines[2].geometry} material={lines[2].material} position.z={lines[2].zPosition} position.x={lines[2].xPosition} />
</T.Group>

<!--<T is={line}></T>-->
