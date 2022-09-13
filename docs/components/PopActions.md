## PopActions - 弹窗动作 WIP

PopActions 是为了解决常见的 Popover/Popconfirm/Modal/Drawer 弹窗编辑子表单模板代码的问题

## 为什么不是 [FormDialog](https://antd.formilyjs.org/zh-CN/components/form-dialog#formdialog-1)/[FormDrawer](https://antd.formilyjs.org/zh-CN/components/form-drawer#formdrawer-1) ?

这两个都是方法调用，不能用 json 描述出来， 所以 ` FormDialog/FormDrawer` 更适合用于更灵活的场景，针对常见的弹出表单处理逻辑， 可以尝试归纳为为三个固定的动作

```
- open    // 打开
- cancel  // 取消
- confirm // 确定
```

全部转换成表单领域的术语，在加上 `Promise` 包装, 可以这样来表示

```ts
interface Action {
  /** 加载初始值 **/
  load: (record: Record) => Promise<Data>,
  /** 重置表单， 关闭弹窗 **/
  reset: () => Promise<void>,
  /** 提交表单， 关闭弹窗 **/
  submit: (data: Data) => Promise<any>,
}
```

先来理解一下 formily 作者提到的 [标准化CRUD作用域变量规范](https://github.com/alibaba/formily/discussions/3207) 的概念, 这里是 [React 实现#RecordScope](https://react.formilyjs.org/zh-CN/api/components/record-scope), 这里是实际使用场景 [@formily/antd#ArrayBase.Item](https://github.com/alibaba/formily/blob/formily_next/packages/antd/src/array-base/index.tsx#L132)

这里面的 `$record` 概念理解开来~~格局打开~~, 也就是我们 `load` 中的 `record`，作为消费 `$record` 的一个组件, 那么，这个动作的泛用性就很广了

最常见的

ArrayTable 中，弹窗编辑WIP...
