import { writable, type Writable } from 'svelte/store'
import { useFrame } from '@threlte/core'
import { onMount } from 'svelte'

export const useGamePad = () => {
    const lxStore = writable(0)
    const lyStore = writable(0)
    const crossStore = writable(0)
    const circleStore = writable(0)
    const squareStore = writable(0)
    const triangleStore = writable(0)

    const gamePadConnected = (gamepad: Gamepad) => {
        console.log(
            'Gamepad connected at index %d: %s. %d buttons, %d axes.',
            gamepad.index,
            gamepad.id,
            gamepad.buttons.length,
            gamepad.axes.length
        )
        start()
    }

    // Account for SSR use
    if (typeof window === 'undefined') {
        return {
            lx: { subscribe: lxStore.subscribe },
            ly: { subscribe: lyStore.subscribe },
            cross: { subscribe: crossStore.subscribe },
            circle: { subscribe: circleStore.subscribe },
            square: { subscribe: squareStore.subscribe },
            triangle: { subscribe: triangleStore.subscribe }
        }
    }

    window.addEventListener('gamepadconnected', (e) => gamePadConnected(e.gamepad))

    window.addEventListener('gamepaddisconnected', (e) => {
        console.log('Gamepad disconnected from index %d: %s', e.gamepad.index, e.gamepad.id)
        stop()
    })

    onMount(() => {
        const gamepads = navigator.getGamepads()
        if (gamepads[0]) {
            gamePadConnected(gamepads[0])
        }
    })

    const { start, stop } = useFrame(
        (_, delta) => {
            const gamepads = navigator.getGamepads()
            if (gamepads[0]) {
                lxStore.set(gamepads[0].axes[0])
                lyStore.set(gamepads[0].axes[1])
                crossStore.set(gamepads[0].buttons[0].value)
                circleStore.set(gamepads[0].buttons[1].value)
                squareStore.set(gamepads[0].buttons[2].value)
                triangleStore.set(gamepads[0].buttons[3].value)
            }
        },
        { autostart: false }
    )

    return {
        lx: { subscribe: lxStore.subscribe },
        ly: { subscribe: lyStore.subscribe },
        cross: { subscribe: crossStore.subscribe },
        circle: { subscribe: circleStore.subscribe },
        square: { subscribe: squareStore.subscribe },
        triangle: { subscribe: triangleStore.subscribe }
    }
}
