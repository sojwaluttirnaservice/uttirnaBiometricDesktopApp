import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()],
    // server: {
    //   // Bind to all IP addresses so the app can be accessed from other devices
    //   host: '0.0.0.0', // Allows access via local network
    //   port: 3000, // Ensure you're using an open port
    //   open: false // You can set this to true if you want the browser to open automatically
    // }
  }
})
