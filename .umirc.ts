import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'fireformily',
  mfsu: {},
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo: 'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  mode: 'site',
  outputPath: './doc-site',
  publicPath: process.env.NODE_ENV === 'production' ? '/fireformily/' : '/',
  base: process.env.NODE_ENV === 'production' ? '/fireformily/' : '/',
  runtimePublicPath: true,
  navs: [
    null,
    {
      title: 'GitHub',
      path: 'https://github.com/charlzyx/fireformily',
    },
    {
      title: 'formily',
      path: 'https://github.com/alibaba/formily',
    },
  ],
  proxy: {
    '/api': {
      target: 'https://randomuser.me/api',
      changeOrigin: true,
      pathRewrite: { '^/api' : '' },
    }
  }
  // more config: https://d.umijs.org/config
});
