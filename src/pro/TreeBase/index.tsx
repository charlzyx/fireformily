import { ToTopOutlined } from '@ant-design/icons';
import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';
import { ObjectField } from '@formily/core';
import {
  Schema,
  useExpressionScope,
  useField,
  useFieldSchema,
} from '@formily/react';
import { autorun, batch } from '@formily/reactive';
import { Button, TreeDataNode } from 'antd';
import React, { createContext, useContext } from 'react';
import { INodeScope, NodeScope, RootScope } from './scopes';

export type NodeLike = {
  children?: NodeLike[];
};

export type NodePos = number[];

export interface ITreeBaseRootProps
  extends React.ComponentProps<typeof RootScope> {
  disabled?: boolean;
  onAdd?: (pos: NodePos, parents: NodeLike[]) => void | Promise<NodeLike>;
  onCopy?: (
    pos: NodePos,
    node: NodeLike,
    parents: NodeLike[],
  ) => void | Promise<void>;
  onRemove?: (
    pos: NodePos,
    node: NodeLike,
    parents: NodeLike[],
  ) => void | Promise<void>;
  onMove?: (
    before: NodePos,
    after: NodePos,
    node: NodeLike,
    parents: NodeLike[],
  ) => void | Promise<void>;
}

export interface ITreeBaseRootContext {
  props: ITreeBaseRootProps;
  field: ObjectField;
  schema: Schema;
}

export interface ITreeBaseNodeContext {
  node: NodeLike;
  pos: NodePos;
  index: number;
  parents: NodeLike[];
  parent: NodeLike;
  root: NodeLike;
  extra?: Omit<TreeDataNode, 'title' | 'key'>;
}

export interface ITreeBaseNodeProps
  extends Omit<React.ComponentProps<typeof NodeScope>, 'children'> {
  extra?: Omit<TreeDataNode, 'title' | 'key'>;
}

export type TreeBaseMixins = {
  Addition?: React.FC<React.PropsWithChildren<AntdIconProps>>;
  Copy?: React.FC<React.PropsWithChildren<AntdIconProps>>;
  Remove?: React.FC<React.PropsWithChildren<AntdIconProps>>;
  Move?: React.FC<
    React.PropsWithChildren<{
      to?: 'up' | 'down';
    }>
  >;
  Pos?: React.FC;
  useTree?: () => ITreeBaseRootContext;
  useNode?: () => ITreeBaseNodeContext;
};

const TreeBaseContext = createContext<ITreeBaseRootContext | null>(null);
const TreeBaseNodeContext = createContext<ITreeBaseNodeContext | null>(null);

export const useTree = () => {
  const ctx = useContext(TreeBaseContext);
  return ctx;
};

export const useNode = () => {
  const ctx = useContext(TreeBaseNodeContext);
  return ctx;
};

type ComposedTreeBase = React.FC<React.PropsWithChildren<ITreeBaseRootProps>> &
  TreeBaseMixins & {
    Node: React.FC<
      ITreeBaseNodeProps & {
        children?: ((scope: INodeScope<NodeLike>) => React.ReactNode) | React.ReactNode;
      }
    >;
  };

export const TreeBase: ComposedTreeBase = (props) => {
  const field = useField<ObjectField>();
  const schema = useFieldSchema();
  return (
    <RootScope nodeKey={props.nodeKey}>
      <TreeBaseContext.Provider value={{ field, schema, props }}>
        {props.children}
      </TreeBaseContext.Provider>
    </RootScope>
  );
};

const NodeProvider = (props: {
  children: (scope: any) => React.ReactNode;
  extra?: ITreeBaseNodeProps['extra'];
}) => {
  const scope = useExpressionScope() as INodeScope<any>;
  return (
    <TreeBaseNodeContext.Provider
      value={{
        get index() {
          return scope.$index!;
        },
        get node() {
          return scope.$record;
        },
        get parents() {
          return scope.$parents!;
        },
        get parent() {
          return scope.$lookup!;
        },
        get pos() {
          return scope.$pos!;
        },
        get root() {
          return scope.$root;
        },
        get extra() {
          return props.extra;
        },
      }}
    >
      {props.children(scope)}
    </TreeBaseNodeContext.Provider>
  );
};

TreeBase.Node = ({ children, ...props }) => {
  return (
    <NodeScope getPos={props.getPos}>
      <NodeProvider extra={props.extra}>
        {(scope: any) => {
          return typeof children === 'function' ? children(scope) : children;
        }}
      </NodeProvider>
    </NodeScope>
  );
};

export const moveTreeNode = (
  before: number[],
  after: number[],
  root: NodeLike,
) => {
  if (JSON.stringify(before) === JSON.stringify(after)) return;

  let from = {
    parent: null as NodeLike | null,
    idx: -1
  };

  before.reduce(
    (target: NodeLike, at: number, index: number): NodeLike => {
      const isLast = index === before.length - 1;
      if (isLast) {
        from.parent = target as any;
        from.idx = at;
      }
      return  target.children![at]!;
   },
    root,
  );
  // console.log(
  //   'before.after',
  //   JSON.stringify({ before, after, tmp: (tmp as any).label }),
  // );
  let to = {
    parent: null as NodeLike | null,
    idx: -1
  }

  after.reduce((target: NodeLike, at: number, index: number): NodeLike => {
    const isLast = index === after.length - 1;
    if (isLast) {
      to.parent = target;
      to.idx = at;
    }
    return target.children![at]!;
  }, root);


  batch(() => {
    // 同级
    const moving = from.parent?.children![from.idx];
    from.parent?.children?.splice(from.idx, 1);
    to.parent?.children!.splice(to.idx, 0, moving!);
  });

};

const Moveable = (props: { to?: 'up' | 'down' }) => {
  const node = useNode();
  const onClick = () => {
    if (!node) return;
    const before = node?.pos;
    const after = [...node.pos];
    const myIndex = before[before.length - 1];
    after[after.length - 1] =
      props.to === 'down' ? myIndex + 1 : Math.max(myIndex - 1, 0);
    moveTreeNode(before, after, node.root);
  };
  // console.log('ooo', node, '--', node?.parent);
  const shouldHidden =
    (props.to === 'up' && node?.index === 0) ||
    (props.to === 'down' &&
      node?.index === (node?.parent?.children?.length ?? -1) - 1);
  // console.log('move down ', node);
  return shouldHidden ? null : (
    <Button
      type="link"
      size="small"
      icon={<ToTopOutlined rotate={props.to === 'up' ? 0 : 180} />}
      onClick={onClick}
    ></Button>
  );
};

TreeBase.Move = Moveable;
