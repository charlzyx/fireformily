import { ObjectField } from '@formily/core';
import { ExpressionScope, useField } from '@formily/react';
import { lazyMerge } from '@formily/shared';
import { batch } from '@formily/reactive';
import { useEffect, useMemo, useRef, createContext, useContext } from 'react';

export type PosLike = string | number[];
export type NodePos = number[];

export const FIELD_NAMES = {
  title: 'label',
  key: 'value',
  children: 'children',
};

export const markDirty = <T extends any>(o: T, bool: boolean) => {
  // setTimeout(() => {
  (o as any).__dirty = true;
  // });
  return o;
};

export type NodeLike<T extends object = object> = {
  [childField: string]: NodeLike<T>;
} & T;

export const getHelper = (fieldNames = FIELD_NAMES) => {
  const pickChildren = (o: any): undefined | any[] => o?.[fieldNames.children];

  return {
    formatPos: (p?: PosLike): NodePos => {
      if (!p) return [] as number[];
      return typeof p === 'string' ? p.split('-').map(Number) : p;
    },
    posToPath: (pos: number[] = []) => {
      return pos.reduce((p, item) => {
        return p
          ? `${p}.${fieldNames.children}.${item}`
          : `${fieldNames.children}.${item}`;
      }, '');
    },
    getNodeByPos: <T extends object>(pos: number[], root: NodeLike<T>) => {
      if (!pos || !root) return undefined;
      const ans = pos.reduce((parent: any, idx: number) => {
        const arr = pickChildren(parent);
        return arr?.[idx];
      }, root);
      return ans;
    },
  };
};

export const getOpreations = (fieldNames = FIELD_NAMES) => {
  const helper = getHelper(fieldNames);
  const pickChildren = (o: any): undefined | any[] => o?.[fieldNames.children];
  return {
    remove: (posLike: PosLike, root: NodeLike) => {
      if (!root || !posLike) return;
      const pos = helper.formatPos(posLike);
      batch(() => {
        pos.reduce((target: NodeLike, at: number, index: number): NodeLike => {
          const isLast = index === pos.length - 1;
          if (isLast) {
            pickChildren(target)?.splice(at, 1);
          }
          // shallow clone
          return pickChildren(target)![at];
        }, root);
      });
      markDirty(root, true);
      return root;
    },
    copy: (posLike: PosLike, neo: NodeLike, root: NodeLike) => {
      if (!root || !posLike) return;
      const pos = helper.formatPos(posLike);
      batch(() => {
        pos.reduce((target: NodeLike, at: number, index: number): NodeLike => {
          const isLast = index === pos.length - 1;
          const children = pickChildren(target);

          if (isLast) {
            children?.splice(at + 1, 0, neo);
          }
          // shallow clone
          return children![at];
        }, root);
      });
      markDirty(root, true);
      return root;
    },
    appendChildren: (posLike: PosLike, root: NodeLike, list: NodeLike[]) => {
      if (!root || !posLike) return;
      const pos = helper.formatPos(posLike);
      batch(() => {
        pos.reduce((target: NodeLike, at: number, index: number): NodeLike => {
          const isLast = index === pos.length - 1;
          const children = pickChildren(target);
          if (isLast) {
            children![at][fieldNames.children] = list;
          }
          return children![at];
        }, root);
      });
      markDirty(root, true);
      return root;
    },
    append: (
      posLike: PosLike,
      root: NodeLike,
      neo: NodeLike,
      method: 'unshift' | 'push' = 'push',
    ) => {
      if (!root || !posLike) return;
      const pos = helper.formatPos(posLike);
      batch(() => {
        pos.reduce((target: NodeLike, at: number, index: number): NodeLike => {
          const isLast = index === pos.length - 1;
          const children = pickChildren(target);
          if (isLast) {
            const me = children?.[at];
            if (!me[fieldNames.children]) {
              me[fieldNames.children] = [];
            }
            const myChildren = pickChildren(me);
            console.log('myChildren', myChildren);
            if (method === 'push') {
              myChildren!.push(neo);
            } else {
              myChildren!.unshift(neo);
            }
            return me;
          }
          return children![at];
        }, root);
      });
      console.log('markddirty');
      markDirty(root, true);
      return root;
    },
    move: (before: NodePos, after: NodePos, root: NodeLike) => {
      if (JSON.stringify(before) === JSON.stringify(after)) return root;

      batch(() => {
        const sameLevel =
          before.length === after.length &&
          before.slice(0, before.length - 1).join('_') ===
            after.slice(0, after.length - 1).join('_');
        if (sameLevel) {
          before.reduce(
            (target: NodeLike, at: number, index: number): NodeLike => {
              const isLast = index === before.length - 1;
              const children = pickChildren(target);

              if (isLast) {
                const formIdx = before[before.length - 1];
                const toIdx = after[after.length - 1];
                const fixToIndex = toIdx > formIdx ? toIdx + 1 : toIdx;
                const pick = children!.splice(formIdx, 1)[0];
                children!.splice(fixToIndex, 0, pick);
              }
              return children![at];
            },
            root,
          );
        } else {
          let pick = null as NodeLike | null;

          before.reduce(
            (target: NodeLike, at: number, index: number): NodeLike => {
              const isLast = index === before.length - 1;
              const children = pickChildren(target);
              if (isLast) {
                pick = children!.splice(at, 1)[0];
              }
              return children![at];
            },
            root,
          );
          if (!pick) return root;

          after.reduce(
            (target: NodeLike, at: number, index: number): NodeLike => {
              const isLast = index === after.length - 1;
              const children = pickChildren(target);

              if (isLast) {
                children!.splice(at, 0, pick);
              }
              return children![at];
            },
            root,
          );
        }
      });
      markDirty(root, true);
      return root;
    },
  };
};

