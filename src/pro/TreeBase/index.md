---
group:
  title: 最佳实践
  order: 1
---

# 🎄 TreeBase - 基础树

在 [ArrayBase](https://github.com/alibaba/formily/blob/formily_next/packages/antd/src/array-base/index.tsx) 中, 提供了两个基础三个scope `$records/$record/$index`; 其中 `$record` 可以认为是一个 `computed` 值, 也就是

```sh
$record = $records[$index]
```
那么 `Array` 的最小模型就是 `$records` / `$index`, `$index` 是当前记录的一个 `指针/坐标`, 那么类比出来, 我们要抽象一个 `Tree` 模型, 需要一个 `$root` 根节点, `$pos` 指针, 不同点在于 `$root` 树状结构通常长这样

```ts | pure
type NodeLike<T> = {
  children?: T[]
}
```

当然 `children` 字段是可以别的字段的, 为了简化我们的模型, 暂时就用这个;
那么在一颗树中的坐标系统就是 `$pos: numebr[]`, 比方说我们的数据这样

```ts | pure
const root = {
  label: 'ROOT',
  value: 'ROOT',
  children: [
    {
      label: '河南省',
      value: '456000',
      children: [
        {
          label: '郑州市',
          value: '456001',
        }
      ]
    }
  ]
}
```
那么郑州市所在的路径就是  `root.children[0].children[0]`, 替换掉 `children` 这个标识字段, 就可以简化为 `[0, 0]`

由此, 可以类比 `ArrayBase` 列举 `TreeBase` scope 基本内容, 首先, 是符合基本法的scope [标准化CRUD作用域变量规范](https://github.com/alibaba/formily/discussions/3207)

> 首先，变量名标准化
  $record 代表任何列表记录对象
  <br />
  $lookup 代表父级记录对象(与$record.$lookup的区别是如果$record为非对象数据，则需要通过$lookup获取)
  <br />
  $index 代表任何列表记录当前索引值
  <br />
  $records 代表任何列表数据
  <br />
  $record.$lookup 代表父级记录对象，可以层层往上找
  <br />
  $record.$index 代表当前记录对象的索引，同样可以层层往上找，比如$record.$lookup.$index or $record.$lookup.$lookup.$index
  <br />

```ts | pure
type Scope<T> = {
  // 整棵树的根节点
  $root: NodeLike<T>;
  // 当前 node 在树中的位置
  $pos: number[];
  // 当前 node 的值
  $record: NodeLike<T> & {
    $index: number;
    $lookup: Scope<T>['$record']
  };
  // 当前 node 的父级节点
  $lookup: Scope<T>['$record'];
  // 当前记录下标, 在 Tree 中, 表明是父级节点的 children 中的下标
  $index: number;
}

```

相似的, `node` 在 `children` 中的关系, 跟 `ArrayBase` 中的 `$records/$record` 关系是一致的, 所以我们可以拓展出

```ts | pure
type Scope<T> = {
  // ...
  // 当前 node 的父级 children 数组
  $records: NodeLike<T>[];
}
```

当然相比 `ArrayBase`, 在树中应该还有 获取父级链条, 对应父级记录的常用变量操作, 因此再追加一下这个常用记录

```ts | pure
type Scope<T> = {
  // ...
  // 父级节点们
  $parents: NodeLike<T>[];
}
```

剩下的, 就是根据这些基础模型, 不全对应的 `Context/hooks` 之类的常用方法即可
