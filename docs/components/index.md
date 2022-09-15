---
nav:
  title: 常用组件
---

```tsx
/**
 * inline: true
 */
import React from 'react';
import Overview from './Overview.tsx';

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
  }
];

export default () => {
  return <Overview groups={groups} />
}
```
