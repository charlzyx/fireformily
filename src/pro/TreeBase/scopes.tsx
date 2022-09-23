import { ObjectField } from '@formily/core';
import { ExpressionScope, useExpressionScope, useField } from '@formily/react';
import { lazyMerge } from '@formily/shared';
import { useEffect, useMemo, useRef } from 'react';

export type NodePos = string | number[];

const defaultNodeKey = (x: any) => x?.key;

const posToPath = (pos: number[] = []) => {
  return pos.reduce((p, item) => {
    return p ? `${p}.children.${item}` : `children.${item}`;
  }, '');
};

export interface IRootScope<T extends { children?: T[] }> {
  $root?: T;
  $getKey?: (node: T) => React.Key;
  $refs?: Map<React.Key, INodeScope<T>>;
}

export interface INodeScope<T extends { children?: T[] }> {
  $root?: T;
  $pos?: number[];
  $record?: T & Pick<INodeScope<T>, '$lookup' | '$index'>;
  // root is T
  $lookup?: INodeScope<T>['$record'] | T;
  $records?: T[];
  $parents?: INodeScope<T>['$record'][];
  $index?: number;
  $path?: string;
}

export const RootScope = <
  NodeLike extends {
    children?: NodeLike[];
  },
>(
  props: React.PropsWithChildren<{
    nodeKey: React.Key | ((node: NodeLike) => React.Key);
    getRoot?: () => NodeLike;
  }>,
) => {
  const field = useField<ObjectField>();

  const { nodeKey, children, getRoot } = props;

  const methods = useRef({
    nodeKey,
    getRoot,
  });

  useEffect(() => {
    methods.current.nodeKey = props.nodeKey;
  }, [props.nodeKey]);

  useEffect(() => {
    methods.current.getRoot = props.getRoot;
  }, [props.getRoot]);

  const value = useMemo(() => {
    const refs = new Map<React.Key, INodeScope<NodeLike>>();
    const scope: IRootScope<NodeLike> = {
      get $root() {
        return typeof methods.current.getRoot === 'function'
          ? methods.current.getRoot()
          : (field.value as any);
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
    return scope;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <ExpressionScope value={value}>{children}</ExpressionScope>;
};

const getNodeByPos = <NodeLike extends { children?: NodeLike[] }>(
  pos: number[],
  root: NodeLike,
) => {
  if (!pos || !root) return undefined;
  const ans = pos.reduce((parent: any, idx: number) => {
    const item = parent?.children?.[idx];
    return item;
  }, root);
  return ans;
};

export const NodeScope = <
  NodeLike extends {
    children?: NodeLike[];
  },
>(
  props: React.PropsWithChildren<{
    getPos: (root: NodeLike) => NodePos;
    getNode?: (root: NodeLike) => NodeLike;
  }>,
) => {
  const root = useExpressionScope() as IRootScope<NodeLike>;

  const { getPos, getNode, children } = props;

  const live = useRef({
    getPos,
    getNode,
  });

  useEffect(() => {
    live.current.getPos = props.getPos;
  }, [props.getPos]);

  useEffect(() => {
    live.current.getNode = props.getNode;
  }, [props.getNode]);

  const getKey = root?.$getKey || defaultNodeKey;

  const value = useMemo(() => {
    if (!root?.$root) return {};
    const refs = root.$refs!;
    const scope: INodeScope<NodeLike> = {
      get $root() {
        return root.$root;
      },
      get $pos() {
        const ret = live.current?.getPos?.(root.$root!);
        const ans = ret
          ? typeof ret === 'string'
            ? ret.split('-').map(Number)
            : ret
          : [];
        return ans;
      },

      get $path() {
        return posToPath(this.$pos);
      },

      get $record() {
        const record =
          typeof live.current?.getNode === 'function'
            ? live.current.getNode(root.$root!)
            : getNodeByPos(this.$pos!, this.$root!);

        if (typeof record === 'object') {
          return lazyMerge(record, {
            get $lookup() {
              return scope.$lookup;
            },
            get $index() {
              return scope.$index;
            },
            get $pos() {
              return scope.$pos;
            },
          } as any);
        } else {
          return record;
        }
      },
      get $lookup() {
        // 去掉最后一个
        const parentPos = this.$pos?.slice(0, this.$pos.length - 1) || [];
        // console.log('parentPos', parentPos, 'now', this.$pos);
        const lookup = refs.get(parentPos.join('_'))?.$record;
        // console.log('lookup', lookup, lookup?.children);
        return lookup ?? this.$root;
      },
      get $records() {
        return this.$lookup?.children;
      },
      get $parents() {
        const pos = Array.isArray(this.$pos) ? [...this.$pos] : [];
        const parents = [];
        while (pos.length) {
          parents.push(refs.get(pos.join('_'))?.$record);
          pos.pop();
        }
        parents.reverse();
        return parents!;
      },
      get $index() {
        return this.$pos ? this.$pos[this.$pos.length - 1] : -1;
      },
    };
    refs!.set(getKey(scope.$record!), scope);
    refs!.set(scope.$pos?.join('_')!, scope);
    return scope;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <ExpressionScope value={value}>{children}</ExpressionScope>;
};
