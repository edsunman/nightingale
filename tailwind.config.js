/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            cursor : {
                default: 'url(/cursor.png), default',
                pointer: 'url(/cursorHover.png), pointer'
            },
            fontFamily: {
                sans: ['Comfortaa']
            }
        }
    },
    plugins: []
}

