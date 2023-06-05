---
group:
  title: 优雅阅读态组件
  order: 1
---

## 🌌 ImageView - 图片查看

```tsx
/**
 * title: 单张
 */
import React from 'react';
import { ImageView } from 'fireformily-v5';

const App = () => {
  return <ImageView value="https://img.alicdn.com/imgextra/i3/O1CN01xlETZk1G0WSQT6Xii_!!6000000000560-55-tps-800-800.svg" />
}

export default App;

```

```tsx
/**
 * title: 多张
 */
import React from 'react';
import { ImageView } from 'fireformily-v5';
const uris = [
  'https://img.alicdn.com/imgextra/i1/O1CN01bHdrZJ1rEOESvXEi5_!!6000000005599-55-tps-800-800.svg',
  'https://img.alicdn.com/imgextra/i3/O1CN01xlETZk1G0WSQT6Xii_!!6000000000560-55-tps-800-800.svg',
]
const App = () => {
  return <ImageView value={uris} />
}

export default App;

```

<API src="./index.tsx"></API>
