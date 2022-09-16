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
      const existed = node.body.find((im) => {
        const isImportDeclaration = t.isImportDeclaration(im);
        if (isImportDeclaration) {
          const source = im.source.value === '@formily/react';
          const spec = im.specifiers.find((sp) => {
            return sp.imported && sp.imported.name === 'Observer';
          });
          return spec && source;
        }
        return false;
      });
      if (state.__observerImported || existed) {
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
