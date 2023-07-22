/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            cursor : {
                default: 'image-set( "/cursor/cursor.png" 1x, "/cursor/cursor-x2.png" 2x), default',
                pointer: 'image-set( "/cursor/cursorHover.png" 1x, "/cursor/cursorHover-x2.png" 2x), pointer'
            },
            fontFamily: {
                sans: ['Viga']
            }
        }
    },
    plugins: []
}

