<script lang="ts">
    import type { PlayerState } from '$lib/types'
    import { gameState, gameOutlineObjects, gameInteractSquare } from '$lib/stores'
    import { getFurthestWalkableGridSquare, checkColission, isSquareOutsideLevel } from '$lib/util'
    import { useGamePad } from '$lib/hooks/useGamePad'
    import { useFrame } from '@threlte/core'
    export let playerState: PlayerState

    export let levelSize: any
    export let avoidObjects: any

    let currentlyPressedKeys: string[] = []
    let keysToRemove: string[] = []
    let keyDownTimer = 0
    let keysPushed = false
    let stickDirection = ''
    let movingDirection = ''

    const { lx, ly, cross, square } = useGamePad()

    const stickMoved = (lx: number, ly: number) => {
        if ($gameState.moveLock) return
        if (lx > 0.5 || lx < -0.5 || ly > 0.5 || ly < -0.5) {
            const r = Math.atan2(lx, -ly)
            if (r > -0.39 && r < 0.39) {
                stickDirection = 'up'
            } else if (r > 0.39 && r < 1.17) {
                stickDirection = 'upRight'
            } else if (r > 1.17 && r < 1.96) {
                stickDirection = 'right'
            } else if (r > 1.96 && r < 2.74) {
                stickDirection = 'downRight'
            } else if (r > 2.74 || r < -2.74) {
                stickDirection = 'down'
            } else if (r > -2.74 && r < -1.96) {
                stickDirection = 'downLeft'
            } else if (r > -1.96 && r < -1.17) {
                stickDirection = 'left'
            } else if (r > -1.17 && r < -0.39) {
                stickDirection = 'upLeft'
            }
        } else {
            stickDirection = ''
        }
    }

    $: stickMoved($lx, $ly)

    const keyPressed = (k: string[]) => {
        if ($gameState.moveLock) return
        // ignore conflicting keypresses
        if ((k.includes('w') && k.includes('s')) || (k.includes('a') && k.includes('d'))) {
            return
        }
        if (k.includes('w') && k.includes('d')) {
            stickDirection = 'upRight'
        } else if (k.includes('d') && k.includes('s')) {
            stickDirection = 'downRight'
        } else if (k.includes('s') && k.includes('a')) {
            stickDirection = 'downLeft'
        } else if (k.includes('a') && k.includes('w')) {
            stickDirection = 'upLeft'
        } else if (k.includes('w')) {
            stickDirection = 'up'
        } else if (k.includes('d')) {
            stickDirection = 'right'
        } else if (k.includes('s')) {
            stickDirection = 'down'
        } else if (k.includes('a')) {
            stickDirection = 'left'
        } else {
            stickDirection = ''
        }
    }

    $: keyPressed(currentlyPressedKeys)

    $: {
        if ($square === 1) {
            toggleOutlines()
        } else if ($square === 0) {
            toggleOutlines(false)
        }
    }

    $: {
        if ($cross === 1) {
            interact()
        }
    }

    function getDirectionSquare(direction: string) {
        let directionSquare = { x: 0, z: 0 }
        let playerSquare = { x: Math.round(playerState.position.x), z: Math.round(playerState.position.z) }
        switch (direction) {
            case 'up':
                directionSquare = { x: playerSquare.x - 1, z: playerSquare.z - 1 }
                break
            case 'down':
                directionSquare = { x: playerSquare.x + 1, z: playerSquare.z + 1 }
                break
            case 'left':
                directionSquare = { x: playerSquare.x - 1, z: playerSquare.z + 1 }
                break
            case 'right':
                directionSquare = { x: playerSquare.x + 1, z: playerSquare.z - 1 }
                break
            case 'upLeft':
                directionSquare = { x: playerSquare.x - 1, z: playerSquare.z }
                break
            case 'upRight':
                directionSquare = { x: playerSquare.x, z: playerSquare.z - 1 }
                break
            case 'downLeft':
                directionSquare = { x: playerSquare.x, z: playerSquare.z + 1 }
                break
            case 'downRight':
                directionSquare = { x: playerSquare.x + 1, z: playerSquare.z }
                break
        }
        return { playerSquare, directionSquare }
    }

    function toggleOutlines(show: boolean = true) {
        if (show) {
            gameOutlineObjects.showAll()
        } else {
            $gameOutlineObjects.length = 0
        }
    }

    function interact() {
        if (!$gameState.moveLock) {
            $gameInteractSquare = playerState.position
        }
    }

    function onKeyDown(e: KeyboardEvent) {
        if ($gameState.moveLock) return
        if (e.key === 'w' || e.key === 'd' || e.key === 's' || e.key === 'a') {
            if (playerState.movementType === 'mouse') return
            if (!currentlyPressedKeys.includes(e.key)) {
                currentlyPressedKeys.push(e.key)
                currentlyPressedKeys = currentlyPressedKeys
            }
        }
        if (e.key === 'q') {
            toggleOutlines()
        }
    }

    function onKeyUp(e: KeyboardEvent) {
        if ($gameState.moveLock) return
        if (!e.repeat) {
            if (e.key === 'w' || e.key === 'd' || e.key === 's' || e.key === 'a') {
                if (playerState.movementType === 'mouse') return
                //currentlyPressedKeys = currentlyPressedKeys.filter((i: string) => i !== e.key)
                keysToRemove.push(e.key)
                keysToRemove = keysToRemove
                keyDownTimer = 0
                keysPushed = false
            }
            if (e.key === 'q') {
                toggleOutlines(false)
            }
            if (e.key === 'e') {
                interact()
            }
        }
    }

    useFrame((_, delta) => {
        if (!keysPushed) {
            // slight delay when releasing keys to allow batching
            keyDownTimer += delta
            if (keyDownTimer > 0.05) {
                keysToRemove.forEach((key) => {
                    currentlyPressedKeys = currentlyPressedKeys.filter((i: string) => i !== key)
                })
                keysToRemove.length = 0
                keysPushed = true
            }
        }
        if (playerState.movementType === 'mouse') return
        if (stickDirection !== '') {
            if (!playerState.running) {
                // need to start moving
                const { directionSquare, playerSquare } = getDirectionSquare(stickDirection)
                playerState.path.length = 0
                playerState.path.push(getFurthestWalkableGridSquare(playerSquare, directionSquare, levelSize, avoidObjects))
                movingDirection = stickDirection
                playerState.comingToAStop = false
                playerState.movementType = 'keyboard'
            } else if (playerState.running && movingDirection !== stickDirection) {
                // need to change direction
                const { directionSquare, playerSquare } = getDirectionSquare(stickDirection)
                playerState.path.length = 0
                const squareToMoveTo = getFurthestWalkableGridSquare(playerSquare, directionSquare, levelSize, avoidObjects)
                playerState.path.push(squareToMoveTo)
                movingDirection = stickDirection
                playerState.comingToAStop = false
            }
        } else {
            if (playerState.running && !playerState.comingToAStop && playerState.movementType === 'keyboard') {
                // need to come to a stop
                const { directionSquare, playerSquare } = getDirectionSquare(movingDirection)
                playerState.path.length = 0
                const { hit } = checkColission(playerSquare, directionSquare, avoidObjects)
                if (isSquareOutsideLevel(directionSquare, levelSize) || hit) {
                    // ouside level or againt block so let's push nearest square
                    playerState.path.push(playerSquare)
                } else {
                    playerState.path.push(directionSquare)
                }
                playerState.comingToAStop = true
            }
        }
    })
</script>

<svelte:window on:keydown={onKeyDown} on:keyup={onKeyUp} />
