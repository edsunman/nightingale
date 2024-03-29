import { writable } from 'svelte/store'

import type { Writable } from 'svelte/store'
import type { GameState } from './types'

export const gameState: Writable<GameState> = writable({
    dev: {
        status: false,
        camera: false,
        grid: false,
        avoidObjectsVisible: false,
        avoidObjectsPlaceable: false
    },
    nextScenePosition: { x: 0, z: 0 },
    moveLock: false,
    mainMenu: true,
    showHud: true,
    inventory: {
        open: false,
        equipped: 0,
        owned: [],
        secretKeys: []
    },
    settings: {
        open: false,
        fullScreen: false,
        postProcessing: false
    },
    itemDescription: {
        open: false
    },
    seenSpeech: [],
    selectedConvoOptions: [],
    selectedItemId: 0,
    charctersSpokenWith: [0],
    volumePreference: 0,
    areasEntered: [],
    objectivesShown: [],
    objectivesComplete: [],
    gameOver: false,
    padConnected: false
})

export const gameScene = writable(1)
export const gamePosition = writable({ x: 0, z: 0 })
export const gameCameraPosition = writable({ x: 0, z: 0 })
export const gameMovingTo = writable({ x: 0, z: 0 })
export const gameSelectedCharacterPosition = writable({ x: 0, y: 0, z: 0 })
export const gameMessage = writable({ message: '', type: 0 }) // 0 : default, 1 : objective, 2 : item
export const gameConversation = writable([0, 0])
export const gameVolume = writable(0)
export const gamePixelRatio = writable(1)
export const gameLoaded = writable(false)
export const gameZoom = writable(80)
export const gameInteractSquare = writable({ x: 0, z: 0 })
export const gamePadState = writable({ up: 0, down: 0, left: 0, right: 0, clusterBottom: 0, clusterRight: 0 })

function createOutlineObjects() {
    const { subscribe, set, update }: Writable<any[]> = writable([])
    let objects: any[] = []
    return {
        subscribe,
        set: (n: any) => set(n),
        update: (n: any) => update(n),
        setup: (n: any) => objects.push(n),
        showAll: () => {
            objects.slice()
            set(objects.slice())
        },
        remove: (uuid: string) => {
            objects = objects.filter((object) => object.uuid !== uuid)
        }
    }
}

export const gameOutlineObjects = createOutlineObjects()
