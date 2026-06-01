module.exports = async ({ mode } = {}) => {
  const [{ defineConfig, loadEnv }, cloudflareModule] = await Promise.all([
    import('vite'),
    import('@cloudflare/vite-plugin'),
  ]);

  const env = loadEnv(mode, process.cwd(), '');
  const cloudflarePlugin = cloudflareModule.cloudflare;

  return defineConfig({
    plugins: [
      cloudflarePlugin({
      }),
    ],
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
  });
};
