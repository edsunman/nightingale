import { writable } from 'svelte/store';

export const gameState = writable({

    dev : {
        status: false,
        camera : false,
        grid : false,
        avoidObjactsVisible: false
    },
    scene : 1,
    moveLock : false,
    inConvo : false,
    conversationState : [0,0],
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