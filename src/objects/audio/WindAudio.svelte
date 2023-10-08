<script lang="ts">
    import { gameVolume } from '$lib/stores'
    import { Audio } from '@threlte/extras'
    import { onDestroy } from 'svelte'

    let windVolume = 0.4
    let audio: any
    let audio2: any
    let globalGainNode: any
    let localGainNode: any
    let localGainNode2: any
    let source: any
    let source2: any
    let playing = false
    let loaded = 0

    $: changeVolume($gameVolume)

    function changeVolume(gv: number) {
        if (globalGainNode) {
            audio.context.resume()
            // console.log(audio.context)
            globalGainNode.gain.value = gv
            !playing && playWind()
        }
    }

    function audioLoaded() {
        if (loaded === 2) {
            // set up gain node chain
            globalGainNode = audio.context.createGain()
            globalGainNode.gain.value = $gameVolume
            globalGainNode.connect(audio.context.destination)
            localGainNode = audio.context.createGain()
            localGainNode.connect(globalGainNode)
            localGainNode2 = audio.context.createGain()
            localGainNode2.connect(globalGainNode)
            playWind()
        }
    }

    function playWind() {
        if (!audio.context) return
        audio.context.resume()
        //console.log(audio.context.state)
        //if (audio.context.state !== 'running') return
        playing = true

        // create sources and link to local gain nodes
        source = audio.context.createBufferSource()
        source.buffer = audio.buffer
        source.connect(localGainNode)
        source2 = audio2.context.createBufferSource()
        source2.buffer = audio2.buffer
        source2.connect(localGainNode2)
        // set up fade in and fade out
        const currentTime = source.context.currentTime
        const duration = source.buffer.duration
        localGainNode.gain.setValueAtTime(0, currentTime + 0)
        localGainNode.gain.linearRampToValueAtTime(windVolume, currentTime + 7.5)
        localGainNode.gain.setValueAtTime(windVolume, currentTime + duration - 7.5)
        localGainNode.gain.linearRampToValueAtTime(0, currentTime + duration)
        localGainNode2.gain.setValueAtTime(0, currentTime + 7.5)
        localGainNode2.gain.linearRampToValueAtTime(windVolume, currentTime + 15)
        localGainNode2.gain.setValueAtTime(windVolume, currentTime + duration)
        localGainNode2.gain.linearRampToValueAtTime(0, currentTime + duration + 7.5)

        source.start()
        source2.start(currentTime + 7.5)

        source.onended = () => {
            playWind()
        }
    }

    onDestroy(() => {
        if (globalGainNode && source) {
            globalGainNode.gain.setValueAtTime($gameVolume, audio.context.currentTime)
            globalGainNode.gain.linearRampToValueAtTime(0, audio.context.currentTime + 2)
            source.onended = null
        }
    })
</script>

<Audio
    src={'/audio/wind1.mp3'}
    bind:ref={audio}
    on:load={() => {
        loaded++
        audioLoaded()
    }}
    autoplay={false}
    loop={false}
    volume={1}
/>
<Audio
    src={'/audio/wind2.mp3'}
    bind:ref={audio2}
    on:load={() => {
        loaded++
        audioLoaded()
    }}
    autoplay={false}
    loop={false}
    volume={2}
/>
