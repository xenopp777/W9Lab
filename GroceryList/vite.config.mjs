import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [],
    base: './',
    build: {
      sourcemap: true,
    },
    server: {
      proxy: {
        '/fdc': {
          target: 'https://api.nal.usda.gov',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/fdc/, ''),
        },
      },
    },
  };
});
