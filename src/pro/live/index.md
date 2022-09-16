---
nav:
  title: 最佳?实践
group:
  title: 响应式编程 in React
  sort: 1
---

## useLive - 响应式 in React
> 也就图一乐, 响应式与 hooks 心智模型不一致, 很容易混乱, 慎用

![haha](./demos/haha.jpeg)

### 万能 🥔 丝
<code src="./demos/todos.tsx" title="土豆丝" />


### 代码演示
<code src="./demos/nobabel.tsx" title="不用 babel 插件" />

### 使用 babel 插件省略 `<Observer >` 标签嵌套

```tsx pure
// from
<Observer>{() => <div>xxx</div>}</Observer>;
// to
<div live>xxx</div>;
```

添加 babel 插件, 以 umi 为例

```js
// file: umirc.ts
{
  // ...
  extraBabelPlugins: ['fireformily/babel/plugin-jsx-element-wrapper-with-observer-by-live.js'],
  // ...
}
```

### 代码演示 - with babel

<code src="./demos/withbabel.tsx" title="不用 babel 插件" />


> 注意!: 使用 typescript 的情况下, 需要手动给 JSXElement / HTMLElement 打一个类型补丁, 使 jsx 中的标签支持 live 属性


```ts pure
// jsx-live-attr-polyfill.d.ts
namespace JSX {
  interface IntrinsicAttributes {
    live?: boolean;
  }
}
namespace React {
  interface HTMLAttributes {
    live?: boolean;
  }
}
```

### SourceCode

```js
// plugin-jsx-element-wrapper-with-observer-by-live.js
/**
 * == JSX Literals ==
 */
const { declare } = require('@babel/helper-plugin-utils');

const babel = require('@babel/core');
const template = require('@babel/template').default;
const { types: t } = babel;

const ObserverImporter = template(
  `import { Observer as FormilyObserverWrapper } from '@formily/react';`,
)();

const TAGNAME = 'live';

module.exports = declare((api, config) => {
  api.assertVersion(7);
  const visitor = {
    Program({ node }, state) {
      if (state.__observerImported) {
        return;
      } else {
        node.body.unshift(ObserverImporter);
        state.__observerImported = true;
      }
    },
    JSXAttribute(path, state) {
      const { node, parentPath } = path;
      const isTargetAttr = node.name.name === TAGNAME;
      // console.log('others', others);
      // const tagName = parent ? (parent.name ? parent.name.name : null) : null;
      if (isTargetAttr) {
        // console.log('parent.name', parent.name.name);
        // console.log('parent.type', parent.type);
        // console.log('parent', parent);
        const ele = path.findParent((ppath) => ppath.isJSXElement());
        // 嵌套情况
        const parentDone = path.findParent(
          (ppath) => ppath.isJSXElement() && ppath.state && ppath.state.__done,
        );
        if (parentDone) {
          path.remove();
          return;
        }
        if (!ele) return;
        if (ele.state && ele.state.__done) return;

        const origin = parentPath.parent;
        // console.log('origin', origin);

        const neo = t.jsxElement(
          t.jsxOpeningElement(
            t.jsxIdentifier('FormilyObserverWrapper'),
            [],
            false,
          ),
          t.jsxClosingElement(t.jsxIdentifier('FormilyObserverWrapper')),
          [
            t.jsxExpressionContainer(
              t.arrowFunctionExpression(
                [],
                t.blockStatement([t.returnStatement(origin)]),
              ),
            ),
          ],
        );
        // 移除 TAGNAME=true
        path.remove();
        ele.replaceWith(neo);
        ele.state = ele.state || {};
        ele.state.__done = true;
      }
    },
  };

  return {
    name: 'plugin-jsx-element-wrapper-with-observer-by-live',
    inherits: require('@babel/plugin-syntax-jsx').default,
    visitor,
  };
});


```
