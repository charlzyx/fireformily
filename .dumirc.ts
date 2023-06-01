import { defineConfig } from 'dumi';

const base = process.env.NODE_ENV === 'production' ? '/fireformily/' : '/';

export default defineConfig({
  themeConfig: {
    name: 'fireformily',
    logo: base + 'images/fireformily.svg',
    nav: [{
      title: 'formily',
      link: 'https://github.com/alibaba/formily',
    }]
  },
  mfsu: {},
  apiParser: {},
  favicons: [base + 'images/fireformily.svg'],
  outputPath: './doc-site',
  publicPath: base,
  base,
  resolve: {
    entryFile: "./src/index.ts",
    atomDirs: [
      {type: 'components', dir: 'src/components'},
      {type: 'components', dir: 'src/pro'},
    ]
  },
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
  // more config: https://d.umijs.org/config
});
