import { ObjectField } from '@formily/core';
import { ExpressionScope, useExpressionScope, useField } from '@formily/react';
import { lazyMerge } from '@formily/shared';
import { batch } from '@formily/reactive';
import { createContext, useContext, useEffect, useMemo, useRef } from 'react';

export type NodePos = string | number[];
export type NumberPos = number[];

export type NodeLike<T extends object = object> = T & {
  children?: NodeLike<T>[];
};

const defaultNodeKey = (x: any) => x?.key;

export const helper = {
  formatPos: (p: NodePos): NumberPos => {
    if (!p) return [] as number[];
    return typeof p === 'string' ? p.split('-').map(Number) : p;
  },
  posToPath: (pos: number[] = []) => {
    return pos.reduce((p, item) => {
      return p ? `${p}.children.${item}` : `children.${item}`;
    }, '');
  },
  getNodeByPos: <T extends object>(pos: number[], root: NodeLike<T>) => {
    if (!pos || !root) return undefined;
    const ans = pos.reduce((parent: any, idx: number) => {
      const item = parent?.children?.[idx];
      return item;
    }, root);
    return ans;
  },
};

export const opreations = {
  remove: (posLike: NodePos, root: NodeLike) => {
    if (!root || !posLike) return;
    const pos = helper.formatPos(posLike);
    console.log('before remove', JSON.stringify(root, null, 2));
    pos.reduce((target: NodeLike, at: number, index: number): NodeLike => {
      const isLast = index === pos.length - 1;
      if (isLast) {
        target.children?.splice(at, 1);
        console.log('after remove', JSON.stringify(root, null, 2));
      }
      return target.children![at]!;
    }, root);
  },
  copy: (
    posLike: NodePos,
    root: NodeLike,
    clone: (old: NodeLike) => NodeLike,
  ) => {
    if (!root || !posLike) return;
    const pos = helper.formatPos(posLike);
    pos.reduce((target: NodeLike, at: number, index: number): NodeLike => {
      const isLast = index === pos.length - 1;
      if (isLast) {
        const old = target.children?.[at];
        const neo = clone(old!);
        target.children?.splice(at + 1, 0, neo);
      }
      return target.children![at]!;
    }, root);
  },
  add: (posLike: NodePos, root: NodeLike, neo: NodeLike) => {
    if (!root || !posLike) return;
    const pos = helper.formatPos(posLike);
    pos.reduce((target: NodeLike, at: number, index: number): NodeLike => {
      const isLast = index === pos.length - 1;
      if (isLast) {
        const me = target.children?.[at];
        if (!me) return target;
        if (!me.children) {
          (me as any).loading = true;
          me.children = [];
          (me as any).loading = false;
        }
        me.children.push(neo);
        // me.children?.splice(at + 1, 0, neo);
        return me;
      }
      return target.children![at]!;
    }, root);
  },
  move: (before: number[], after: number[], root: NodeLike) => {
    if (JSON.stringify(before) === JSON.stringify(after)) return;

    let from = {
      parent: null as NodeLike | null,
      idx: -1,
    };

    before.reduce((target: NodeLike, at: number, index: number): NodeLike => {
      const isLast = index === before.length - 1;
      if (isLast) {
        from.parent = target as any;
        from.idx = at;
      }
      return target.children![at]!;
    }, root);
    // console.log(
    //   'before.after',
    //   JSON.stringify({ before, after, tmp: (tmp as any).label }),
    // );
    let to = {
      parent: null as NodeLike | null,
      idx: -1,
    };

    after.reduce((target: NodeLike, at: number, index: number): NodeLike => {
      const isLast = index === after.length - 1;
      if (isLast) {
        to.parent = target;
        to.idx = at;
      }
      return target.children![at]!;
    }, root);

    batch(() => {
      const moving = from.parent?.children![from.idx];
      from.parent?.children?.splice(from.idx, 1);
      to.parent?.children!.splice(to.idx, 0, moving!);
    });
  },
};

