<script lang="ts">
    import { gameCameraPosition } from '$lib/stores'
    import { T, useFrame } from '@threlte/core'
    import Floor from '../objects/Floor.svelte'
    import type { AvoidObject } from '$lib/types'
    import { Vector3, CatmullRomCurve3 } from 'three'
    import { quadInOut } from 'svelte/easing'
    import { randomNumber } from '$lib/util'
    	import { spring } from 'svelte/motion'

    import { onMount } from 'svelte'

    import type { GameData } from '$lib/types'
    import MeshLineMaterial from '$lib/components/MeshLineMaterial.svelte'
    import MeshLineGeometry from '$lib/components/MeshLineGeometry.svelte'
    import { Group } from '@tweenjs/tween.js'

    export let gameData: GameData

    const avoidArray: AvoidObject[] = []

    let cursorPosition: Vector3 = new Vector3(0, 0, 0)



    
    let lines: {points:Vector3[],offsetX:number,offsetZ:number,color:string, width:number}[] = []

    const genratePoints = () => {
//['#e09f7d', '#ef5d60', '#ec4067', '#a01a7d', '#311847']
        ['#e09f7d', '#ef5d60', '#ec4067', '#a01a7d', '#311847'].forEach((color, i) => {
            let newLine = {
                points: [],
                offsetX: randomNumber(-0.5,0.5),
                offsetZ: randomNumber(-0.5,0.5),
                color: color,
                width: 0.3 + (i / 5)
            } as any
            for (let j = 0; j < 0; j++) {
                newLine.points.push(new Vector3(0, 0, 0))
            }
            lines.push(newLine)
        })

        console.log(lines)
        
      //  points.push(new Vector3(0, 0, 0))
        // const curve = new CatmullRomCurve3(p)
        // points = curve.getPoints(240)
    }


    genratePoints()

    let spring1 = spring({ x: 0, z: 0 }, {
		stiffness: 0.02,
		damping: 0.25
	})
    let spring2 = spring({ x: 0, z: 0 }, {
		stiffness: 0.04,
		damping: 0.15
	});
    let spring3 = spring({ x: 0, z: 0 }, {
		stiffness: 0.06,
		damping: 0.1
	});
    let spring4 = spring({ x: 0, z: 0 }, {
		stiffness: 0.08,
		damping: 0.1
	});
    let spring5 = spring({ x: 0, z: 0 }, {
		stiffness: 0.1,
		damping: 0.1
	});


    onMount(() => {})
     


    useFrame((context, delta) => {

    for (let i = 0; i < lines.length; i++) {
        for (let j = 0; j < lines[i].points.length; j++) {
            if(j===0) {
               
               // lines[i].points[j].copy(cursorPosition)
               // lines[i].points[j].x += lines[i].offsetX
               // lines[i].points[j].z += lines[i].offsetZ
            } else {
                lines[i].points[j].lerp(lines[i].points[j - 1], 0.7)
            }

        }
    }

        lines=lines


    })

    $ : {
        lines[0].points[0].x = $spring1.x
        lines[0].points[0].z = $spring1.z
        lines[1].points[0].x = $spring2.x
        lines[1].points[0].z = $spring2.z
        lines[2].points[0].x = $spring3.x
        lines[2].points[0].z = $spring3.z
        lines[3].points[0].x = $spring4.x
        lines[3].points[0].z = $spring4.z
        lines[4].points[0].x = $spring5.x
        lines[4].points[0].z = $spring5.z
    }

   

</script>

<!--
<T.Group position={[cursorPosition.x,cursorPosition.y,cursorPosition.z]}>
    {#each lines as line,i}
        <T.Mesh rotation.z={i} position.z={i*1.2} >
            <MeshLineGeometry {points} shape={'taper'} />
            <MeshLineMaterial {opacity} width={0.2} transparent />
        </T.Mesh>
    {/each}
</T.Group> -->
{#each lines as line, i}
<T.Mesh position.y={1.5 - (i/4)}>
    <MeshLineGeometry points={line.points} shape={'taper'} />
    <MeshLineMaterial width={line.width} transparent color={line.color} scaleOut={0.01} />
</T.Mesh>
{/each}

<T.Mesh position={[$spring1.x, 2, $spring1.z]} visible={false} >
    <T.BoxGeometry args={[1, 1, 1]} />
    <T.MeshToonMaterial color="#ffcbd2" />
</T.Mesh>
<T.Mesh position={[0.5, -0.01, 0.5]} name="ground" receiveShadow on:pointermove={(e) => {
        cursorPosition.x = e.point.x;
        cursorPosition.z = e.point.z
        spring1.set({x:e.point.x,z:e.point.z})
        spring2.set({x:e.point.x,z:e.point.z})
        spring3.set({x:e.point.x,z:e.point.z})
        spring4.set({x:e.point.x,z:e.point.z})
        spring5.set({x:e.point.x,z:e.point.z})
    }}>
    <T.BoxGeometry args={[20, 0.01, 20]} />
    <T.MeshToonMaterial color="#6d6875" />
</T.Mesh>

<T.AmbientLight intensity={1} />
<!--
<Floor {avoidArray} startingPosition={{ x: 0, z: 0 }} startingRotation={{ x: 0, z: -1 }} levelSize={{ x: 20, z: 20 }} />-->
