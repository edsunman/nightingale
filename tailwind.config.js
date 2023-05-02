/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            cursor : {
                default: 'url(/cursor.png), default'
            },
            fontFamily: {
                sans: ['Comfortaa']
            }
        }
    },
    plugins: []
}

