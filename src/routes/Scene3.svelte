<script lang="ts">
    import { T, useFrame } from '@threlte/core'
    import Floor from './Floor.svelte'
    import Door from '../objects/Door.svelte'
    import { onMount } from 'svelte'
    import { InstancedMesh } from '@threlte/extras'
    import Raindrop from '../objects/Raindrop.svelte'
    import Item from '../objects/Item.svelte'
    import Sparkes from '../objects/effects/Sparkes.svelte'
    import * as THREE from 'three'
    import MeshLine from '$lib/components/MeshLine.svelte'
    import type { Vector3 } from 'three'
    


    const avoidArray: Array<{ x: number; z: number }> = []

    let flickeringInterval: ReturnType<typeof setInterval>
    let lightBrightness: number
    let curvePosition : any
    let percent = 0
    let windPercent = 0

    const items = Array.from({ length: 3 }, () => ({
        x: Math.random() * 5 - 2.5,
        y: Math.random() * 10,
        z: Math.random() * 10 - 5

    }))

    onMount(() => {
        flickeringInterval = setInterval(function () {
            lightBrightness = Math.random() * 1 + 0
        }, 30)
        setTimeout(function () {
            clearInterval(flickeringInterval)
            lightBrightness = 1
        }, 1500)
    })

   
    const points : Vector3[] = []
    points.push(new THREE.Vector3(0, 0, 0))
    points.push(new THREE.Vector3(-1, 2, 1))
    points.push(new THREE.Vector3(1, 4, -1))

    const curve = new THREE.CatmullRomCurve3(points)
    const curvePoints = curve.getPoints(100)



    const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints( curvePoints ),
        new THREE.LineBasicMaterial( { color: 0x00ff00 } )
    )

    
   

        

    useFrame((state,delta)=>{
        if (delta < 0.5) {
            percent += 0.6 * delta

        }
        if(percent > 1) percent = 0
        
        const point = curve.getPoint(percent)
        curvePosition = [point.x,point.y,point.z]

       //console.log(percent)
    })
    
    


</script>
<!--
<T.Mesh position={curvePosition}>
    <T.DodecahedronGeometry args={[0.2, 0]} />
    <T.MeshToonMaterial color="#888888" />
</T.Mesh>

-->
<MeshLine
    points={curvePoints}
    dashOffset={percent}
    pointWidth={( p ) => 1 * Math.pow(4 * p * (1 - p), 1)}
/>
<T is={line}></T>
<!--
<InstancedMesh>
    <T.DodecahedronBufferGeometry args={[0.02, 0]} />
    <T.MeshToonMaterial color="#ffffff" />
    {#each items as item}
        <Raindrop position={[item.x, item.y, item.z]} />
    {/each}
</InstancedMesh>
-->

<Floor
    levelSize={{ x: 6, z: 10 }}
    {avoidArray}
    startingPosition={{ x: 2, z: -2 }}
    startingRotation={{ x: 1, z: -2 }}
    floorType="stone"
    sunIntensity={0}
/>

<T.Mesh position={[0.5, -0.01, 0.5]} visible={true} name="ground" receiveShadow>
    <T.BoxGeometry args={[6, 0.01, 10]} />
    <T.MeshStandardMaterial color="#595550" />
</T.Mesh>

<T.AmbientLight intensity={0.15} />

<Door position={[3.5, 1, -2]} rotation.y={1.57} activeSquare={{ x: 3, z: -2 }} scene={1} nextScenePosition={{ x: -1, z: 14 }} />

<Item id={2} position={{ x: -2, y: 0.4, z: 3 }} scale={[0.2, 0.3, 0.2]} />


<Sparkes position={[-2,0,3]} />

<!--
<PositionalAudio autoplay loop refDistance={3} volume={0.1} src={'/music.mp3'} position={[0, 0, 0]} bind:ref={audio} />
-->
<T.Mesh position={[0.5, 2.5, 0.5]} visible={true} name="light-box">
    <T.BoxGeometry args={[0.2, 0.1, 2]} />
    <T.MeshToonMaterial color="#ffffff" emissive="#ffffff" transparent={true} opacity={lightBrightness * 0.8} />
</T.Mesh>
<T.PointLight
    position={[0.5, 4, 0.5]}
    distance={8}
    color={'#ffffff'}
    intensity={lightBrightness * 2}
    castShadow
    shadow.mapSize.width={500}
    shadow.mapSize.height={500}
    shadow.camera.top={9}
    shadow.camera.right={4}
    shadow.camera.left={-18}
    shadow.camera.bottom={-6}
    shadow.radius={5}
/>
