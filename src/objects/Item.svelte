<script lang="ts">
    import { gamePosition, gameMessage, gameState, gameOutlineObjects, gameInteractSquare } from '$lib/stores'
    import { items } from '$lib/items'
    import { T, useThrelte } from '@threlte/core'
    import { useCursor } from '$lib/useCursor'
    import { useGltf, useTexture } from '@threlte/extras'
    import { SRGBColorSpace, Group } from 'three'
    import { calculateDistanceBetweenPoints } from '$lib/util'

    export let id: number
    export let position: { x: number; y: number; z: number }
    export let url: string
    //export let lightIntensity = 0

    const gltf = useGltf(url, { useDraco: true })
    const texture = useTexture('/texture/objectAtlas.png')

    export const ref = new Group()

    let owned = false
    const item = items.find((x) => x.id === id)

    const threlte = useThrelte()
    const { onPointerEnter, onPointerLeave } = useCursor(...[, ,], threlte.renderer?.domElement, 'cursorHover')

    $: isOwned($gameState)

    function isOwned(gs: any) {
        gs.inventory.owned.includes(item?.id) ? (owned = true) : (owned = false)
    }

    $: checkInteractSquare($gameInteractSquare)

    function checkInteractSquare(interactSquare: any) {
        if (!owned) {
            console.log(calculateDistanceBetweenPoints(interactSquare, { x: position.x, z: position.z }))
            if (calculateDistanceBetweenPoints(interactSquare, { x: position.x, z: position.z }) < 2) {
                itemClicked()
            }
        }
    }

    function itemClicked() {
        const player = $gamePosition
        if (player.x >= position.x - 1 && player.x <= position.x + 1 && player.z >= position.z - 1 && player.z <= position.z + 1) {
            let itemId = 0
            if (item?.id) itemId = item?.id
            $gameState.inventory.owned.push(itemId)
            $gameState = $gameState
            $gameMessage = { message: 'You picked up a ' + item?.name, type: 0 }
            owned = true
        } else {
            $gameMessage = { message: '' + item?.message, type: 0 }
        }
    }
</script>

{#if owned === false}
    <T is={ref} position={[position.x, position.y, position.z]} dispose={false} {...$$restProps}>
        {#await gltf}
            <slot name="fallback" />
        {:then gltf}
            <T.Mesh
                castShadow
                on:pointerenter={(e) => {
                    onPointerEnter()
                    $gameOutlineObjects.push(e.object)
                    $gameOutlineObjects = $gameOutlineObjects
                }}
                on:pointerleave={(e) => {
                    onPointerLeave()
                    $gameOutlineObjects.length = 0
                }}
                on:click={(e) => {
                    e.stopPropagation()
                    itemClicked()
                }}
                on:create={({ ref, cleanup }) => {
                    gameOutlineObjects.setup(ref)
                    cleanup(() => {
                        gameOutlineObjects.remove(ref.uuid)
                    })
                }}
                geometry={gltf.nodes.Mesh.geometry}
            >
                {#await texture then t}
                    <T.MeshToonMaterial color="#ffffff">
                        <T is={t} attach="map" flipY={false} colorSpace={SRGBColorSpace} />
                    </T.MeshToonMaterial>
                {/await}
            </T.Mesh>
        {:catch error}
            <slot name="error" {error} />
        {/await}
    </T>

    <!-- <Sparkes position={[position.x,  position.y - 0.5, position.z]} />  -->
{/if}
<!--<T.PointLight position={[position.x, position.y + 0.2, position.z]} distance={4} color={'#00feff'} intensity={owned ? lightIntensity : 0} />  -->
