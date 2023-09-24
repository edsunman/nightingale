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
    movementType: 'mouse' | 'keyboard' | 'none'
    comingToAStop: boolean
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
    giveItem?: number | null
    hideItem?: number | null
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
    mainMenu: boolean
    showHud: boolean
    inventory: {
        open: boolean
        equipped: number
        owned: Array<number>
    }
    settings: {
        open: boolean
        fullScreen: boolean
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
    objectivesShown: Array<number>
    objectivesComplete: Array<number>
    gameOver: boolean
}

export type AvoidObject = { x: number; z: number; scaleX?: number; scaleZ?: number }

export type InstanceObject = {
    name: string
    scale_x: number
    scale_y: number
    scale_z: number
    instances: {
        position_x: number
        position_y: number
        position_z: number
        rotation_x: number
        rotation_y: number
        rotation_z: number
    }[]
    receiveShadow: number
    noClickThrough: number
    material?: string
}

export type Category = {
    name: string
    url: string
    objects: InstanceObject[]
}

export type GameData = {
    name: string
    scenes: Scene[]
    characters: Character[]
}

export type Block = {
    id: number
    position_x: number
    position_z: number
    scale_x: number
    scale_z: number
    scene_id: number
}
export type Scene = {
    id: number
    name: string
    levelSize_x: number
    levelSize_z: number
    floorSize_x: number
    floorSize_z: number
    floorColor: string
    startingPosition_x: number
    startingPosition_z: number
    startingRotation_x: number
    startingRotation_z: number
    sunIntensity: number
    floorType: string
    categories: Category[]
    objects: InstanceObject[]
    blocks: Block[]
}
