import { writable } from 'svelte/store';

export const selectedGridSpace = writable({ x: 2, y : 0, z: 2});

export const playerPosition = writable({ x: 1, y : 0, z: 1});

export const playerAnimation = writable('idle');

export const cameraPosition = writable({ x: 10, z: 10, y : 10})
export const playerRotation = writable(0)

