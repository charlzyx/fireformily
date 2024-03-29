import { ExpressionScope } from '@formily/react';
import { lazyMerge } from '@formily/shared';
import { createContext, useContext, useMemo, useRef } from 'react';
import { getHelper } from './helper';

export type NodePos = number[];

export const FIELD_NAMES = {
  title: 'label',
  key: 'value',
  children: 'children',
};

export type NodeLike<T extends object = object> = Record<string, NodeLike<T>[]> & T;

export interface IRootScope<T extends object> {
  $root: NodeLike<T>;
  $refs: Map<React.Key, INodeScope<T>>;
  $fieldNames: typeof FIELD_NAMES;
  $helper: ReturnType<typeof getHelper>;
}

export interface INodeScope<T extends object> {
  $root: NodeLike<T>;
  $pos: number[];
  $record: NodeLike<T> & Pick<INodeScope<T>, '$lookup' | '$index'>;
  $lookup: INodeScope<T>['$record'] | NodeLike<T>;
  $records: NodeLike<T>[];
  $index: number;
  $parents: NodeLike<T>[];
  $path?: string;
  $extra?: Record<string, any> & {
    expanded?: boolean;
    checked?: boolean;
    selected?: boolean;
    halfChecked?: boolean;
  };
}

const RootContext = createContext<IRootScope<any> | null>(null);
const NodeContext = createContext<INodeScope<any> | null>(null);

export const useRoot = () => {
  const ctx = useContext(RootContext);
  return ctx;
};

export const useHelper = () => {
  const root = useRoot();
  return root?.$helper;
};

export const useNode = (keyOrPos?: React.Key | NodePos) => {
  const root = useRoot();
  const ctx = useContext(NodeContext);

  if (keyOrPos) {
    const key = Array.isArray(keyOrPos)
      ? root?.$helper.take(root?.$helper.getNodeAtPos(keyOrPos)).key
      : keyOrPos;
    return root?.$refs.get(key!);
  }
  return ctx;
};

export const RootScope = <T extends object>(
  props: React.PropsWithChildren<{
    getRoot: () => NodeLike<T>;
    fieldNames?: Partial<typeof FIELD_NAMES>;
  }>,
) => {
  const { children, getRoot } = props;

  const methods = useRef({
    getRoot,
  });

  const value = useMemo(() => {
    const refs = new Map<React.Key, INodeScope<T>>();
    const names = { ...FIELD_NAMES, ...props.fieldNames };
    const helper = getHelper(
      {
        root: methods.current.getRoot(),
      },
      names,
    );
    const scope: IRootScope<T> = {
      get $root() {
        const root = methods.current.getRoot();
        return root;
      },
      get $helper() {
        return helper;
      },
      get $fieldNames() {
        return names;
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

export const NodeScope = <T extends object>(
  props: React.PropsWithChildren<{
    getPos: (root: NodeLike<T>) => NodePos;
    getNode?: (root: NodeLike<T>) => NodeLike<T>;
    getExtra?: (root: NodeLike<T>) => INodeScope<T>['$extra'];
  }>,
) => {
  const root = useRoot();

  const { getPos, getNode, children } = props;

  const methods = useRef({
    getPos,
    getNode,
    disposer: () => {},
  });

  const value = useMemo(() => {
    if (!root) return null;
    const { $refs, $helper } = root;

    const scope: INodeScope<T> = {
      get $root() {
        return root.$root;
      },
      get $pos() {
        return methods.current.getPos(root.$root);
      },
      get $path() {
        return $helper.posToPath(this.$pos);
      },
      get $extra() {
        return props.getExtra?.(this.$root);
      },

      get $record() {
        const record =
          typeof methods.current.getNode === 'function'
            ? methods.current.getNode(root.$root)
            : $helper.getNodeAtPos(this.$pos);

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
        const parent = $helper.getNodeAtPos(parentPos);

        const lookup = parent ? root.$refs.get($helper.take(parent).key!)?.$record : undefined;
        return lookup ?? this.$root;
      },
      get $records() {
        return $helper.take(this.$lookup).children ?? [];
      },
      get $parents() {
        const pos = Array.isArray(this.$pos) ? [...this.$pos] : [];
        const parents: NodeLike<T>[] = [];

        pos.reduce((parent, at) => {
          parents.push(parent);
          const child = $helper.take(parent).children?.[at];
          return child;
        }, this.$root);
        return parents;
      },
      get $index() {
        return this.$pos ? this.$pos[this.$pos.length - 1] : -1;
      },
    };
    const nodeKey = $helper.take(scope.$record).key!;
    $refs.set(nodeKey, scope);

    return scope;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NodeContext.Provider value={value}>
      <ExpressionScope value={value}>{children}</ExpressionScope>
    </NodeContext.Provider>
  );
};
