import type { Script } from "./types"

export const script : Script = [
    {
        name: 'Hologram',
        characterId: 1,
        speech: [
            {
                id: 1,
                text: 'Welcome to the outpost . . .'
            },
            {
                id: 1.1,
                text: ". . . we don't often get visitors!",
                options: [
                    {   
                        id: 111,
                        text: 'What is this place?',
                        linkId: 2
                    },
                    {
                        id: 112,
                        text: 'Where can I buy fuel?',
                        linkId: 3
                    },
                    {
                        id: 113,
                        text: 'See ya!'
                    }
                ]
            },
            {
                id: 2,
                text: 'This is the last outpost before Thrace.',
                options: [
                    {
                        id: 121,
                        text: 'Oh cool',
                        linkId: 4
                    }
                ]
            },
            {
                id: 3,
                text: 'You could try the merchant in the church.',
                options: [
                    {
                        id : 131,
                        text: "Ok I'll check it out.",
                        linkId: 4
                    }
                ]
            },
            {
                id: 4,
                text: 'Anything else?',
                options: [
                    {
                        id: 111,
                        text: 'What is this place?',
                        linkId: 2
                    },
                    {
                        id: 112,
                        text: 'Where can I buy fuel?',
                        linkId: 3
                    },
                    {
                        id: 113,
                        text: 'Thanks, see ya!'
                    }
                ]
            }
        ]
    },
    {
        name: 'Lieutenant',
        characterId: 2,
        speech: [
            {
                id: 1,
                text: "I'd rather you left me alone.",
                options: [
                    {
                        id: 211,
                        text: 'But I found that box you wanted.',
                        item: 1,
                        linkId: 2
                    },
                    {
                        id: 212,
                        text: 'Suit yourself.'
                    }
                ]
            },
            {
                id: 2,
                text: 'I was joking mate. Do one.',
                options: [
                    {
                        id: 221,
                        text: 'Right-o'
                    }
                ]
            }
        ]
    },
    {
        name: 'Merchant',
        characterId: 3,
        speech: [
            {
                id: 1,
                text: "What do you want, a medal?",
                options: [
                    {
                        id: 311,
                        text: 'Sure, ok.',
                        linkId: 2,
                        receiveItem: 3
                    },
                    {
                        id: 312,
                        text: 'Nah, see ya.'
                    }
                ]
            },
            {
                id: 2,
                text: 'Here you go',
                options: [
                    {
                        id: 321,
                        text: 'Thanks'
                    }
                ]
            }
        ]
    },
    {
        name: 'Cadet',
        characterId: 4,
        speech: [
            {
                id: 1,
                text: "Sorry no civilian access.",
                options: [
                    {
                        id: 411,
                        text: 'The major said it was ok.',
                        item: 101,
                        linkId: 2,
                        receiveItem: 102
                    },
                    {
                        id: 412,
                        text: 'Hm ok.'
                    }
                ]
            },
            {
                id: 2,
                text: 'Ok bud, in you go.',
                options: [
                    {
                        id: 421,
                        text: 'Right-o'
                    }
                ]
            }
        ]
    },
    {
        name: 'Bartender',
        characterId: 5,
        speech: [
            {
                id: 1,
                text: "I'd rather you left me alone.",
                options: [
                    {
                        id: 511,
                        text: 'But I found that box you wanted.',
                        item: 1,
                        linkId: 2
                    },
                    {
                        id: 512,
                        text: 'Suit yourself.'
                    }
                ]
            },
            {
                id: 2,
                text: 'I was joking mate. Do one.',
                options: [
                    {
                        id: 521,
                        text: 'Right-o'
                    }
                ]
            }
        ]
    },
    {
        name: 'Retired Major',
        characterId: 6,
        speech: [
            {
                id: 1,
                text: 'I don\'t want to talk to you.',
                options: [            
                    {
                        id: 611,
                        text: 'But I have this medal',
                        item: 3,
                        linkId: 2,
                        receiveItem: 101
                    },
                    {
                        id: 612,
                        text: 'Fair enough.'
                    },
                ]
            },{
                id: 2,
                text: 'Amazing. I like you now, the guard will let you in.',
                options: [
                    {
                        id: 621,
                        text: 'Cheers bud!'
                    }
                ]
            }
        ]
    }
]
