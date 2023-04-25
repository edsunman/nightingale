<script lang="ts">
    import { gameState } from '$lib/stores';
    import { T } from '@threlte/core';
    import { Grid  } from '@threlte/extras';
    import Player from './Player.svelte'
    import * as THREE from 'three';

    import type { PlayerState } from '$lib/types';

    let playerState : PlayerState = { 
        position: { x: 4, y:0 , z:0}, 
        rotation: 0 , 
        annimation : 'idle',
        path: [],
        arrived:false,
        settingOff:true
    };

    const levelSize = 100;

    let direction = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();
    let selectedGridSpace : {x: number, y: number, z: number} = {x:0,y:0,z:0}; 
    let avoidObjects : any[] = [];

    let avoidArray :  Array<{ x: number, z: number }> =
        [{x: 2, z:2 },{x: 2, z:3 },{x: 2, z:4 },{x: -6, z:-4 },{x: -5, z:-5 },{x: -4, z:-6 },{x: 5, z:3 },{x: 6, z:2 },{x: 7, z:1 },
        {x:-5,z:-4},{x:-4,z:-5}];

    

    function floorClicked(e:any){

        const p = playerState.position

        playerState.path = [];

        if (e.intersections[0].eventObject.name==="floor"){

            const point = e.intersections[0].point;
            const grid = { x : Math.round(point.x), z : Math.round(point.z)}


            const gridVec = new THREE.Vector3(grid.x,0,grid.z );
            const playerVec = new THREE.Vector3(p.x, 0, p.z);
            
            direction.subVectors(  gridVec, playerVec ).normalize();
            raycaster.set(playerVec, direction)

            const intersects = raycaster.intersectObjects( avoidObjects, false );
            const dist = Math.sqrt((grid.x - playerVec.x) ** 2 + (grid.z - playerVec.z) ** 2);
        
            if(intersects.length>0){ // pointing towards wall

                // move towards wall and stop
                const ip = intersects[0].point;
                let gridIp = {x:0,z:0}

                if(p.x<ip.x){
                    gridIp.x = Math.round(ip.x-0.5)
                } else if (p.x>ip.x) {
                    gridIp.x = Math.round(ip.x+0.5)
                } else {
                    gridIp.x = Math.round(ip.x)
                }

                if(p.z<ip.z){
                    gridIp.z = Math.round(ip.z-0.5)
                } else if (p.z>ip.z) {
                    gridIp.z = Math.round(ip.z+0.5)
                } else {
                    gridIp.z = Math.round(ip.z)
                }

                if( intersects[0].distance > dist ) {                               
                    playerState.path.push({ x: grid.x, z: grid.z });              
                } else {         
                    playerState.path.push({ x: gridIp.x, z: gridIp.z });
                }

            } else {               
                playerState.path.push({ x: grid.x, z: grid.z });             
            }

            selectedGridSpace = { x: grid.x, y: 0, z: grid.z };
            playerState.settingOff = true;
            
        }
    }
    
</script>

<Player playerState={playerState}  />

<T.Mesh position={[0.5, -0.01, 0.5]} visible={false} name="floor" receiveShadow  on:click={(e) => floorClicked(e)} > 
  <T.BoxGeometry  args={[levelSize, 0.01, levelSize]}   />
  <T.MeshStandardMaterial color="#705f47" />
</T.Mesh>

{#each avoidArray as block}
    <T.Mesh name={"avoid object"} scale={[1,1,1]} visible={$gameState.dev.avoidObjactsVisible} position={[block.x, 0, block.z]}  on:create={({ ref }) => { avoidObjects.push(ref) }}>
        <T.BoxGeometry args={[1, 0.1, 1]} />
        <T.MeshStandardMaterial color="#161616" />
    </T.Mesh>
{/each}

<!-- Selected grid square -->
<T.Mesh  receiveShadow visible={false}
    scale={[1,1,1]}
    position={[selectedGridSpace.x, selectedGridSpace.y, selectedGridSpace.z]}>
  <T.BoxGeometry args={[1, 0.05, 1]} />
  <T.MeshStandardMaterial color="MediumSlateBlue" />
</T.Mesh>

{#if $gameState.dev.grid}
<Grid
    visible={true}
    position={[0.5,0.001,0.5]}
    cellColor="#ffffff"
    sectionColor="#ffffff"
    sectionThickness={0}
    fadeDistance={25}
    cellSize={1}
    gridSize={[levelSize, levelSize]}
/>
{/if}