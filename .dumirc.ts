import { defineConfig } from 'dumi';

const base = process.env.NODE_ENV === 'production' ? '/fireformily/' : '/';

export default defineConfig({
  themeConfig: {
    name: 'fireformily',
    logo: base + 'images/fireformily.svg',
    // nav: [
    //   {
    //   title: 'formily',
    //   link: 'https://github.com/alibaba/formily',
    // }]
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
      href: 'https://unpkg.com/antd@4/dist/antd.min.css',
    },
  ],
  styles: [
    `
    .dumi-default-header-left {
      width: 200px !important;
    }
    .dumi-default-logo {
      font-size: 16px !important;
    }
    .dumi-default-logo img{
      height: 48px !important;
      width: 100px !important;
    }
    `,
  ],
  // more config: https://d.umijs.org/config
});
