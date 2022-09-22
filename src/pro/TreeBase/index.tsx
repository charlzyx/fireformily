import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';
import { ObjectField } from '@formily/core';
import { Schema, useField, useFieldSchema } from '@formily/react';
import { ArrowDownOutlined, ToTopOutlined } from '@ant-design/icons';
import { Button, TreeDataNode } from 'antd';
import React, { createContext, useContext } from 'react';
import { NodeRecordScope, RootScope } from './scopes';

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
  root: NodeLike[];
  extra?: Omit<TreeDataNode, 'title' | 'key'>;
}

export interface ITreeBaseNodeProps
  extends React.ComponentProps<typeof NodeRecordScope> {
  extra?: Omit<TreeDataNode, 'title' | 'key'>;
}

export type TreeBaseMixins = {
  Addition?: React.FC<React.PropsWithChildren<AntdIconProps>>;
  Copy?: React.FC<React.PropsWithChildren<AntdIconProps>>;
  Remove?: React.FC<React.PropsWithChildren<AntdIconProps>>;
  Move?: React.FC<
    React.PropsWithChildren<{
      to?: 'up' | 'down' | 'free';
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
        chidren?: React.ReactNode | ((scope: any) => React.ReactNode);
      }
    >;
  };

export const TreeBase: ComposedTreeBase = (props) => {
  const field = useField<ObjectField>();
  const schema = useFieldSchema();
  return (
    <RootScope
      getRoot={props.getRoot ? props.getRoot : () => (field.value as any) || []}
      nodeKey={props.nodeKey}
    >
      <TreeBaseContext.Provider value={{ field, schema, props }}>
        {props.children}
      </TreeBaseContext.Provider>
    </RootScope>
  );
};

TreeBase.Node = ({ children, ...props }) => {
  return (
    <NodeRecordScope getNode={props.getNode} getParents={props.getParents}>
      {(scope) => {
        return (
          <TreeBaseNodeContext.Provider
            value={{
              get node() {
                return scope.$record;
              },
              get parents() {
                return scope.$parents;
              },
              get pos() {
                return scope.$pos;
              },
              get index() {
                return scope.$index;
              },
              get root() {
                return scope.$root;
              },
              get extra() {
                return scope.$extra;
              },
            }}
          >
            {typeof children === 'function' ? children(scope) : children}
          </TreeBaseNodeContext.Provider>
        );
      }}
    </NodeRecordScope>
  );
};

const move = (before: number[], after: number[], root: NodeLike[]) => {
  if (JSON.stringify(before) === JSON.stringify(after)) return;
  const tmp = before.reduce(
    (target: NodeLike, at: number, index: number): NodeLike => {
      const isLast = index === before.length - 1;
      if (!isLast) return target.children![at]!;
      const me = target.children?.[at];
      target.children?.splice(at, 1);
      return me!;
    },
    { children: root } as NodeLike,
  );
  console.log(
    'before.after',
    JSON.stringify({ before, after, tmp: tmp.label }),
  );
  after.reduce(
    (target: NodeLike, at: number, index: number): NodeLike => {
      const isLast = index === after.length - 1;
      if (!isLast) return target.children![at]!;
      // 在 target 前方插入
      target.children?.splice(at, 0, tmp);
      return target;
    },
    { children: root } as NodeLike,
  );
};

const Moveable = (props: { to?: 'up' | 'down' | 'free' }) => {
  const node = useNode();
  const onClick = () => {
    if (!node) return;
    const before = node?.pos;
    const after = [...node.pos];
    const myIndex = before[before.length - 1];
    after[after.length - 1] =
      props.to === 'down' ? myIndex + 1 : Math.max(myIndex - 1, 0);
    move(before, after, node.root);

    // const parents = node.parents.length > 0 ? node.parents : node?.root!;
    // const me = parents[node.index];
    // parents.splice(node.index, 1);
    // parents.splice(node.index + 1, 0, me!);
    // console.log('neo', parents);
  };
  // console.log('move down ', node);
  return (
    <>
      <Button
        type="link"
        icon={<ToTopOutlined rotate={props.to === 'up' ? 0 : 180} />}
        onClick={onClick}
      ></Button>
      <Button
        onClick={() => {
          console.log('node.pos', node?.pos.toString());
        }}
      >
        LOG POS
      </Button>
    </>
  );
};

TreeBase.Move = Moveable;
