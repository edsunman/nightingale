/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            cursor : {
                default: 'image-set( "/cursor.png" 1x, "/cursor-x2.png" 2x), default',
                pointer: 'image-set( "/cursorHover.png" 1x, "/cursorHover-x2.png" 2x), pointer'
            },
            fontFamily: {
                sans: ['Comfortaa']
            }
        }
    },
    plugins: []
}

