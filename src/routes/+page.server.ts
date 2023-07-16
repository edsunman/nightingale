import script from '../../static/script.json'
import type { PageServerLoad } from './$types'
import type { Script } from '$lib/types'

export const load = (async ({ url }) => {

    const searchParams = url.searchParams
    let dev = false

    if(searchParams.has('dev')){
        dev = true
    }

    const s  = <Script>structuredClone(script)
    return { script : s, dev }

}) satisfies PageServerLoad