import { ObjectField } from '@formily/core';
import { ExpressionScope, useExpressionScope, useField } from '@formily/react';
import { lazyMerge } from '@formily/shared';
import { useMemo } from 'react';

const defaultNodeKey = (x: any) => x?.key;
const makeEmptyArray = () => [];

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

export interface ITreeRootScope<T extends { children?: T[] }> {
  $root?: T;
  $getKey?: (node: T) => React.Key,
  $refs?: Map<React.Key, T>
}

export interface ITreeNodeScope<T extends { children?: T[] }> {
  $root?: T;
  $records?: T[];
  $record?: T & ITreeNodeScope<T>;
  $lookup?: ITreeNodeScope<T>['$record'];
  $index?: number;
  $pos?: number[];
  $parents?: T[];
  $path?: string;
  $deepth?: number;
}

export const RootScope = <
  NodeLike extends {
    children?: NodeLike[];
  },
>(
  props: {
    nodeKey: React.Key | ((node: NodeLike) => React.Key);
    children?: React.ReactNode | ((scope: any) => React.ReactNode);
    getRoot?: () => NodeLike
  },
) => {
  const field = useField<ObjectField>();

  const { nodeKey, getRoot } = props;

  const refs = useMemo(() => {
    return new Map<React.Key, NodeLike>();
  }, []);

    const value: ITreeRootScope<NodeLike> = {
        get $root() {
          return typeof getRoot ==='function' ? getRoot(): field.value as any;
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
    };

  return (
    <ExpressionScope
      value={value}
    >
      {typeof props.children === 'function'
        ? props.children(value)
        : props.children}
    </ExpressionScope>
  );
};

export const NodeScope = <
  NodeLike extends {
    children?: NodeLike[];
  },
>(props: {
  getNode?: (root: NodeLike) => NodeLike;
  getParents?: (node?: NodeLike, root?: NodeLike) => NodeLike[];
  children?: React.ReactNode | ((scope: any) => React.ReactNode);
}) => {
  const scope = useExpressionScope() as ITreeRootScope<NodeLike>;
  const { getNode, getParents } = props;

  const getKey = scope?.$getKey || defaultNodeKey;
  const refs = scope?.$refs || new Map();

  const value :  ITreeNodeScope<NodeLike> = {

    get $root() {
      return scope?.$root;
    },
    get $parents() {
      const parents = getParents?.(this.$record, this.$root) || makeEmptyArray();
      console.log('$parents', { parents, record: this.$record, root: this.$root });
      return parents;
    },
    get $record() {
      const record = getNode?.(this.$root!);
      console.log('$record', { record, root: this.$root });
      if (typeof record === 'object') {
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
      const parent = parents?.[parents?.length - 1];
      // console.log('lookup parents', {parents, parent} )
      return parent ? refs.get(getKey(parent))?.$record: undefined;
    },
    get $records(): NodeLike[] {
      const parent = this.$lookup;
      return parent ? parent.children ?? makeEmptyArray(): makeEmptyArray();
    },
    get $index() {
      const records = this.$records ?? makeEmptyArray();
      const idx = findIndex(records, (item) => {
        const itemKey = getKey(item);
        const recordKey = getKey(this.$record!);
        return itemKey === recordKey;
      });

      return idx;
    },

    get $deepth() {
      return this.$parents?.length ?? 0;
    },
    get $path() {
      const parts: React.Key[] = [this.$index!];
      let parent = this.$lookup;
      while (parent) {
        parts.unshift('children');
        parts.unshift(parent.$index!);
        parent = parent.$lookup;
      }
      return parts.join('.');
    },
    get $pos() {
      const parents: NodeLike[] = this.$parents ?? makeEmptyArray();
      const indexList: number[] = [];

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


      return [...indexList, this.$index!];
    },
  };

  refs.set(getKey(value.$record!), value);

  return (
    <ExpressionScope value={value}>
      {typeof props.children === 'function'
        ? props.children(value)
        : props.children}
    </ExpressionScope>
  );
};
