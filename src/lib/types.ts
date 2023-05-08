

export type PlayerState = {
        position: {x: number, z: number}
        rotation: {x: number, z: number},
        annimation : string,
        path : Array<{ x: number, z: number }>,
        arrived: boolean,
        settingOff: boolean,
        floorType : string
    }