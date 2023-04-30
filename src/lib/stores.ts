import { writable } from 'svelte/store';

export const gameState = writable({

    dev : {
        status: true,
        camera : false,
        grid : false,
        avoidObjactsVisible: false
    },
    scene : 1,
    moveLock : false,
    speakingCharacterPosition : {x:0,y:0,z:0},
    inventory : {
        open : false,
        cardboardBox : {
            owned : false,
            equipped : false
        },
        bacchaeMask : {
            owned : false,
            equipped : false
        }
    },
    settings : {
        open : false,
        lowerRes : false
    }
    


})

export const gamePosition = writable({x:0,y:0,z:0});

export const gameMessage = writable('Game loaded');

export const gameConversation = writable([0,0]);