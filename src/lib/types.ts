

export type PlayerState = {
        position: {x: number, y: number, z: number}
        rotation: number,
        annimation : string,
        path : Array<{ x: number, z: number }>,
        arrived: boolean,
        settingOff: boolean
    }