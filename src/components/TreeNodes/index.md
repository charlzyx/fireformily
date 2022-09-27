---
group:
  title: Pro 组件
  order: 3
---

# 🎄 TreeNodes - 树

<code src="./demos/demo.tsx" />

## API

```ts | pure
export type TreeNode = {
  label?: string;
  value?: React.Key;
  key?: React.Key;
  isLeaf?: boolean;
  __init?: boolean;
  loading?: boolean;
  children?: TreeNode[];
};

export type TreeNodesProps = Omit<AntdTreeProps, 'loadData' | 'onDrop' | 'value' | 'onChange'> & BaseTreeProps;

type AntdTreeProps = React.ComponentProps<typeof Tree>;

type BaseTreeProps = {
  loadData?: (options: TreeNode[]) => Promise<TreeNode[]>;
  layout?: React.ComponentProps<typeof Space>;
  value?: {
    expanedKeys?: React.Key[];
    selectedKeys?: React.Key[];
    checkedKeys?: React.Key[];
    halfCheckedKeys?: React.Key[];
    children?: TreeNode[];
  };
  onAdd?: (
    pos: NodePos,
    child: NodeLike,
    parent: NodeLike,
    root: NodeLike,
  ) => void | Promise<NodeLike>;
  onCopy?: (
    pos: NodePos,
    node: NodeLike,
    parent: NodeLike,
    root: NodeLike,
  ) => void | Promise<NodeLike>;
  onRemove?: (
    pos: NodePos,
    node: NodeLike,
    parent: NodeLike,
    root: NodeLike,
  ) => void | Promise<void>;
  onMove?: (
    before: NodePos,
    after: NodePos,
    root: NodeLike,
  ) => void | Promise<void>;
}

```


<!--
```tsx
import React, { createContext, useContext } from 'react'

const Ctx = createContext({
  o: 'k',
})

const App = () => {
  const ctx = useContext(Ctx);

  return <div>
    <div>HELLO</div>
    <div>{JSON.stringify(ctx, null, 2)}</div>
  </div>
}

export default App;
``` -->