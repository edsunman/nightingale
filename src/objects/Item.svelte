<script lang="ts">
    import { gamePosition, gameMessage, gameState } from '$lib/stores'
    import { items } from '$lib/items'
    import { T } from '@threlte/core'
    import { useCursor } from '$lib/util/useCursor'
    import { useGltf, useTexture } from '@threlte/extras'
    import { SRGBColorSpace, Group } from 'three'

    export let id: number
    export let position: { x: number; y: number; z: number }
    export let url : string
    //export let lightIntensity = 0

    const gltf = useGltf(url, { useDraco: true })
    const texture = useTexture('/texture/objectAtlas.png')

    export const ref = new Group()

    let owned = false
    const item = items.find((x) => x.id === id)

    const { onPointerEnter, onPointerLeave } = useCursor()

    $: isOwned($gameState)

    function isOwned(gs: any) {
        gs.inventory.owned.includes(item?.id) ? (owned = false) : (owned = true)
    }

    function itemClicked(e: any) {
        const player = $gamePosition
        if (player.x >= position.x - 1 && player.x <= position.x + 1 && player.z >= position.z - 1 && player.z <= position.z + 1) {
            let itemId = 0
            if (item?.id) itemId = item?.id
            $gameState.inventory.owned.push(itemId)
            $gameState = $gameState
            $gameMessage = 'You picked up a ' + item?.name
           // $gameState.selectedItemId = itemId
            //$gameState.itemDescription.open = true
            //$gameState.moveLock = true
        } else {
            $gameMessage = item?.message ?? ''
        }
    }
</script>

{#if owned === true}
    <T is={ref} position={[position.x, position.y, position.z]} dispose={false} {...$$restProps} >
        {#await gltf}
            <slot name="fallback" />
        {:then gltf}
            <T.Mesh
                castShadow
                on:pointerenter={onPointerEnter}
                on:pointerleave={onPointerLeave}
                on:click={(e) => {
                    e.stopPropagation()
                    itemClicked(e)
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
