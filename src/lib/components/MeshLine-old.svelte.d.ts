import type { Events, Props, Slots } from '@threlte/core'
import type { ColorRepresentation, Mesh, Vector3 } from 'three'
import { SvelteComponentTyped } from 'svelte'

export type MeshLineProps = Omit<Props<Mesh>, 'material' | 'geometry'> & {
    points: Vector3[]
    pointWidth? : ( p: number ) => number 
    transparent? : boolean
    depthTest? : boolean
    depthWrite? : boolean
    lineWidth? : number
    dashArray? : number
    dashRatio? : number
    dashOffset? : number   
    color?: ColorRepresentation
    opacity?: number
}

export default class MeshLine extends SvelteComponentTyped<MeshLineProps, Events<Mesh>, Slots<Mesh>> {}
