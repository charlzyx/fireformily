---
nav:
  title: 组件
group:
  title: '组件概览'
  order: 0
---

```tsx
/**
 * inline: true
 */
import React from 'react';
import Overview from '../Overview';

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
    title: '增强组件',
    prefix,
    children: [

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
    title: 'Pro 专业级组件',
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
    ]
  }
];

export default () => {
  return <Overview groups={groups} />
}
```
