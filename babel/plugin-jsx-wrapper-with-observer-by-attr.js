/**
 * == JSX Literals ==
 */
 const declare = require('@babel/helper-plugin-utils').declare;
 const babel = require('@babel/core');

 const imports = require('@babel/helper-module-imports');
 const generate = require('@babel/generator').default;
 const template = require('@babel/template').default;

 const { types: t } = babel;

 const sources = {
   '@formily/react': '@formily/react',
   '@formily/reactive-react': '@formily/reactive-react'
 };

 /**
  * if has imported * return imported id,
  * or , inject a new namedImoprt by @babel/helper-module-imports
  * then return the new imported id
  */
 const ensureObserverImported = (
   path,
 ) => {
   const root = path.findParent(ppath => t.isProgram(ppath));

   let observerJsxIdName = null;

   // 现在查找现在 import lines 是否存在 Observer 的导入
   root.get("body").forEach(subpath => {
     if (t.isImportDeclaration(subpath)) {
       const impSource = subpath.node.source.value;
       const isSourceMatch = sources[impSource];
       if (isSourceMatch) {
         const specifiers = subpath.node.specifiers;
         const spec = specifiers.find(x => x.imported.name === 'Observer')
         if (spec) {
           observerJsxIdName = spec.local ? spec.local.name : spec.imported.name;
         }
       }
     }
   })

   // 不存在的话，插入一条新的 import
   if (!observerJsxIdName) {
     /** 不用担心命名冲突的问题， 这个imoprt module库帮我们处理过了 */
     const injected = imports.addNamed(root, 'Observer', '@formily/react', {
       nameHint: 'FormilyReactObserver',
       importedInterop: "uncompiled",
       // 保证引用计算准确， 不然可能会因为 没有引用而被清理掉
       ensureLiveReference: true,
     });

     observerJsxIdName = injected.name;
   }

   return observerJsxIdName;
 }



 module.exports = declare(
   (api, config) => {
     api.assertVersion(7);
     const TAGNAME = config.attr || 'live';

     /**
      * @type import('@babel/core').Visitor
      */
     const visitor = {
       JSXAttribute(path, state) {
         const { node } = path;
         const isAttrMatch = node.name.name === TAGNAME;
         if (isAttrMatch) {
           const jsxEl = path.findParent((ppath) => ppath.isJSXElement());
           /**
            * visitor 是深度遍历， 当发现父级是已经包装过的话，当前就不用再重复包装了
            * 比如
            * <div live>
            *    <div></div>
            *    <div live>inner</div>  // 这个就不会被重新包装
            * </div>
            * 会转换成
            * <Observer>
            *  {() => {
            *   return <div>
            *    <div></div>
            *    <div>inner</div>  // 这个就不会被重新包装
            *  </div>
            * }}
            * </Observer>
            */
           const hasParentParentDone = path.findParent(
             (ppath) => ppath.isJSXElement() && ppath.state && ppath.state.__done,
           );
           if (hasParentParentDone) {
             path.remove();
             return;
           }
           if (jsxEl.state && jsxEl.state.__done) return;

           /**
            * 获取生成的 Id 名称
            */
           const wrapperIdName = ensureObserverImported(path);

           /**
            * 查找是 父级否存在手工处理， 如果存在，则跳过, 忽略掉自动处理
            */
           const isHumanWrapped = path.findParent(ppath => {
             if (ppath.isProgram()) return;

             if (ppath.isJSXElement()) {
               const jsxIdName = ppath.node.openingElement.name.name;
               // same id name
               if (wrapperIdName === jsxIdName) {
                 const myBinding = path.scope.getBinding(wrapperIdName);
                 const currentBinding = ppath.scope.getBinding(wrapperIdName);
                 const isSameBinding = myBinding === currentBinding;
                 // same var declaration
                 return isSameBinding;
               };
             }

           })

           if (isHumanWrapped) return;

           /**
            * 拼装新的 ast
            * <div live>xxx</div>
            * to
            * <_FormilyReactObserver>
            *  {() => <div live>xxx</div>}
            * </_FormilyReactObserver>
            *
            */
           const origin = jsxEl.node;

           const neo = t.jsxElement(
             t.jsxOpeningElement(
               t.jsxIdentifier(wrapperIdName),
               [],
               false,
             ),
             t.jsxClosingElement(
               t.jsxIdentifier(wrapperIdName),
             ),
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
           jsxEl.replaceWith(neo);
           jsxEl.state = jsxEl.state || {};
           jsxEl.state.__done = true;
         }
       }

     };

     return {
       name: 'plugin-jsx-wrapper-with-observer-by-attr',
       visitor,
     };
   },
 );
