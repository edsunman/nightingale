 import { MeshToonMaterial, Color, TextureLoader, sRGBEncoding } from 'three'
 import type * as THREE from 'three'

export interface toonMaterial {
    material : THREE.MeshToonMaterial
}

export class toonMaterial {

    constructor( url : string ) {
        const texture = new TextureLoader().load(url)
        texture.flipY = false
        texture.encoding = sRGBEncoding
        this.material = new MeshToonMaterial( {
            color : new Color(0xffffff),
            map : texture
        } );
    }
    //return material
}