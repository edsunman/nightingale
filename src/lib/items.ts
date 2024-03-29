import type { Item } from './types'

export const items: Item[] = [
    {
        id: 1,
        name: 'Cardboard box',
        message: 'A cardboard box',
        image: 'cardboardBox.svg',
        description: 'A Cardboard Box!?',
        isSecretKey: false
    },
    {
        id: 2,
        name: 'Fuel cell',
        message: 'A fuel cell',
        image: 'fuelCell.svg',
        description: 'A powerful energy store used to power spacecraft',
        isSecretKey: false
    },
    {
        id: 3,
        name: 'Old Medal',
        message: '',
        image: 'medal.svg',
        description: 'An old, tattered relic of only sentimental value',
        isSecretKey: false
    } /*{
        id: 4,
        name: "Keycard",
        message: "",
        image: "cardboardBox.svg",
        description: "",
        isSecretKey:false
    },
    {
        id: 5,
        name: "Mask",
        message: "A mask",
        image: "cardboardBox.svg",
        description : "",
        isSecretKey:false
    },*/,

    // SECRET KEYS

    {
        id: 101,
        name: '',
        message: '',
        image: '',
        description: 'major gives advice to talk to door guard',
        isSecretKey: true
    },
    {
        id: 102,
        name: '',
        message: '',
        image: '',
        description: 'permission to enter store',
        isSecretKey: true
    },
    {
        id: 103,
        name: '',
        message: '',
        image: '',
        description: 'told about store',
        isSecretKey: true
    },
    {
        id: 104,
        name: '',
        message: '',
        image: '',
        description: 'entered store',
        isSecretKey: true
    },
    {
        id: 105,
        name: '',
        message: '',
        image: '',
        description: 'spoken to hologram',
        isSecretKey: true
    },
    {
        id: 106,
        name: '',
        message: '',
        image: '',
        description: 'game started',
        isSecretKey: true
    }
]
