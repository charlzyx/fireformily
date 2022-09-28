import {
  CopyOutlined,
  DeleteOutlined,
  PlusOutlined,
  ToTopOutlined,
} from '@ant-design/icons';
import { ObjectField } from '@formily/core';
import { JSXComponent, Schema, useField, useFieldSchema } from '@formily/react';
import { Button, Popconfirm } from 'antd';
import React, { createContext, useContext, useMemo } from 'react';
import {
  NodeLike,
  NodeScope,
  RootScope,
  useNode,
  useRoot,
  NodePos,
  useHelper,
} from './scope';

type PosLike = string | number[];

export interface ITreeBaseRootProps
  extends React.ComponentProps<typeof RootScope> {
  disabled?: boolean;
  onAdd?: (
    pos: NodePos,
    child: NodeLike,
    parent: NodeLike,
    root: NodeLike,
  ) => void | Promise<NodeLike>;
  onCopy?: (
    pos: NodePos,
    node: NodeLike,
    parent: NodeLike,
    root: NodeLike,
  ) => void | Promise<NodeLike>;
  onRemove?: (
    pos: NodePos,
    node: NodeLike,
    parent: NodeLike,
    root: NodeLike,
  ) => void | Promise<void>;
  onMove?: (
    before: NodePos,
    after: NodePos,
    root: NodeLike,
  ) => void | Promise<void>;
}

export interface ITreeBaseRootContext {
  props: ITreeBaseRootProps;
  field: ObjectField;
  schema: Schema;
}

type AntdButtonProps = React.ComponentProps<typeof Button>;
export interface ITreeBaseNodeProps
  extends Pick<React.ComponentProps<typeof NodeScope>, 'getNode' | 'getExtra'> {
  pos: (root: NodeLike) => NodePos;
  ignoreRoot?: boolean
}

export type TreeBaseMixins = {
  Append?: React.FC<
    AntdButtonProps & {
      pos?: PosLike;
      method?: 'push' | 'unshift';
      factory?: (parent: NodeLike) => NodeLike;
    }
  >;
  Copy?: React.FC<
    AntdButtonProps & {
      pos?: PosLike;
      clone?: (node: NodeLike) => NodeLike;
    }
  >;
  Remove?: React.FC<
    AntdButtonProps & {
      pos?: PosLike;
    }
  >;
  Move?: React.FC<
    AntdButtonProps & {
      to?: 'up' | 'down';
      pos?: PosLike;
    }
  >;
  Pos?: React.FC<{ pos?: PosLike }>;
  useTree?: typeof useTree;
  useRoot?: typeof useRoot;
  useHelper?: typeof useHelper;
  useNode?: typeof useNode;
  usePos?: typeof usePos;
  usePosNode?: typeof usePosNode;
};

const TreeBaseContext = createContext<ITreeBaseRootContext | null>(null);
const TreeBaseNodeContext = createContext<ITreeBaseNodeProps | null>(null);

export const useTree = () => {
  return useContext(TreeBaseContext);
};

const formatPos = (like?: PosLike): NodePos => {
  if (Array.isArray(like)) return like;
  if (typeof like === 'string') {
    return like
      .split('-')
      .map(Number)
      .filter((x) => !Number.isNaN(x));
  }
  return [];
};

export const usePos = (posLike?: PosLike) => {
  const ctx = useNode();
  return posLike ? formatPos(posLike) : ctx?.$pos!;
};

export const usePosNode = (posLike?: PosLike) => {
  const helper = useHelper();
  const pos = usePos(posLike);
  const node = useNode(helper.take(helper.getNodeAtPos(pos)).key);
  return node;
};

type ComposedTreeBase = React.FC<React.PropsWithChildren<ITreeBaseRootProps>> &
  TreeBaseMixins & {
    Node?: React.FC<React.PropsWithChildren<ITreeBaseNodeProps>>;
    mixin?: <T extends JSXComponent>(target: T) => T & TreeBaseMixins;
  };

const TreeBasic: ComposedTreeBase = (props) => {
  const { fieldNames, getRoot, children } = props;
  const field = useField<ObjectField>();
  const schema = useFieldSchema();
  const ctx = useMemo(() => {
    return {
      field,
      schema,
      props,
    };
  }, [field, props, schema]);

  return (
    <TreeBaseContext.Provider value={ctx}>
      <RootScope fieldNames={fieldNames} getRoot={getRoot}>
        {children}
      </RootScope>
    </TreeBaseContext.Provider>
  );
};

const TreeBaseNode: typeof TreeBasic['Node'] = (props) => {
  const { pos, children, getNode, getExtra, ignoreRoot } = props;
  return (
    <NodeScope
      ignoreRoot={ignoreRoot}
      getPos={pos}
      getNode={getNode}
      getExtra={getExtra}
    >
      <TreeBaseNodeContext.Provider value={props}>
        {children}
      </TreeBaseNodeContext.Provider>
    </NodeScope>
  );
};

const TreeBasePos: typeof TreeBasic['Pos'] = (props) => {
  const pos = usePos();
  const node = usePosNode(pos);
  // not support node
  if (node?.$record === node?.$root) return null;

  return <span {...props}>#{pos?.join('-')} </span>;
};

