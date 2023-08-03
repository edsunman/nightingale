<script lang="ts">
    import { T } from '@threlte/core'
    import { Audio } from '@threlte/extras'
    import Floor from './Floor.svelte'
    import Character from '../objects/Character.svelte'
    import Rocks from '../objects/Rocks.svelte'
    import Door from '../objects/Door.svelte'
    import Spaceship from '../objects/Spaceship.svelte'
    import Wind from '../objects/effects/Wind.svelte'
    import Object from '../objects/Object.svelte'
    import Objects from '../objects/Objects.svelte'
    import DesertTent from '../objects/Desert_tent.svelte'
    import DesertSand from '../objects/Desert_sand.svelte'
    import TechSign from '../objects/Tech_sign.svelte'

    import type { AvoidObject } from '$lib/types'

    const avoidArray: AvoidObject[] = [
        // ship
        { x: 21, z: -25.5, scaleX: 5, scaleZ: 10 },
        { x: 27.5, z: -25.5, scaleX: 8, scaleZ: 4 },
        { x: 17.5, z: -25.5, scaleX: 2, scaleZ: 2 },
        // landing pads
        { x: 32, z: -25.5, scaleZ: 8 },
        { x: 16, z: -25.5, scaleZ: 8 },
        { x: -23, z: -28, scaleX: 8 },
        { x: -23, z: -12, scaleX: 8 },
        { x: -3, z: 24, scaleZ: 8 },
        { x: -19, z: 24, scaleZ: 8 },
        // crates
        { x: 18, z: -19 },
        { x: 19, z: -17.5, scaleZ: 2 },
        { x: 9, z: -1 },
        // buildings
        { x: 5, z: 24.5, scaleX: 3, scaleZ: 6 },
        { x: 4.5, z: 20.5, scaleX: 2, scaleZ: 2 },
        { x: 15.5, z: 24.5, scaleX: 6, scaleZ: 12 },
        { x: 19.5, z: 28.5, scaleX: 2, scaleZ: 2 },
        { x: 3.5, z: 2.5, scaleX: 6, scaleZ: 4 },
        { x: -33, z: 17, scaleX: 3, scaleZ: 5 },
        // containers
        { x: -4, z: -27.5, scaleX: 3, scaleZ: 6 },
        { x: -16.5, z: -27.5, scaleX: 6, scaleZ: 6 },
        { x: -23.5, z: -4, scaleX: 6, scaleZ: 3 },
        // market
        { x: -16, z: -23, scaleX: 3, scaleZ: 3 },
        { x: -22, z: -10, scaleX: 3, scaleZ: 3 },
        // table and tent
        {x: 12, z: -3, scaleZ: 3},
        {x: 11, z: -3 },
        {x: 13, z: -8, scaleX: 3 },
        {x: 10.5, z: -6.5, scaleX: 2, scaleZ: 2 },
        {x: 8.5, z: -4.5, scaleX: 2, scaleZ: 2 },
        {x: 7.5, z: -2.5, scaleX: 2, scaleZ: 2 }
    ]
</script>

<Floor {avoidArray} startingPosition={{ x: 26, z: -22 }} startingRotation={{ x: 26, z: -21 }} levelSize={{ x: 70, z: 70 }} />

<T.Mesh position={[0.5, -0.01, 0.5]} visible={true} name="ground" receiveShadow>
    <T.BoxGeometry args={[100, 0.01, 100]} />
    <T.MeshToonMaterial color="#a6663d" />
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
    position={{ x: 11, y: 0, z: -3 }}
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
<DesertSand />
<Rocks />
<TechSign position={[4.2, 10, 3.5]} scale={1.2} rotation.y={-1.57} />
<Objects
    receiveShadow
    url={'/objects/tech_landingPad-transformed.glb'}
    scale={[4.9, 5.2, 5.4]}
    instances={[
        { position: [24, -0.05, -25.5], rotation: [0, 1.57, 0] },
        { position: [-23, -0.05, -20], rotation: [0, 0, 0] },
        { position: [-11, -0.05, 24], rotation: [0, 1.57, 0] }
    ]}
