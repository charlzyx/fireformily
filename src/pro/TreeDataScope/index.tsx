import { ExpressionScope, useExpressionScope } from '@formily/react';
import { lazyMerge } from '@formily/shared';

const compare = (a: any, b: any) => a === b;

export const TreeRecordScope = <
  T extends {
    children?: T[];
  },
>(
  props: React.PropsWithChildren<{
    getNode?: () => T;
    getRoot?: () => T[];
    getParents?: (node?: T, root?: T[]) => T[];
    eq?: (a: T, b: T) => boolean;
  }>,
) => {
  const scope = useExpressionScope();
  const { getNode, getRoot, getParents, eq } = props;
  const isSame = eq || compare;

  return (
    <ExpressionScope
      value={{
        get $record() {
          const record = getNode?.();
          return record;
        },
        get $lookup() {
          const parents = this.$parents || [];
          let deep = parents.length - 1;
          const parent = parents[deep] || this.$root;
          const root = this.$root;
          return lazyMerge(parent, {
            get $lookup() {
              const parentParent = getParents?.(parent, root);
              console.log('parentParent', parentParent);
              return parentParent?.[parentParent?.length - 1];
            },
          });
        },
        get $records() {
          const parents = this.$parents || [];
          return parents[parents.length - 1]?.children || scope.$root;
        },
        get $index() {
          const node = this.$record;
          const parents = this.$parents || [];

          const slibings = parents[parents.length - 1]?.children || this.$root;

          const idx = slibings.findIndex((x: T) => isSame(x, node));

          return idx;
        },
        get $parents() {
          const root = this.$root;
          const node = this.$record;
          const parents = getParents?.(node, root) || [];

          return parents;
        },
        get $root() {
          const root = getRoot?.() || scope.$root;
          return root;
        },
        get $deepth() {
          const parents = this.$parents || [];

          return parents.length;
        },
      }}
    >
      {props.children}
    </ExpressionScope>
  );
};
