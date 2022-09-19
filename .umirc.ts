import { defineConfig } from 'dumi';

const base = process.env.NODE_ENV === 'production' ? '/fireformily/' : '/';

export default defineConfig({
  title: 'fireformily',
  mfsu: {},
  favicon: base + 'images/fireformily.svg',
  logo: base + 'images/fireformily.svg',
  mode: 'site',
  outputPath: './doc-site',
  publicPath: base,
  dynamicImport: {},
  base,
  runtimePublicPath: true,
  extraBabelPlugins: [
    './babel/plugin-jsx-wrapper-with-observer-by-attr',
  ],
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
      title: 'Github',
      path: 'https://github.com/charlzyx/fireformily',
    },
    {
      title: 'formily',
      path: 'https://github.com/alibaba/formily',
    },
  ],
  // more config: https://d.umijs.org/config
});
