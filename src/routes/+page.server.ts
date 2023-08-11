import { building, version } from '$app/environment'
import script from '../../static/script.json'
import type { PageServerLoad } from './$types'
import type { Script } from '$lib/types'

export const load = (async ({ url }) => {

    let dev = false

    if (!building) {
        const searchParams = url.searchParams

        if(searchParams.has('dev')){
            dev = true
        }
    }

    console.log(version)

    const s  = <Script>structuredClone(script)
    return { script : s, dev, version }

}) satisfies PageServerLoad