import { ObjectField } from '@formily/core';
import { ExpressionScope, useExpressionScope, useField } from '@formily/react';
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

export interface NodeLike<T extends object = object> {
  [childField: string]: NodeLike<T> | undefined;
}

export const getHelper = (filedNames = FIELD_NAMES) => {
  return {
    formatPos: (p?: PosLike): NodePos => {
      if (!p) return [] as number[];
      return typeof p === 'string' ? p.split('-').map(Number) : p;
    },
    posToPath: (pos: number[] = []) => {
      return pos.reduce((p, item) => {
        return p
          ? `${p}.${filedNames.children}.${item}`
          : `${filedNames.children}.${item}`;
      }, '');
    },
    getNodeByPos: <T extends object>(pos: number[], root: NodeLike<T>) => {
      if (!pos || !root) return undefined;
      const ans = pos.reduce((parent: any, idx: number) => {
        const [child] = arrayField(parent, filedNames.children);
        return child[idx];
      }, root);
      return ans;
    },
  };
};

const arrayField = <T extends any>(t: T, fieldName: string) => {
  if (!Array.isArray((t as any)?.[fieldName])) {
    (t as any)[fieldName] = [];
  }
  const setter = (neo: any[]) => {
    (t as any)[fieldName] = neo;
    return (t as any)[fieldName];
  };
  return [(t as any)[fieldName] as any[], setter] as const;
};

export const getOpreations = (fieldNames = FIELD_NAMES) => {
  const helper = getHelper(fieldNames);
  return {
    remove: (posLike: PosLike, root: NodeLike) => {
      if (!root || !posLike) return;
      const pos = helper.formatPos(posLike);
      batch(() => {
        pos.reduce((target: NodeLike, at: number, index: number): NodeLike => {
          const isLast = index === pos.length - 1;
          const [child, set] = arrayField(target, fieldNames.children);
          if (isLast) {
            child.splice(at, 1);
          }
          // shallow clone
          return set([...child])[at];
        }, root);
      });
      return root;
    },
    copy: (posLike: PosLike, neo: NodeLike, root: NodeLike) => {
      if (!root || !posLike) return;
      const pos = helper.formatPos(posLike);
      batch(() => {
        pos.reduce((target: NodeLike, at: number, index: number): NodeLike => {
          const isLast = index === pos.length - 1;
          const [child, set] = arrayField(target, fieldNames.children);
          if (isLast) {
            child.splice(at + 1, 0, neo);
          }
          // shallow clone
          return set([...child]);
        }, root);
      });
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
          const [child, set] = arrayField(target, fieldNames.children);

          if (isLast) {
            const me = child[at];
            const [myChild, setMe] = arrayField(me, fieldNames.children);
            if (method === 'push') {
              myChild.push(neo);
            } else {
              myChild.unshift(neo);
            }
            return setMe([...myChild]);
          }
          return set([...child])[at];
        }, root);
      });
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
              const [child, set] = arrayField(target, fieldNames.children);
              if (isLast) {
                const formIdx = before[before.length - 1];
                const toIdx = after[after.length - 1];
                const fixToIndex = toIdx > formIdx ? toIdx + 1 : toIdx;
                const pick = child.splice(formIdx, 1)[0];
                child.splice(fixToIndex, 0, pick);
              }
              return set([...child])[at]!;
            },
            root,
          );
        } else {
          let pick = null as NodeLike | null;

          before.reduce(
            (target: NodeLike, at: number, index: number): NodeLike => {
              const isLast = index === before.length - 1;
              const [child, set] = arrayField(target, fieldNames.children);
              if (isLast) {
                pick = child.splice(at, 1)[0];
              }
              return set([...child])[at]!;
            },
            root,
          );
          if (!pick) return root;

          after.reduce(
            (target: NodeLike, at: number, index: number): NodeLike => {
              const isLast = index === after.length - 1;
              const [child, set] = arrayField(target, fieldNames.children);
              if (isLast) {
                child.splice(at, 0, pick);
              }
              return set([...child])[at];
            },
            root,
          );
        }
      });
      return root;
    },
  };
};

export interface IRootScope<T extends object> {
  $root: NodeLike<T>;
  $getKey: (node: NodeLike<T>) => React.Key;
  $refs: Map<React.Key, INodeScope<T>>;
}

export interface IRootContext<T extends object> extends IRootScope<T> {
  fieldNames: typeof FIELD_NAMES;
}

export interface INodeScope<T extends object> {
  $root: NodeLike<T>;
  $pos: number[];
  $record: NodeLike<T> & Pick<INodeScope<T>, '$lookup' | '$index'>;
  $lookup: INodeScope<T>['$record'] | NodeLike<T>;
  $records: NodeLike<T>[];
  $index: number;
  $parents: NodeLike<T>[];
  $path: string;
}

const RootContext = createContext<IRootContext<any> | null>(null);

export const useRoot = () => {
  const ctx = useContext(RootContext);
  return ctx;
};

export const useNode = (nodeKey?: React.Key) => {
  const root = useRoot();
  const ctx = useExpressionScope();
  return nodeKey ? root?.$refs.get(nodeKey) ?? ctx : ctx;
};

export const RootScope = <T extends object>(
  props: React.PropsWithChildren<{
    nodeKey?: React.Key | ((node: NodeLike<T>) => React.Key);
    getRoot: () => NodeLike<T>;
    fieldNames?: typeof FIELD_NAMES;
  }>,
) => {
  const field = useField<ObjectField>();

  const { nodeKey, children, getRoot } = props;

  const methods = useRef({
    nodeKey,
    getRoot,
  });

  // useEffect(() => {
  //   methods.current.nodeKey = props.nodeKey;
  // }, [props.nodeKey]);

  // useEffect(() => {
  //   methods.current.getRoot = props.getRoot;
  // }, [props.getRoot]);

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
            : (node as any)?.[
                nodeKey || props.fieldNames?.key || FIELD_NAMES.key
              ];
        };
      },
      get $refs() {
        return refs;
      },
    };
    return scope;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log('sosoooo much');

  return <ExpressionScope value={value}>{children}</ExpressionScope>;
};

export const NodeScope = <T extends object>(
  props: React.PropsWithChildren<{
    getPos: (root: NodeLike<T>) => PosLike;
    getNode?: (root: NodeLike<T>) => NodeLike<T>;
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
          ? root.$refs.get(root.$getKey(myParent))?.$record
          : undefined;
        return lookup ?? this.$root;
      },
      get $records() {
        return arrayField(this.$lookup, fieldNames.children)[0];
      },
      get $parents() {
        const pos = Array.isArray(this.$pos) ? [...this.$pos] : [];
        const parents: NodeLike<T>[] = [];

        pos.reduce((parent, at) => {
          parents.push(parent);
          const [child] = arrayField(parent, fieldNames.children);
          return child[at];
        }, this.$root);
        return parents;
      },
      get $index() {
        return this.$pos ? this.$pos[this.$pos.length - 1] : -1;
      },
    };
    $refs!.set(root.$getKey(scope.$record!), scope);
    return scope;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <ExpressionScope value={value}>{children}</ExpressionScope>;
};
