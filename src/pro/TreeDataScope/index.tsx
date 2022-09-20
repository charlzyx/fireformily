import { ExpressionScope, useExpressionScope } from '@formily/react';
import { lazyMerge } from '@formily/shared';
import { useMemo } from 'react';

const defaultNodeKey = (x: any) => x?.key;
const emptyArray = () => [];

export const TreeRootScope = <
  Node extends {
    children?: Node[];
  },
>(
  props: React.PropsWithChildren<{
    nodeKey: React.Key | ((node: Node) => React.Key);
    getRoot: () => Node[];
  }>,
) => {
  const scope = useExpressionScope();
  const { nodeKey, getRoot } = props;
  const refs = useMemo(() => {
    return new Map<React.Key, Node>();
  }, []);
  return (
    <ExpressionScope
      value={{
        get $root() {
          return getRoot();
        },
        get $getKey() {
          return (node: Node) => {
            return typeof nodeKey === 'function'
              ? nodeKey(node)
              : (node as any)?.[nodeKey];
          };
        },
        get $refs() {
          return refs;
        },
        get $lookup() {
          return scope?.$lookup;
        },
      }}
    >
      {props.children}
    </ExpressionScope>
  );
};

export const TreeRecordScope = <
  Node extends {
    children?: Node[];
  },
>(props: {
  getNode?: () => Node;
  getParents?: (node?: Node, root?: Node[]) => Node[];
  children?: React.ReactNode | ((scope: any) => React.ReactNode);
}) => {
  const scope = useExpressionScope();
  const { getNode, getParents } = props;

  const getKey = scope?.$getKey || defaultNodeKey;
  const refs = scope?.$refs || new Map();

  const value = {
    get $root() {
      return scope.$root;
    },
    get $record() {
      const record = getNode?.();
      if (typeof record === 'object') {
        // return record;
        return lazyMerge(record, {
          get $lookup(): Node | undefined {
            return value.$lookup;
          },
          get $index(): number {
            return value.$index;
          },
        } as any);
      } else {
        return record;
      }
    },
    get $lookup() {
      const parents = this.$parents;
      const parent = parents?.[parents?.length - 1] || this.$root;
      const lookup = parent
        ? refs.get(getKey(parent))?.$record ?? this.$root
        : this.$root;
      return lookup;
    },
    get $index() {
      const records = this.$records;
      const idx = records.findIndex(
        (x: Node) => getKey(x) === getKey(this.$record),
      );
      return idx;
    },
    get $records(): Node[] {
      const parent = this.$lookup;
      return parent
        ? Array.isArray(parent)
          ? parent
          : parent.children
        : emptyArray();
    },
    get $parents() {
      const parents = getParents?.(this.$record, this.$root) || emptyArray();
      return parents;
    },
    get $deepth() {
      return this.$parents.length;
    },
    get $name() {
      const parts: React.Key[] = [this.$index];
      let parent = this.$lookup;
      while (parent && parent !== this.$root) {
        parts.unshift('children');
        parts.unshift(parent.$index);
        parent = parent.$lookup;
      }
      return parts.join('.');
    },
  };
  refs.set(getKey(value.$record), value);

  return (
    <ExpressionScope value={value}>
      {typeof props.children === 'function'
        ? props.children(value)
        : props.children}
    </ExpressionScope>
  );
};