export interface IRootScope<T extends object> {
  $root: NodeLike<T>;
  $getKey: (node: NodeLike<T>) => React.Key;
  $refs: Map<React.Key, INodeScope<T>>;
}

export interface IRootContext<T extends object> extends IRootScope<T> {}

export const RootContext = createContext<IRootContext<any> | null>(null);

export const useRoot = () => {
  return useContext(RootContext);
};

export interface INodeScope<T extends object> extends IRootScope<T> {
  $pos: number[];
  $record: NodeLike<T> & Pick<INodeScope<T>, '$lookup' | '$index'>;
  $lookup: INodeScope<T>['$record'] | NodeLike<T>;
  $records: NodeLike<T>[];
  $index: number;
  $parents: NodeLike<T>[];
  $path: string;
}

export const RootScope = <T extends object>(
  props: React.PropsWithChildren<{
    nodeKey: React.Key | ((node: NodeLike<T>) => React.Key);
    getRoot?: () => NodeLike<T>;
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
    const refs = new Map<React.Key, INodeScope<T>>();
    const scope: IRootScope<T> = {
      get $root() {
        return typeof methods.current.getRoot === 'function'
          ? methods.current.getRoot()
          : (field.value as any);
      },
      get $getKey() {
        return (node: NodeLike<T>) => {
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

  return (
    <ExpressionScope value={value}>
      <RootContext.Provider value={value}>{children}</RootContext.Provider>
    </ExpressionScope>
  );
};

export const NodeScope = <T extends object>(props: {
  getPos: (root: NodeLike<T>) => NodePos;
  getNode?: (root: NodeLike<T>) => NodeLike<T>;
  children: React.ReactNode | ((scope: INodeScope<T>) => React.ReactNode);
}) => {
  const root = useExpressionScope() as IRootScope<T>;

  const { getPos, getNode, children } = props;

  const methods = useRef({
    getPos,
    getNode,
  });

  useEffect(() => {
    methods.current.getPos = props.getPos;
  }, [props.getPos]);

  useEffect(() => {
    methods.current.getNode = props.getNode;
  }, [props.getNode]);

  const getKey = root?.$getKey || defaultNodeKey;

  const value = useMemo(() => {
    if (!root?.$root) return {} as any;
    const refs = root.$refs!;
    const scope: INodeScope<T> = {
      get $getKey() {
        return root.$getKey;
      },
      get $refs() {
        return root.$refs;
      },
      get $root() {
        return root.$root;
      },
      get $pos() {
        const ret = methods.current?.getPos?.(root.$root!);

        const ans = ret
          ? typeof ret === 'string'
            ? ret.split('-').map(Number)
            : ret
          : [];
        return ans;
      },

      get $path() {
        return helper.posToPath(this.$pos);
      },

      get $record() {
        const record =
          typeof methods.current?.getNode === 'function'
            ? methods.current.getNode(root.$root!)
            : helper.getNodeByPos(this.$pos!, this.$root!);

        const isRoot = record === this.$root;

        if (isRoot) {
          return record;
        } else if (typeof record === 'object') {
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
        const myParent = helper.getNodeByPos(parentPos, this.$root);

        const lookup = myParent
          ? this.$refs.get(this.$getKey(myParent))?.$record
          : undefined;
        // const lookup = refs.get(parentPos.join('_'))?.$record;
        // console.log('lookup', lookup, lookup?.children);
        return lookup ?? this.$root;
      },
      get $records() {
        return this.$lookup?.children ?? [];
      },
      get $parents() {
        const pos = Array.isArray(this.$pos) ? [...this.$pos] : [];
        const parents: NodeLike<T>[] = [];

        pos.reduce((parent, at) => {
          parents.push(parent);
          return parent.children?.[at]!;
        }, this.$root);
        return parents;
      },
      get $index() {
        return this.$pos ? this.$pos[this.$pos.length - 1] : -1;
      },
    };
    refs!.set(getKey(scope.$record!), scope);
    return scope;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ExpressionScope value={value}>
      {typeof children === 'function' ? children(value) : children}
    </ExpressionScope>
  );
};
