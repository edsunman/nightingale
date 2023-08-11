export type PlayerState = {
    position: { x: number; z: number }
    rotation: { x: number; z: number }
    annimation: string
    path: Array<{ x: number; z: number }>
    arrived: boolean
    settingOff: boolean
    floorType: string
    running: boolean
    sunIntensity: number
}

export type Script = Array<Character>

export type Character = {
    name: string
    id: number
    speech: Array<Speech>
}

export type Speech = {
    id: number
    text: string
    textRepeat?: string
    linkId?: number
    order?: number
    incidental?: number
    options?: Option[]
}

export type Option = {
    id: number
    text: string
    linkId?: number
    item?: number
    receiveItem?: number
    giveItem?: number
    hideItem?: number    
    alreadyChosen?: boolean
    itemName?: string
}

export type Item = {
    id: number
    name: string
    message: string
    image: string
    description: string
    isSecretKey: boolean
}

export type Items = Item[]

export type GameState = {
    dev: {
        status: boolean
        camera: boolean
        grid: boolean
        avoidObjectsVisible: boolean
        avoidObjectsPlaceable: boolean
    }
    nextScenePosition: { x: number; z: number }
    moveLock: boolean
    inventory: {
        open: boolean
        equipped: number
        owned: Array<number>
    }
    settings: {
        open: boolean
    }
    itemDescription: {
        open: boolean
    }
    seenSpeech: Array<number>
    selectedConvoOptions: Array<number>
    selectedItemId: number
    charctersSpokenWith: Array<number>
    volumePreference: number
    areasEntered: Array<number>
    gameOver: boolean
}

export type AvoidObject = { x: number; z: number; scaleX?: number; scaleZ?: number }
