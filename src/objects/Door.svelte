<script lang="ts">
    import { gameScene, gameMessage, gamePosition, gameState } from '$lib/stores'
    import { T } from '@threlte/core'
    import { useCursor } from '$lib/useCursor'
    import { useGltf, useTexture } from '@threlte/extras'
    import { SRGBColorSpace } from 'three'

    export let position : [x:number,y:number,z:number]
    export let nextScenePosition = { x: 0, z: 0 }
    export let activeSquare = { x: 0, z: 0 }
    export let scene: number
    export let key: number = 0
    export let url : string
    export let message : string = 'A door'

    const gltf = useGltf(url, { useDraco: true })
     const texture = useTexture('/texture/objectAtlas.png')

    const { onPointerEnter, onPointerLeave } = useCursor()

    function doorClicked(e: any) {
        if ($gamePosition.x === activeSquare.x && $gamePosition.z === activeSquare.z && !$gameState.moveLock) {
            if (key > 0) {
                if ($gameState.inventory.owned.includes(key)||$gameState.inventory.equipped===1) {
                    openDoor()
                } else {
                    $gameMessage = 'The door is locked'
                }
            } else {
                openDoor()
            }
        } else {
            $gameMessage = message
        }
    }

    function openDoor() {
        $gameState.nextScenePosition = nextScenePosition
        $gameScene = scene
    }

</script>

{#await gltf}
    <slot name="fallback" />
{:then gltf}
    <T.Mesh {...$$restProps} {position} castShadow geometry={gltf.nodes.Mesh.geometry} scale={0.45} >
      {#await texture then t}
            <T.MeshBasicMaterial color="#ffffff">
                <T is={t} attach="map" flipY={false} colorSpace={SRGBColorSpace} />
            </T.MeshBasicMaterial>
        {/await}
    </T.Mesh>
{:catch error}
    <slot name="error" {error} />
{/await}

<T.Mesh
    visible={false}
    name="door"
    {...$$restProps}
    position={[position[0],1.3,position[2]]} 
    on:click={(e) => {
        e.stopPropagation()
        doorClicked(e)
    }}
    on:pointerenter={onPointerEnter}
    on:pointerleave={onPointerLeave}
>
    <T.BoxGeometry args={[1, 1.3, 0.1]} />
    <T.MeshStandardMaterial color="hotpink" />
</T.Mesh>
