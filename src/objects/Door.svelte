<script lang="ts">
    import { gameScene, gameMessage, gamePosition, gameState } from '$lib/stores'
    import { T } from '@threlte/core'
    import { useCursor } from '$lib/util/useCursor'
    import { useGltf } from '@threlte/extras'

    export let position : [x:number,y:number,z:number]
    export let nextScenePosition = { x: 0, z: 0 }
    export let activeSquare = { x: 0, z: 0 }
    export let scene: number
    export let key: number = 0

    const gltf = useGltf('/tech_door-transformed.glb', { useDraco: true })

    const { onPointerEnter, onPointerLeave } = useCursor()

    function openDoor() {
        $gameState.nextScenePosition = nextScenePosition
        $gameScene = scene
    }

    function doorClicked(e: any) {
        if ($gamePosition.x === activeSquare.x && $gamePosition.z === activeSquare.z) {
            if (key > 0) {
                if ($gameState.inventory.owned.includes(key)) {
                    openDoor()
                } else {
                    $gameMessage = 'The door is locked'
                }
            } else {
                openDoor()
            }
        } else {
            $gameMessage = 'A door'
        }
    }
</script>

{#await gltf}
    <slot name="fallback" />
{:then gltf}
    <T.Mesh {...$$restProps} {position} castShadow geometry={gltf.nodes.Mesh.geometry} scale={[0.5, 1, 0.05]} />
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
