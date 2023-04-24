import { writable } from 'svelte/store';

export const gameState = writable({

    devMode : true,
    devCamera : false,
    inventory : {}


})
