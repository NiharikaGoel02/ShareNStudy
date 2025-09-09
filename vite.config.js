import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// export default defineConfig({
//   server: {
//     proxy: {
//       '/api': 'http://localhost:3000',
//     },
//   },
//   plugins: [react()],
// });


// export default {
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:3000', // your backend
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// }

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Backend server
        changeOrigin: true,
        secure: false,
      },
      "/socket.io": {
        target: "http://localhost:3000",
        ws: true,
        changeOrigin: true,
      }
    },
  },
})