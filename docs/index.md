---
hero:
  title: ''
  desc: '![fireformily](/images/fireformily.svg)<br /> @formily/antd Pro?'
  actions:
    - text: 查看组件 →
      link: ./components
features:
  - icon: https://gw.alipayobjects.com/zos/bmw-prod/881dc458-f20b-407b-947a-95104b5ec82b/k79dm8ih_w144_h144.png
    title: 方便CV
    desc: With Demo
  - icon: https://gw.alipayobjects.com/zos/bmw-prod/d60657df-0822-4631-9d7c-e7a869c2f21c/k79dmz3q_w126_h126.png
    title: 原汁原味
    desc: 尽可能符合 AntD × formily 直觉习惯
  - icon: https://gw.alipayobjects.com/zos/bmw-prod/d1ee0c6f-5aed-4a45-a507-339a4bfe076c/k7bjsocq_w144_h144.png
    title: Desginable 支持
    desc: WIP...
footer: Open-source MIT Licensed | Copyright © 2020<br />Powered by [dumi](https://d.umijs.org)
---

```tsx
/**
 * inline: true
 */
import React from 'react';
import Overview from '@/Overview';

const prefix =  process.env.NODE_ENV === 'development' ? '/components' : '/fireformily/components';
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
      }
    ]
  },
    {
    title: '最佳实践',
    prefix,
    children: [
      {
        title: 'Dict',
        subtitle: '远程词典',
        cover: 'https://gw.alipayobjects.com/zos/antfincdn/AwU0Cv%26Ju/bianzu%2525208.svg',
        link: '/dict'
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