export interface IRootScope<T extends object> {
  $root: NodeLike<T>;
  fieldNames: typeof FIELD_NAMES;
  $refs: Map<React.Key, INodeScope<T>>;
}

export interface IRootContext<T extends object> extends IRootScope<T> {}

export interface INodeScope<T extends object> {
  $root: NodeLike<T>;
  $pos: number[];
  $record: NodeLike<T> & Pick<INodeScope<T>, '$lookup' | '$index'>;
  $lookup: INodeScope<T>['$record'] | NodeLike<T>;
  $records: NodeLike<T>[];
  $index: number;
  $parents: NodeLike<T>[];
  $path: string;
  $extra?: Record<string, any> & {
    expanded?: boolean;
    checked?: boolean;
    selected?: boolean;
    halfChecked?: boolean;
  };
}

export interface INodeContext<T extends object> extends INodeScope<T> {}

const RootContext = createContext<IRootContext<any> | null>(null);
const NodeContext = createContext<INodeContext<any> | null>(null);

export const useRoot = () => {
  const ctx = useContext(RootContext);
  return ctx;
};

export const useNode = (nodeKey?: React.Key) => {
  const root = useRoot();
  const ctx = useContext(NodeContext);
  return nodeKey ? root?.$refs.get(nodeKey) ?? ctx : ctx;
};

export const RootScope = <T extends object>(
  props: React.PropsWithChildren<{
    getRoot: () => NodeLike<T>;
    fieldNames?: typeof FIELD_NAMES;
  }>,
) => {
  const field = useField<ObjectField>();

  const { children, getRoot } = props;

  const fieldNames = useMemo(() => {
    return { ...FIELD_NAMES, ...props.fieldNames };
  }, [props.fieldNames]);

  const methods = useRef({
    getRoot,
  });

  const value = useMemo(() => {
    const refs = new Map<React.Key, INodeScope<T>>();
    const scope: IRootScope<T> = {
      get $root() {
        return typeof methods.current.getRoot === 'function'
          ? methods.current.getRoot()
          : (field.value as any);
      },
      get fieldNames() {
        return fieldNames;
      },
      get $refs() {
        return refs;
      },
    };
    return scope;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RootContext.Provider value={value}>
      <ExpressionScope value={value}>{children}</ExpressionScope>
    </RootContext.Provider>
  );
};

export const NodeScope = <T extends object>(
  props: React.PropsWithChildren<{
    getPos: (root: NodeLike<T>) => PosLike;
    getNode?: (root: NodeLike<T>) => NodeLike<T>;
    getExtra?: (root: NodeLike<T>) => INodeScope<T>['$extra'];
  }>,
) => {
  const root = useRoot();

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

  const value = useMemo(() => {
    if (!root) return {} as any;
    const helper = getHelper(root.fieldNames);
    const { $refs, fieldNames } = root;

    const scope: INodeScope<T> = {
      get $root() {
        return root.$root;
      },
      get $pos() {
        const ret = methods.current.getPos(root.$root);
        return helper.formatPos(ret);
      },
      get $path() {
        return helper.posToPath(this.$pos);
      },
      get $extra() {
        return props.getExtra?.(this.$root);
      },
      get $record() {
        const record =
          typeof methods.current.getNode === 'function'
            ? methods.current.getNode(root.$root)
            : helper.getNodeByPos(this.$pos, this.$root);

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
        const myParent = helper.getNodeByPos(parentPos, this.$root);

        const lookup = myParent
          ? root.$refs.get(myParent?.[fieldNames.key])?.$record
          : undefined;
        return lookup ?? this.$root;
      },
      get $records() {
        return (this.$lookup?.[fieldNames.children] as any) ?? [];
      },
      get $parents() {
        const pos = Array.isArray(this.$pos) ? [...this.$pos] : [];
        const parents: NodeLike<T>[] = [];

        pos.reduce((parent, at) => {
          parents.push(parent);
          const child = parent[fieldNames.children][at];
          return child;
        }, this.$root);
        return parents;
      },
      get $index() {
        return this.$pos ? this.$pos[this.$pos.length - 1] : -1;
      },
    };
    $refs!.set((scope.$record as any)?.[fieldNames.key], scope);
    return scope;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NodeContext.Provider value={value}>
      <ExpressionScope value={value}>{children}</ExpressionScope>
    </NodeContext.Provider>
  );
};
