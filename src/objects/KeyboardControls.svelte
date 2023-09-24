<script lang="ts">
    import type { PlayerState } from '$lib/types'
    import { getFurthestWalkableGridSquare } from '$lib/util'
    export let playerState: PlayerState

    export let levelSize: any
    export let avoidObjects: any

    let currentlyPressedKeys: any = []
    let keyMovementDirection = ''
    let previousKeyMovementDirection = ''

    function setKeyDirection() {
        if (playerState.path.length > 1) return
        playerState.path.length = 0
        previousKeyMovementDirection = keyMovementDirection
        let direction = { x: 0, z: 0 }
        let redirectSquare = { x: Math.floor(playerState.position.x), z: Math.floor(playerState.position.z) }
        if (playerState.running) {
            redirectSquare = changeDirection()
        }
        // ignore conflicting keypresses
        if (
            (currentlyPressedKeys.includes('w') && currentlyPressedKeys.includes('s')) ||
            (currentlyPressedKeys.includes('a') && currentlyPressedKeys.includes('d'))
        ) {
            return
        }
        if (currentlyPressedKeys.includes('w') && currentlyPressedKeys.includes('d')) {
            direction = { x: redirectSquare.x, z: redirectSquare.z - 1 }
            keyMovementDirection = 'upRight'
        } else if (currentlyPressedKeys.includes('d') && currentlyPressedKeys.includes('s')) {
            direction = { x: redirectSquare.x + 1, z: redirectSquare.z }
            keyMovementDirection = 'downRight'
        } else if (currentlyPressedKeys.includes('s') && currentlyPressedKeys.includes('a')) {
            direction = { x: redirectSquare.x, z: redirectSquare.z + 1 }
            keyMovementDirection = 'downLeft'
        } else if (currentlyPressedKeys.includes('a') && currentlyPressedKeys.includes('w')) {
            direction = { x: redirectSquare.x - 1, z: redirectSquare.z }
            keyMovementDirection = 'upLeft'
        } else if (currentlyPressedKeys.includes('w')) {
            direction = { x: redirectSquare.x - 1, z: redirectSquare.z - 1 }
            keyMovementDirection = 'up'
        } else if (currentlyPressedKeys.includes('d')) {
            direction = { x: redirectSquare.x + 1, z: redirectSquare.z - 1 }
            keyMovementDirection = 'right'
        } else if (currentlyPressedKeys.includes('s')) {
            direction = { x: redirectSquare.x + 1, z: redirectSquare.z + 1 }
            keyMovementDirection = 'down'
        } else if (currentlyPressedKeys.includes('a')) {
            direction = { x: redirectSquare.x - 1, z: redirectSquare.z + 1 }
            keyMovementDirection = 'left'
        }
        let destiantionSquare = getFurthestWalkableGridSquare(redirectSquare, direction, levelSize, avoidObjects)
        if (!destiantionSquare) return
        if (previousKeyMovementDirection.length < 1) previousKeyMovementDirection = keyMovementDirection
        playerState.path.push(destiantionSquare)
    }

    function changeDirection(usePrevKey: boolean = true) {
        let redirectSquare = { x: 0, z: 0 }
        let k = usePrevKey ? previousKeyMovementDirection : keyMovementDirection
        let floor = { x: Math.floor(playerState.position.x), z: Math.floor(playerState.position.z) }
        let ceil = { x: Math.ceil(playerState.position.x), z: Math.ceil(playerState.position.z) }
        if (k === 'up' || k === 'upRight' || k === 'upLeft') {
            redirectSquare = { x: floor.x, z: floor.z }
        }
        if (k === 'down' || k === 'downRight' || k === 'downLeft') {
            redirectSquare = { x: ceil.x, z: ceil.z }
        }
        if (k === 'left') {
            redirectSquare = { x: floor.x, z: ceil.z }
        }
        if (k === 'right') {
            redirectSquare = { x: ceil.x, z: floor.z }
        }
        if (redirectSquare) {
            playerState.path.push(redirectSquare)
        }
        return redirectSquare
    }

    function onKeyDown(e: KeyboardEvent) {
        if (e.key === 'w' || e.key === 'd' || e.key === 's' || e.key === 'a') {
            if (playerState.movementType === 'mouse') return
            if (!currentlyPressedKeys.includes(e.key)) {
                currentlyPressedKeys.push(e.key)
                if (playerState.comingToAStop) return
                playerState.movementType = 'keyboard'
                setKeyDirection()
            }
        }
    }

    function onKeyUp(e: KeyboardEvent) {
        if (e.key === 'w' || e.key === 'd' || e.key === 's' || e.key === 'a') {
            if (playerState.movementType === 'mouse') return
            currentlyPressedKeys = currentlyPressedKeys.filter((i: string) => i !== e.key)
            if (playerState.comingToAStop) return
            playerState.path.length = 0
            if (currentlyPressedKeys.length > 0) {
                setKeyDirection()
            } else {
                // need to come to a stop
                changeDirection(false)
                playerState.comingToAStop = true
            }
        }
    }
</script>

<svelte:window on:keydown={onKeyDown} on:keyup={onKeyUp} />