const TreeBaseMove: typeof TreeBasic['Move'] = (props) => {
  const { pos: posLike, ...others } = props;
  const tree = useTree();
  const node = usePosNode(posLike);
  const self = useField();
  const helper = useHelper();

  // not support node
  if (node?.$record === node?.$root) return null;

  if (!tree) return null;
  if (tree.field.pattern !== 'editable') return null;

  const shouldHidden =
    (props.to === 'up' && node?.$index! === 0) ||
    (props.to === 'down' &&
      node?.$index === (node?.$records?.length ?? -1) - 1);
  if (shouldHidden) return null;

  return (
    <Button
      type="link"
      size="small"
      icon={<ToTopOutlined rotate={props.to === 'up' ? 0 : 180} />}
      {...others}
      onClick={(e) => {
        e.stopPropagation();
        if (self?.disabled) return;
        if (!node) return;
        const pos = node.$pos;
        const after = [...pos];
        const nowIndex = pos[pos.length - 1];
        after[after.length - 1] =
          props.to === 'down' ? nowIndex + 1 : Math.max(nowIndex - 1, 0);

        const req = tree.props.onMove?.(pos, after, node?.$root!);
        // thenable
        if (typeof req?.then === 'function') {
          req.then(() => {
            helper.move(pos, after);
          });
        } else {
          helper.move(pos, after);
        }
      }}
    >
      {self.props.title || self.title}
    </Button>
  );
};

const TreeBaseRemove: typeof TreeBasic['Remove'] = (props) => {
  const { pos: posLike, ...others } = props;
  const tree = useTree();
  const node = usePosNode(posLike);
  const self = useField();
  const helper = useHelper();
  if (!tree) return null;
  if (tree.field.pattern !== 'editable') return null;
  // not support node
  if (node?.$record === node?.$root) return null;


  return (
    <Popconfirm
      title={self.content || '确定要删除当前数据吗?'}
      okText="是的"
      cancelText="我再想想"
      onConfirm={(e) => {
        e?.stopPropagation?.();
        if (self?.disabled) return;
        if (!node) return;
        const pos = node.$pos;
        const req = tree.props.onRemove?.(
          pos,
          node.$record,
          node.$lookup,
          node?.$root!,
        );
        // thenable
        if (typeof req?.then === 'function') {
          req.then(() => {
            helper.remove(pos);
          });
        } else {
          helper.remove(pos);
        }
      }}
    >
      <Button
        type="link"
        size="small"
        icon={<DeleteOutlined></DeleteOutlined>}
        {...others}
      >
        {self.props.title || self.title}
      </Button>
    </Popconfirm>
  );
};

const TreeBaseAppend: typeof TreeBasic['Append'] = (props) => {
  const { pos: posLike, factory, method, ...others } = props;
  const tree = useTree();
  const node = usePosNode(posLike);
  const self = useField();
  const helper = useHelper();
  if (!tree) return null;
  if (tree.field.pattern !== 'editable') return null;
  if (node?.$extra?.expanded && node?.$record!== node.$root) return null;

  return (
    <Button
      type="dashed"
      size="small"
      icon={<PlusOutlined></PlusOutlined>}
      {...others}
      onClick={(e) => {
        e.stopPropagation();
        if (self?.disabled) return;
        if (!node) return;
        const pos = node.$pos;
        const req = tree.props?.onAdd?.(
          pos,
          node.$record,
          node.$lookup,
          node.$root,
        );

        // thenable
        if (typeof req?.then === 'function') {
          req.then((neo) => {
            setTimeout(() => {
              helper.append(pos, method, neo ?? factory?.(node.$record));
            });
          });
        } else {
          helper.append(pos, method, factory?.(node.$record) || {});
        }
      }}
    >
      {self.props.title || self.title}
    </Button>
  );
};

const TreeBaseCopy: typeof TreeBasic['Copy'] = (props) => {
  const { pos: posLike, clone, ...others } = props;
  const tree = useTree();
  const node = usePosNode(posLike);
  const self = useField();
  const helper = useHelper();
  if (!tree) return null;
  if (tree.field.pattern !== 'editable') return null;
  // not supported root
  if (node?.$record === node?.$root) return null;

  return (
    <Button
      type="link"
      size="small"
      icon={<CopyOutlined></CopyOutlined>}
      {...others}
      onClick={(e) => {
        e.stopPropagation();
        if (self?.disabled) return;
        if (!node) return;
        const pos = node.$pos;
        const req = tree.props?.onCopy?.(
          pos,
          node.$record,
          node.$lookup,
          node.$root,
        );

        // thenable
        if (typeof req?.then === 'function') {
          req.then((neo) => {
            helper.copy(pos, neo);
          });
        } else {
          helper.copy(pos);
        }
      }}
    >
      {self.props.title || self.title}
    </Button>
  );
};

TreeBasic.Node = TreeBaseNode;
TreeBasic.Move = TreeBaseMove;
TreeBasic.Pos = TreeBasePos;
TreeBasic.Remove = TreeBaseRemove;
TreeBasic.Append = TreeBaseAppend;
TreeBasic.Copy = TreeBaseCopy;
TreeBasic.useNode = useNode;
TreeBasic.useTree = useTree;
TreeBasic.usePos = usePos;
TreeBasic.usePosNode = usePosNode;
TreeBasic.useRoot = useRoot;
TreeBasic.useHelper = useHelper;

TreeBasic.mixin = (target: any) => {
  target.Node = TreeBasic.Node;
  target.Move = TreeBasic.Move;
  target.Pos = TreeBasic.Pos;
  target.Remove = TreeBasic.Remove;
  target.Append = TreeBasic.Append;
  target.Copy = TreeBasic.Copy;
  target.useNode = TreeBasic.useNode;
  target.useTree = TreeBasic.useTree;
  target.usePos = TreeBasic.usePos;
  target.usePosNode = TreeBasic.usePosNode;
  target.useRoot = TreeBasic.useRoot;
  target.useHelper = TreeBasic.useHelper;
  return target;
};

export const TreeBase = TreeBasic as typeof TreeBasic &
  Required<ComposedTreeBase>;

export { getHelper as getTreeHelper } from './helper';
