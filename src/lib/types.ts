

export type PlayerState = {
        position: {x: number, z: number}
        rotation: {x: number, z: number},
        annimation : string,
        path : Array<{ x: number, z: number }>,
        arrived: boolean,
        settingOff: boolean,
        floorType : string,
        running : boolean
    }

export type Script = Array<{
    name: string,
    speech :Array<{
        id: number,
        text: string,
        options?: Array<{
            text: string,
            linkId? : number,
            item?: number
        }>
    }>,
}>