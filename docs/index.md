---
hero:
  title: fireformily
  desc: '@formily/antd pro?'
  actions:
    - text: 查看组件 →
      link: ./components
features:
  - icon: https://gw.alipayobjects.com/zos/bmw-prod/881dc458-f20b-407b-947a-95104b5ec82b/k79dm8ih_w144_h144.png
    title: 开箱即用
    desc: Demo With JSON
  - icon: https://gw.alipayobjects.com/zos/bmw-prod/d60657df-0822-4631-9d7c-e7a869c2f21c/k79dmz3q_w126_h126.png
    title: 原汁原味
    desc: 尽可能符合 AntD × formily 直觉习惯
  - icon: https://gw.alipayobjects.com/zos/bmw-prod/d1ee0c6f-5aed-4a45-a507-339a4bfe076c/k7bjsocq_w144_h144.png
    title: Desginable 支持
    desc: WIP...
footer: Open-source MIT Licensed | Copyright © 2020<br />Powered by [dumi](https://d.umijs.org)
---

## fireformily!

```tsx
/**
 * inline: true
 */
import React from 'react';
import Overview from './components/Overview.tsx';

const groups = [
  {
    title: '常用组件',
    prefix: '/components',
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
      }
    ]
  },
  {
    title: '最佳实践',
    prefix: '/plugins',
    children: [
      {
        title: 'Dict',
        subtitle: '远程词典',
        cover: 'https://gw.alipayobjects.com/zos/antfincdn/AwU0Cv%26Ju/bianzu%2525208.svg',
        link: '/'
      },
    ]
  }
];

export default () => {
  return <Overview groups={groups} />
}
```

## 相关概念

- [标准化CRUD作用域变量规范](https://github.com/alibaba/formily/discussions/3207)

- [交互参考](https://procomponents.ant.design/components/table?current=1&pageSize=5)
