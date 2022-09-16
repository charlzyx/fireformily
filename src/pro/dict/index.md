---
group:
  title: 最佳实践
  order: 1
---

## Dict - 远程词典

formily 自带 `enum` 字段能够满足本地的枚举词典的需求, 但远程的其实更常用一些;
因此, 规范了一个标准的词典加载器 `registerDictLoader`, 来注册一个内存中的全局
词典加载器, 结合 `Schema` 上的 `'x-data': { dict: 'name' }` 这个字段, 在 `effects` 中
处理远程词典请求, 并转换为与 enum 一致的 `dataSource`, 供给组件消费;

除此之外, 还将枚举值的阅读态添加了 `Badge` / `Tag` 形式的美化, 并支持自动将 [@formily/antd](https://antd.formilyjs.org/zh-CN/components)
中的 `Select` / `Checkbox.Group` / `Radio.Group` 的 `readPretty` 形态劫持为优化形态



### 代码演示

<code src="../../components/Dict/demos/DictDemo.tsx" />

### 使用注意

1. 注册词典加载器
2. 注入 `effects`

```tsx pure
import { dict, Dict, dictEffects, registerDictLoader } from 'fireformily';
import { createForm } from '@formily/core';

// 举个例子
registerDictLoader('status', (convert) => {
  return Promise.resolve([
    { label: '已上线', value: 0, color: 'success' },
    { label: '运行中', value: 1, color: 'processing' },
    { label: '关闭', value: 2, color: 'default' },
    { label: '已宕机', value: 3, color: 'error' },
    { label: '已超载', value: 4, color: 'warning' },
  ]).then((list) => {
    return convert(list, 'label', 'value');
  });
});

const form = createForm({
  effects(form) {
    dictEffects(form);
  }
})

```
<hr />
