/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'buff' : '#f1ac7eff',
        'blush' : '#e64c63ff',
        'amaranth-purple' : '#a9133bff',
        'dark-purple' : '#170623',
        'yinmn-blue' : '#1942b3ff',
        'vista-blue' : '#5d90e9ff',
      },
      backgroundColor: {
        default: 'amaranth-purple',
      },
      // backgroundImage: {
      //   'arcade-carpet' : "url('./src/imgs/bg-image.jpg')",
      // }
      dropShadow: {
        '2xl': '0 25px 50px -12px rgba(133, 155, 194, 1)',
      }
    },
  },
  plugins: [],
}
