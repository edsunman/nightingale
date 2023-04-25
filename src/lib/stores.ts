import { writable } from 'svelte/store';

export const gameState = writable({

    dev : {
        camera : false,
        grid : true,
        avoidObjactsVisible: true
    },
    scene : 1,
    position : {x:0,y:0,z:0},
    inventory : {}


})