/>
<Object url={'/objects/tech_hologramPad-transformed.glb'} scale={0.4} position={[21, 0, -18]} rotation.y={-1.57} />
<Objects
    url={'/objects/tech_crate-transformed.glb'}
    scale={[0.5, 0.5, 0.5]}
    instances={[
        { position: [18, 0.4, -19], rotation: [0, 1, 0] },
        { position: [19, 0.4, -17.5], rotation: [0, 1.57, 0] },
        { position: [9, 0.4, -1], rotation: [0, -0.3, 0] },
        { position: [9, 1.3, -1], rotation: [0, 1, 0] },
        { position: [11, 0.4, -6], rotation: [0, 1.3, 0] }
    ]}
/>
<Object
    name={'satalite'}
    url={'/objects/tech_satalite-transformed.glb'}
    scale={0.5}
    position={[9, 1.8, -1]}
    rotation={[1.57, 0, 1.8]}
/>
<Object name={'table tech'} url={'/objects/tech_desk-transformed.glb'} scale={1.2} position={[12, -0.45, -3]} rotation.y={-1.57} />
<Object name={'bench'} url={'/objects/stone_table-transformed.glb'} scale={0.32} position={[-16, 0, -22]} rotation.y={0} />
<Object name={'bench'} url={'/objects/stone_table-transformed.glb'} scale={0.32} position={[-21, 0, -10]} rotation.y={1.57} />
<Objects
    name={'stool'}
    url={'/objects/stone_stool-transformed.glb'}
    scale={0.22}
    instances={[{ position: [2, 0, 2], rotation: [0, 0, 0] }]}
/>
<DesertTent name={'tent'} scale={1.1} position={[10, 0, -4]} rotation.y={0.7} />

<Object
    name={'building'}
    url={'/objects/tech_building-transformed.glb'}
    scale={1.5}
    position={[15.5, 0, 24.5]}
    rotation.y={-1.57}
    receiveShadow
/>
<Object name={'church'} url={'/objects/stone_church-transformed.glb'} scale={1.85} position={[-45.5, 0, 17]} rotation.y={3.14} />
<Object
    name={'spike building'}
    url={'/objects/tech_spikeBuilding-transformed.glb'}
    scale={1.5}
    position={[5, 0, 2.5]}
    rotation.y={-1.57}
/>
<Object
    name={'small building'}
    url={'/objects/tech_smallBuilding-transformed.glb'}
    scale={1.5}
    position={[5, 0, 24.5]}
    rotation.y={0}
    receiveShadow
/>
<Objects
    url={'/objects/tech_shippingContainer-transformed.glb'}
    scale={0.75}
    instances={[
        { position: [-16.5, 0, -26], rotation: [0, 1.57, 0] },
        { position: [-15, 0, -31], rotation: [0, 0, 0] },
        { position: [-15, 3.1, -29], rotation: [0, 0, 0] },
        { position: [-4, 0, -27.5], rotation: [0, 0, 0] },
        { position: [-23.5, 0, -4], rotation: [0, 1.57, 0] }
    ]}
/>
<Objects
    url={'/objects/desert_stall-transformed.glb'}
    scale={0.4}
    instances={[
        { position: [-16, 0, -23], rotation: [0, 1.57, 0] },
        { position: [-22, 0, -10], rotation: [0, 3.14, 0] }
    ]}
/>

<Spaceship position={[23, 2, -25.5]} scale={1.8} rotation.y={0} />

<Wind />

<!-- LIGHTS + AUDIO -->

<T.AmbientLight intensity={0.1} />
<Audio src={'/audio/wind.ogg'} on:create={({ ref }) => {}} autoplay={true} loop={true} volume={1} />
