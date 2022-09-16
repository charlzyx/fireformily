---
group:
  title: 优雅阅读态组件
  order: 1
---

## LongText - 长文本

其实就是 Antd 的 [Typography.Paragraph](https://ant.design/components/typography-cn/#Typography.Paragraph) 默认 `copyable` / `ellipsis` 为 `true` 方便在表格中展示

```tsx
import React from 'react';
import { LongText } from 'fireformily';

const App = () => {
  return <LongText value={`
如何学习 Formily
学习建议
Formily 用一句话来描述，它就是一个抽象了表单领域模型的 MVVM 表单解决方案，所以，如果你想深入使用 Formily，那必须学习并了解 Formily 的领域模型到底是咋样的，它到底解决了哪些问题，了解完领域模型之后，其实就是如何消费这个领域模型的视图层了，这一层就只需要看具体组件的文档即可了。

关于文档
因为 Formily 的学习成本还是比较高的，想要快速了解 Formily 的全貌，最重要的还是看文档，只是文档怎么看，从哪里看会比较重要，下面我们针对不同用户给出了不同的文档学习路线。
  `} />
}

export default App;

```
