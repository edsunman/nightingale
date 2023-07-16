import script from '../../static/script.json'
import type { PageServerLoad } from './$types'
import type { Script } from '$lib/types'

export const load = (async () => {

    const s  = <Script>structuredClone(script)
    return { script : s }

}) satisfies PageServerLoad