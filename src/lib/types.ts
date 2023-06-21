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

export type Script = Array<{
    name: string
    characterId: number
    speech: Array<{
        id: number
        text: string
        options?: Array<{
            text: string
            linkId?: number
            item?: number
            receiveItem?: number
        }>
    }>
}>

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
    dev : {
        status : boolean
        camera: boolean
        grid: boolean
        avoidObjactsVisible: boolean
    }
    nextScenePosition: { x: number, z: number }
    moveLock: boolean
    inventory: {
        open: boolean
        equipped: number
        owned: Array<number>
    }
    settings: {
        open: boolean
    },
    itemDescription: {
        open: boolean
    },
    selectedItemId: number
    charctersSpokenWith : Array<number>,
    volumePreference : number

}