import { writable } from 'svelte/store'

export const gameState = writable({
    dev: {
        status: true,
        camera: false,
        grid: false,
        avoidObjactsVisible: false
    },
    nextScenePosition: { x: 0, z: 0 },
    moveLock: false,
    inventory: {
        open: false,
        equipped: 0,
        owned: []
    },
    settings: {
        open: false
    },
    itemDescription: {
        open: false
    },
    selectedItemId: 0,
    charctersSpokenWith : [0]
})

export const gamePosition = writable({ x: 0, z: 0 })
export const gameSelectedCharacterPosition = writable({ x: 0, y: 0, z: 0 })
export const gameMessage = writable('')
export const gameConversation = writable([0, 0])
export const gameScene = writable(1)
export const gameVolume = writable(0)
export const gamePixelRatio = writable(1)
