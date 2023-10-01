<script lang="ts">
    import { gameScene, gameMessage, gamePosition, gameState, gameOutlineObjects, gameInteractSquare } from '$lib/stores'
    import { T, useThrelte } from '@threlte/core'
    import { useCursor } from '$lib/useCursor'
    import { useGltf, useTexture } from '@threlte/extras'
    import { SRGBColorSpace } from 'three'
    import { calculateDistanceBetweenPoints } from '$lib/util'

    export let position: [x: number, y: number, z: number]
    export let nextScenePosition = { x: 0, z: 0 }
    export let activeSquare = { x: 0, z: 0 }
    export let scene: number
    export let key: number = 0
    export let url: string
    export let message: string = 'A door'
    export let nodeName: string = 'Mesh'

    const gltf = useGltf(url, { useDraco: true })
    const texture = useTexture('/texture/objectAtlas.png')

    const threlte = useThrelte()
    const { onPointerEnter, onPointerLeave } = useCursor(...[, ,], threlte.renderer?.domElement, 'cursorHover')

    let doorMesh: any

    $: checkInteractSquare($gameInteractSquare)

    function checkInteractSquare(interactSquare: any) {
        if (calculateDistanceBetweenPoints(interactSquare, { x: position[0], z: position[2] }) < 1) {
            doorClicked()
        }
    }

    function doorClicked() {
        if ($gamePosition.x === activeSquare.x && $gamePosition.z === activeSquare.z && !$gameState.moveLock) {
            if (key > 0) {
                if ($gameState.inventory.owned.includes(key) || $gameState.inventory.equipped === 1) {
                    openDoor()
                } else {
                    $gameMessage = { message: 'The door is locked', type: 0 }
                }
            } else {
                openDoor()
            }
        } else {
            $gameMessage = { message: message, type: 0 }
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
    <T.Mesh
        bind:ref={doorMesh}
        {...$$restProps}
        {position}
        castShadow
        geometry={gltf.nodes[nodeName].geometry}
        scale={0.45}
        on:create={({ ref, cleanup }) => {
            gameOutlineObjects.setup(ref)
            cleanup(() => {
                gameOutlineObjects.remove(ref.uuid)
            })
        }}
    >
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
    position={[position[0], 1.3, position[2]]}
    on:click={(e) => {
        e.stopPropagation()
        doorClicked()
    }}
    on:pointerenter={(e) => {
        onPointerEnter()
        $gameOutlineObjects.push(doorMesh)
        $gameOutlineObjects = $gameOutlineObjects
    }}
    on:pointerleave={(e) => {
        onPointerLeave()
        $gameOutlineObjects.length = 0
    }}
>
    <T.BoxGeometry args={[1, 1.3, 0.1]} />
    <T.MeshStandardMaterial color="hotpink" />
</T.Mesh>
