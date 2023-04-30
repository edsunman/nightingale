/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Comfortaa']
            },
            backgroundImage: {
                'triangle': "url('/triangle.png')",
                'triangle-down': "url('/triangle-down.png')"
            }
        }
    },
    plugins: []
}

