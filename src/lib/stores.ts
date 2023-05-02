import { writable } from 'svelte/store';

export const gameState = writable({

    dev : {
        status: false,
        camera : false,
        grid : false,
        avoidObjactsVisible: true
    },
    scene : 1,
    moveLock : false,
    inventory : {
        open : false,
        equipped: 0,
        owned : [1]
    },
    settings : {
        open : false,
        lowerRes : false
    }
    


})

export const gamePosition = writable({x:0,y:0,z:0});

export const gameSelectedCharacterPosition = writable({x:0,y:0,z:0});

export const gameMessage = writable('Game loaded');

export const gameConversation = writable([0,0]);