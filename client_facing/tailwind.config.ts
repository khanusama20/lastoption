import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0B0D10',
          onyx: '#14181F',
          surface: '#1A202C',
          border: '#2D3748',
          muted: '#A0AEC0',
          accent: '#D4AF37', // Refined gold / brass
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    }
  }
}
