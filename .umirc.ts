import { defineConfig } from 'dumi';

const base = process.env.NODE_ENV === 'production' ? '/fireformily/' : '/';

export default defineConfig({
  title: 'fireformily',
  mfsu: {},
  // favicon:
  //   'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  // logo: 'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  favicon: base + 'images/fireformily.svg',
  logo: base + 'images/fireformily.svg',
  mode: 'site',
  outputPath: './doc-site',
  publicPath: base,
  dynamicImport: {},
  base,
  runtimePublicPath: true,
  extraBabelPlugins: ['./babel/plugin-jsx-element-wrapper-with-observer-by-live.js'],
  alias: {
    "@": './src/',
  },
  links: [
    {
      rel: 'stylesheet',
      href: 'https://unpkg.com/antd/dist/antd.css',
    },
  ],
  styles: [
    `.__dumi-default-navbar-logo{
      height: 60px !important;
      width: 150px !important;
      padding-left:0 !important;
      color: transparent !important;
    }
    .__dumi-default-navbar{
      padding: 0 28px !important;
    }
    .__dumi-default-layout-hero h1{
      color:#45124e !important;
      font-size:80px !important;
      padding-bottom: 30px !important;
    }
    .__dumi-default-dark-switch {
      display:none
    }
    nav a{
      text-decoration: none !important;
    }
    `,
  ],
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
