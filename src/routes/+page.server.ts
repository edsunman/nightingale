import { building, version } from '$app/environment'
import script from '../../static/script.json'
import gameData from '../../static/gameData.json'
import type { PageServerLoad } from './$types'
import type { Script, GameData } from '$lib/types'

export const load = (async ({ url }) => {
    let dev = false

    if (!building) {
        const searchParams = url.searchParams

        if (searchParams.has('dev')) {
            dev = true
        }
    }

    const gd = <GameData>structuredClone(gameData)
    return { gameData: gd, dev, version }
}) satisfies PageServerLoad
