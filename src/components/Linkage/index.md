---
group:
  title: 增强组件
  order: 2
---

## 🖇 Linkage - 级联查询

> 主要为了解决一个很蛋疼的问题, 比如省市区, 返回值如果只有 code 的话, 加载不出来 label

- 追加了类似 select 的 labelInValue 实现
- 增加 loadAll加载方法, 加载整棵树
- 其他 参考Antd [https://ant.design/components/cascader-cn/](https://ant.design/components/cascader-cn/)

```tsx
/**
 * title: Cascader like
 */
import React, { useEffect, useState } from 'react';
import { Linkage } from 'fireformily'
import { loadData } from './demos/mock'

export default () => {
  const [value, setValue] = useState([]);

  useEffect(() => {
    console.log('--value', value);
  }, [value]);

  return (
    <Linkage
      loadData={loadData}
      value={value}
      onChange={setValue}
    ></Linkage>
  );
};
```

```tsx
/**
 * title: loadAll & 反显
 */
import React, { useEffect, useState } from 'react';
import { Linkage } from 'fireformily'
import { loadAll } from './demos/mock'

export default () => {
  const [value, setValue] = useState(['110000', '110000', '110105']);

  useEffect(() => {
    console.log('--value', value);
  }, [value]);

  return (
    <Linkage
      loadAll={loadAll}
      value={value}
      onChange={setValue}
    ></Linkage>
  );
};
```


```tsx
/**
 * title: loadData & 反显
 */
import React, { useEffect, useState } from 'react';
import { Linkage } from 'fireformily'
import { loadData } from './demos/mock'

export default () => {
  const [value, setValue] = useState(['110000', '11000000', '110105']);

  useEffect(() => {
    console.log('--value', value);
  }, [value]);

  return (
    <Linkage
      loadData={loadData}
      value={value}
      onChange={setValue}
    ></Linkage>
  );
};
```


```tsx
/**
 * title: labelInValue & 反显
 */
import React, { useEffect, useState } from 'react';
import { Linkage } from 'fireformily'
import { loadData } from './demos/mock'

export default () => {
  const [value, setValue] = useState([
    {
        "value": "110000",
        "label": "北京市"
    },
    {
        "value": "11000000",
        "label": "北京市"
    },
    {
        "value": "110105",
        "label": "朝阳区"
    }
  ]);

  useEffect(() => {
    console.log('--value', value);
  }, [value]);

  return (
    <Linkage
      loadData={loadData}
      labelInValue
      value={value}
      onChange={setValue}
    ></Linkage>
  );
};
```

## API

```ts
export interface LinkageOption {
  value: string;
  label: string;
  children?: LinkageOption[];
  isLeaf?: boolean;
  loading?: boolean;
  __init?: boolean;
}
```
