/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Patrick Hand"', 'cursive'],
            },
            colors: {
                paper: '#fdfbf7',
                ink: '#2d2d2d',
            },
            boxShadow: {
                'sketch': '3px 3px 0px 0px #2d2d2d',
                'sketch-sm': '2px 2px 0px 0px #2d2d2d',
                'sketch-lg': '5px 5px 0px 0px #2d2d2d',
            }
        },
    },
    plugins: [],
}
