export const script = [
    {
        name: 'Border Guard',
        speech : [{
            id: 1,
            text: 'Welcome to the outpost . . .'
        },{
            id: 1.1,
            text: ". . . we don't often get visitors!",
            options : [{
                    text: "What is this place?",
                    linkId: 2
                },{
                    text: "Where can I buy fuel?",
                    linkId: 3
                },{
                    text: "See ya!"
                }
            ]
        },{
            id: 2,
            text: 'This is the last outpost before Thrace.',
            options : [{
                    text: "Oh cool",
                    linkId: 4
                }]
        },{
            id: 3,
            text: 'You could try the merchant in the church.',
            options : [{
                    text: "Ok I'll check it out.",
                    linkId: 4
                }]
        },{
            id: 4,
            text: 'Anything else?',
            options: [{
                    text: "What is this place?",
                    linkId: 2
                },{
                    text: "Where can I buy fuel?",
                    linkId: 3
                },{
                    text: "Thanks, see ya!"
                }
            ]
        }]
    }, {
        name : "Sally",
        speech: [{
            id: 1,
            text: "I'd rather you left me alone.",
            options: [{
                    text: "But I found that box you wanted.",
                    item: 1,
                    linkId: 2
                },{
                    text: "Suit yourself."
                }
            ],
        },{
            id: 2,
            text: "I was joking mate. Do one.",
            options: [{
                text: "Right-o"
            }]
        }]
    }];