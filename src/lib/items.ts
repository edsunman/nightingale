import type { Items } from "./types"

export const items : Items = [
    {
        id: 1,
        name: "Cardboard Box",
        message: "A cardboard box",
        image: "cardboardBox.svg",
        description : "",
        isSecretKey:false
    },
    {
        id: 2,
        name: "Fuel Cell",
        message: "A fuel cell",
        image: "cardboardBox.svg",
        description : "",
        isSecretKey:false
    },{
        id: 3,
        name: "Old Medal",
        message: "A fuel cell",
        image: "cardboardBox.svg",
        description : "A tattered relic of only sentimental value",
        isSecretKey:false
    },{
        id: 4,
        name: "Keycard",
        message: "",
        image: "cardboardBox.svg",
        description: "",
        isSecretKey:false
    },
    
    // SECRET KEYS

    {
        id: 101,
        name: "",
        message: "",
        image: "",
        description: "major gives advice to talk to door guard",
        isSecretKey:true
    } ,
    {
        id: 102,
        name: "",
        message: "",
        image: "",
        description: "permission to enter store",
        isSecretKey:true
    },
    {
        id: 103,
        name: "",
        message: "",
        image: "",
        description: "told about store",
        isSecretKey:true
    },
    {
        id: 104,
        name: "",
        message: "",
        image: "",
        description: "entered store",
        isSecretKey:true
    }

]

