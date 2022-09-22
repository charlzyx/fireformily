import { ExpressionScope, useExpressionScope } from '@formily/react';
import { lazyMerge } from '@formily/shared';
import { useMemo } from 'react';

const defaultNodeKey = (x: any) => x?.key;
const emptyArray = () => [];

const findIndex = <T extends any>(
  arr: T[],
  finder: (item: T, idx: number) => boolean,
) => {
  if (!Array.isArray(arr)) return -1;
  for (let index = 0; index < arr.length; index++) {
    const element = arr[index];
    if (finder(element, index)) {
      return index;
    }
  }
  return -1;
};

export const RootScope = <
  NodeLike extends {
    children?: NodeLike[];
  },
>(
  props: React.PropsWithChildren<{
    nodeKey: React.Key | ((node: NodeLike) => React.Key);
    getRoot: () => NodeLike[];
  }>,
) => {
  const scope = useExpressionScope();

  const { nodeKey, getRoot } = props;

  const refs = useMemo(() => {
    return new Map<React.Key, NodeLike>();
  }, []);

  return (
    <ExpressionScope
      value={{
        get $root() {
          return getRoot();
        },
        get $getKey() {
          return (node: NodeLike) => {
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

export const NodeRecordScope = <
  NodeLike extends {
    children?: NodeLike[];
  },
>(props: {
  getNode?: (root: NodeLike[]) => NodeLike;
  getParents?: (node?: NodeLike, root?: NodeLike[]) => NodeLike[];
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
      const record = getNode?.(this.$root);
      if (typeof record === 'object') {
        // return record;
        return lazyMerge(record, {
          get $lookup(): NodeLike | undefined {
            return refs.get(getKey(record)).$lookup;
          },
          get $index(): number {
            return refs.get(getKey(record)).$index;
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
      const idx = findIndex(records, (item) => {
        const itemKey = getKey(item);
        const recordKey = getKey(this.$record);
        return itemKey === recordKey;
      });

      return idx;
    },
    get $records(): NodeLike[] {
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
    get $pos() {
      const parents: NodeLike[] =
        this.$deepth > 0 ? this.$lookup?.children : this.$root!;
      const indexList: number[] = [];
      const isRoot = parents === this.$root;
      parents.reduce(
        (parent, item) => {
          const index = findIndex(parent.children!, (child: NodeLike) => {
            return getKey(child) === getKey(item);
          });
          if (index > -1) {
            indexList.push(index);
          }
          return item;
        },
        { children: parents } as NodeLike,
      );

      console.log('node scope.pos', indexList, this.$index);
      if (isRoot) {
        indexList.shift();
      }

      return [...indexList, this.$index];
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
