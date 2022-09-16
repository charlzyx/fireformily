---
nav:
  title: 最佳?实践
group:
  title: '概览'
  order: 0
---

```tsx
/**
 * inline: true
 */
import React from 'react';
import Overview from '../Overview';

const prefix =  process.env.NODE_ENV === 'development' ? '/pro' : '/fireformily/pro';
const groups = [
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
