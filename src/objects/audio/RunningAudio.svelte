<script lang="ts">
    import { gameVolume } from '$lib/stores'
    import { Audio } from '@threlte/extras'

    export let floorType: string

    let audioSrc : string
    let runAudio: any
    let footstepVolume = 0.4
    let footstepInterval: number

    if (floorType === 'stone') {
        audioSrc = '/audio/footstep-stone.mp3'
    } else {
        audioSrc = '/audio/footstep-sand.mp3'
    }

    export function runningSound(r = true){
        clearInterval(footstepInterval)
        if (r){
            playFootstep()
            footstepInterval = window.setInterval(function () {
                playFootstep()
            }, 330)
        }
    }

    function playFootstep() {
        const source = runAudio.context.createBufferSource()
        const gainNode = runAudio.context.createGain()
        let randomGain = Math.random()
        let step = Math.floor(Math.random() * 3)
        if (randomGain < 0.5) randomGain += 0.5
        randomGain = randomGain * $gameVolume * footstepVolume
        source.detune.value = Math.floor(Math.random() * 400)
        source.buffer = runAudio.buffer
        gainNode.gain.value = randomGain
        source.connect(gainNode)
        gainNode.connect(runAudio.context.destination)
        source.start(runAudio.context.currentTime + 0.08, step, 1)
    }

</script>

<Audio src={audioSrc} bind:ref={runAudio} autoplay={false} loop={true} volume={0} />