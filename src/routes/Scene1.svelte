<script lang="ts">
    import { T } from '@threlte/core'
    import { sRGBEncoding } from 'three'
    import { Audio } from '@threlte/extras'

    import Floor from './Floor.svelte'
    import Character from '../objects/Character.svelte'
    import Rocks from '../objects/Rocks.svelte'
    import Door from '../objects/Door.svelte'
    import Spaceship from '../objects/Spaceship.svelte'
    import Wind from '../objects/effects/Wind.svelte'
    import Object from '../objects/Object.svelte'
    import Objects from '../objects/Objects.svelte'
    import Sparkes from '../objects/effects/Sparkes.svelte'
    import DesertTent from '../objects/Desert_tent.svelte'

    const avoidArray: Array<{ x: number; z: number }> = [
        { x: -2, z: 15 },
        { x: -16, z: -16 },
        { x: 3, z: 1 },
        { x: 3, z: 2 },
        { x: 3, z: 3 },
        { x: 2, z: 2 },
        { x: -1, z: 2 },
        { x: -2, z: 2 },
        { x: -2, z: 1 },
        { x: 5, z: -3 },
        { x: 4, z: -3 },
        { x: 3, z: -3 },
        { x: 2, z: -2 },
        { x: 1, z: -1 },
        { x: 0, z: 0 },
        { x: 2, z: -1 },
        { x: -1, z: 1 },
        { x: -1, z: 0 },
        { x: 0, z: -1 },
        { x: 1, z: -2 },
        { x: -1, z: 3 },
        { x: -2, z: 3 },
        { x: -1, z: 4 },
        { x: 2, z: -3 }
    ]
</script>

<Floor {avoidArray} startingPosition={{ x: 26, z: -22 }} startingRotation={{ x: 26, z: -21 }} levelSize={{ x: 70, z: 70 }} />

<T.Mesh position={[0.5, -0.01, 0.5]} visible={true} name="ground" receiveShadow>
    <T.BoxGeometry args={[100, 0.01, 100]} />
    <T.MeshToonMaterial color="#a6623c" />
</T.Mesh>

<Door
    url={'/objects/stone_door-transformed.glb'}
    position={[-31.5, 0, 17]}
    activeSquare={{ x: -31, z: 17 }}
    scene={2}
    message="A makeshift door to an ancient ruin"
/>
<Door
    url={'/objects/tech_door-transformed.glb'}
    position={[18.5, 0, 23]}
    activeSquare={{ x: 19, z: 23 }}
    scene={3}
    message="A door to a millatry building"
    key={102}
/>

<!-- CHARACTERS -->

<Character
    message="A hologram flickers through the dust"
    position={{ x: 21, y: 0, z: -18 }}
    url={'/objects/hologram-transformed.glb'}
    characterId={1}
    rotation={1.5708}
    currentActionKey={'idle'}
    beforeDialogueActionKey={'wave'}
    isHologram={true}
    lookatPlayer={true}
/>
<Character
    message="A soldier"
    position={{ x: 2, y: 0, z: 2 }}
    url={'/objects/hologram-transformed.glb?v=2'}
    characterId={2}
    rotation={1.5708}
    currentActionKey={'idle'}
    lookatPlayerWhenTalking={false}
    chatRadius={2}
/>
<Character
    message="An elderly woman"
    position={{ x: -16, y: 0, z: -23 }}
    url={'/objects/hologram-transformed.glb?v=3'}
    characterId={20}
    currentActionKey={'idle'}
    chatRadius={2}
/>
<Character
    message="A soldier guards the door"
    position={{ x: 19, y: 0, z: 24 }}
    url={'/objects/hologram-transformed.glb?v=4'}
    characterId={21}
    rotation={1.5708}
    currentActionKey={'idle'}
    lookatPlayerWhenTalking={false}
/>

<!-- OBJECTS -->

<Rocks />
<Objects
    url={'/objects/tech_landingPad-transformed.glb'}
    scale={[4.9, 5.2, 5.4]}
    instances={[
        { position: [24, -0.05, -25.5], rotation: [0, 1.57, 0] },
        { position: [-23, -0.05, -20], rotation: [0, 0, 0] }
    ]}
/>
<Object url={'/objects/tech_hologramPad-transformed.glb'} scale={0.4} position={[21, 0, -18]} rotation.y={-1.57} />
<Objects
    url={'/objects/tech_crate-transformed.glb'}
    scale={[0.5, 0.5, 0.5]}
    instances={[
        { position: [18, 0.4, -19], rotation: [0, 1, 0] },
        { position: [19, 0.4, -17.5], rotation: [0, 1.57, 0] },
        { position: [-3, 0.4, 3], rotation: [0, -0.3, 0] },
        { position: [-3, 1.3, 3], rotation: [0, 1, 0] },
        { position: [2, 0.4, -1], rotation: [0, 1.3, 0] }
    ]}
/>
<Object
    name={'satalite'}
    url={'/objects/tech_satalite-transformed.glb'}
    scale={0.5}
    position={[-3, 1.8, 3]}
    rotation={[1.57, 0, 1.8]}
/>
<Object name={'table tech'} url={'/objects/tech_desk-transformed.glb'} scale={1.2} position={[3, -0.45, 2]} rotation.y={-1.57} />
<Object name={'bench'} url={'/objects/stone_table-transformed.glb'} scale={0.32} position={[-16, 0, -22]} rotation.y={0} />
<Objects
    name={'stool'}
    url={'/objects/stone_stool-transformed.glb'}
    scale={0.22}
    instances={[{ position: [2, 0, 2], rotation: [0, 0, 0] }]}
/>
<DesertTent name={'tent'} scale={1.1} position={[1, 0, 1]} rotation.y={0.7} />

<Object name={'building'} url={'/objects/tech_building-transformed.glb'} scale={1.5} position={[15.5, 0, 24.5]} rotation.y={-1.57} />
<Object name={'church'} url={'/objects/stone_church-transformed.glb'} scale={1.85} position={[-45.5, 0, 17]} rotation.y={3.14} />

<Spaceship position={[23, 2, -25.5]} scale={1.8} rotation.y={0} />

<Sparkes position={[21, 0, -18]} />
<Wind />

<!-- LIGHTS + AUDIO -->

<T.AmbientLight intensity={0.1} />
<Audio src={'/audio/wind.ogg'} on:create={({ ref }) => {}} autoplay={true} loop={true} volume={1} />
