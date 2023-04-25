import { writable } from 'svelte/store';

export const gameState = writable({

    dev : {
        camera : false,
        grid : false,
        avoidObjactsVisible: false
    },
    scene : 1,
    inventory : {}


})
