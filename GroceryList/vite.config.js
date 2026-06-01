module.exports = async ({ mode } = {}) => {
  const [{ defineConfig, loadEnv }, { default: cloudflarePlugin }] = await Promise.all([
    import('vite'),
    import('@cloudflare/vite-plugin'),
  ]);

  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    plugins: [
      cloudflarePlugin({
        // add Cloudflare plugin options here if needed
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
