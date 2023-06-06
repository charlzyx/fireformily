---
hero:
  title: ''
  description: '<p><img src="/fireformily/images/fireformily.svg" /> <br /> fireformily! <br /> @formily/antd Pro? <br /> @latest (default) for antd@4, @next for antd@5 </p>'
  actions:
    - text: 查看组件 →
      link: ./components
features:
  - emoji: 📋
    title: 方便CV
    description: With Demo
  - emoji: 🐙
    title: 原汁原味
    description: 尽可能符合 AntD × formily 直觉习惯
  - emoji: 🚀
    title: 拓展强大
    description: 枚举词典/查询表单/多选/行展开/导出操作栏等
footer: Open-source MIT Licensed | Copyright © 2020<br />Powered by [dumi](https://d.umijs.org)
---

```tsx
/**
 * inline: true
 */
import React from 'react';
import Overview from '../src/Overview';

const prefix = process.env.NODE_ENV === 'development' ? '/components' : '/fireformily/components';
const prefixPro = process.env.NODE_ENV === 'development' ? '/pro' : '/fireformily/pro';

const groups = [
  {
    title: '优雅阅读态组件',
    prefix,
    children: [
      {
        title: 'Dict',
        subtitle: '远程词典',
        cover: 'https://gw.alipayobjects.com/zos/antfincdn/AwU0Cv%26Ju/bianzu%2525208.svg',
        link: '/dict'
      },
      {
        title: 'ImageView',
        subtitle: '图片查看',
        cover: 'https://gw.alipayobjects.com/zos/antfincdn/D1dXz9PZqa/image.svg',
        link: '/image-view'
      },
      {
        title: 'LongText',
        subtitle: '长文本',
        cover: 'https://gw.alipayobjects.com/zos/alicdn/Vyyeu8jq2/Tooltp.svg',
        link: '/long-text'
      },
    ],
  },
  {
    title: '专业级组件',
    prefix,
    children: [
      {
        title: 'QueryList',
        subtitle: '查询列表',
        cover: 'https://gw.alipayobjects.com/zos/antfincdn/AwU0Cv%26Ju/bianzu%2525208.svg',
        link: '/query-list'
      },
      {
        title: 'PopActions',
        subtitle: '弹窗动作表单',
        cover: 'https://gw.alipayobjects.com/zos/alicdn/3StSdUlSH/Modal.svg',
        link: '/pop-actions'
      },
      {
        title: 'Linkage',
        subtitle: '级联选择',
        cover: 'https://gw.alipayobjects.com/zos/alicdn/UdS8y8xyZ/Cascader.svg',
        link: '/linkage'
      },
      {
        title: 'Suggestion',
        subtitle: '搜索建议',
        cover: 'https://gw.alipayobjects.com/zos/alicdn/qtJm4yt45/AutoComplete.svg',
        link: '/suggestion'
      },
      {
        title: 'TreeNodes',
        subtitle: '节点树',
        cover: 'https://gw.alipayobjects.com/zos/alicdn/Xh-oWqg9k/Tree.svg',
        link: '/tree-nodes'
      },
    ]
  },
    {
    title: '最佳实践',
    prefix: prefixPro,
    children: [
      {
        title: 'Dict',
        subtitle: '远程词典',
        cover: 'https://gw.alipayobjects.com/zos/antfincdn/AwU0Cv%26Ju/bianzu%2525208.svg',
        link: '/dict'
      },
      {
        title: 'TreeBase',
        subtitle: '基础树',
        cover: 'https://gw.alipayobjects.com/zos/alicdn/Xh-oWqg9k/Tree.svg',
        link: '/tree-base'
      },
      {
        title: '响应式编程 in React',
        subtitle: 'useLive',
        cover: 'https://gw.alipayobjects.com/zos/alicdn/kegYxl1wj/ConfigProvider.svg',
        link: '/live'
      },
    ],
  },
];

export default () => {
  return <Overview groups={groups} />
}
```
