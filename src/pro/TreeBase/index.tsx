import {
  CopyOutlined,
  DeleteOutlined,
  PlusOutlined,
  ToTopOutlined,
} from '@ant-design/icons';
import { ObjectField } from '@formily/core';
import {
  JSXComponent,
  observer,
  Schema,
  useExpressionScope,
  useField,
  useFieldSchema,
} from '@formily/react';
import { Button, Popconfirm } from 'antd';
import React, { createContext, useContext, useMemo } from 'react';
import {
  INodeScope,
  FIELD_NAMES,
  IRootScope,
  NodeScope,
  useNode,
  useRoot,
  RootScope,
  PosLike,
  NodePos,
  NodeLike,
  getHelper,
  getOpreations,
} from './scopes';

export { NodePos, PosLike } from './scopes';

export interface ITreeBaseRootProps
  extends Pick<
    React.ComponentProps<typeof RootScope>,
    'getRoot' | 'fieldNames' | 'nodeKey'
  > {
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
  opreations: ReturnType<typeof getOpreations>;
  helper: ReturnType<typeof getHelper>;
}

type AntdButtonProps = React.ComponentProps<typeof Button>;
export interface ITreeBaseNodeProps
  extends Pick<React.ComponentProps<typeof NodeScope>, 'getNode'> {
  pos: PosLike | ((root: NodeLike) => PosLike);
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
  useNode?: typeof useNode;
  usePos?: typeof usePos;
  usePosNode?: typeof usePosNode;
};

const TreeBaseContext = createContext<ITreeBaseRootContext | null>(null);
const TreeBaseNodeContext = createContext<ITreeBaseNodeProps | null>(null);

export const useTree = () => {
  return useContext(TreeBaseContext);
};

const takePos = (
  pos: ITreeBaseNodeProps['pos'],
  root?: NodeLike,
  helper?: ITreeBaseRootContext['helper'],
): NodePos => {
  const ret =
    typeof pos === 'function'
      ? helper?.formatPos(pos(root!))
      : helper?.formatPos(pos);
  return ret ?? [];
};

export const usePos = (pos?: PosLike) => {
  const tree = useTree();
  const root = useRoot();
  const ctx = useContext(TreeBaseNodeContext);
  return ctx
    ? takePos(ctx.pos, root?.$root, tree?.helper)
    : tree?.helper.formatPos(pos!);
};

export const usePosNode = (pos?: NodePos) => {
  const tree = useTree();
  const root = useRoot();
  const nodeKey = root?.$getKey(tree?.helper.getNodeByPos(pos!, root?.$root!));
  const node = useNode(nodeKey);
  return node;
};

type ComposedTreeBase = React.FC<React.PropsWithChildren<ITreeBaseRootProps>> &
  TreeBaseMixins & {
    Node?: React.FC<React.PropsWithChildren<ITreeBaseNodeProps>>;
    mixin?: <T extends JSXComponent>(target: T) => T & TreeBaseMixins;
  };

const TreeBasic: ComposedTreeBase = (props) => {
  const { fieldNames, getRoot, nodeKey } = props;
  const field = useField<ObjectField>();
  const schema = useFieldSchema();
  const ctx = useMemo(() => {
    return {
      field,
      schema,
      props,
      opreations: getOpreations(fieldNames),
      helper: getHelper(fieldNames),
    };
  }, [field, fieldNames, props, schema]);
  return (
    <RootScope fieldNames={fieldNames} getRoot={getRoot} nodeKey={nodeKey}>
      <TreeBaseContext.Provider value={ctx}>
        {props.children}
      </TreeBaseContext.Provider>
    </RootScope>
  );
};

const TreeBaseNode: typeof TreeBasic['Node'] = (props) => {
  const { pos, children, getNode } = props;
  const takePosFn = typeof pos === 'function' ? pos : () => pos;
  return (
    <TreeBaseNodeContext.Provider value={props}>
      <NodeScope getPos={takePosFn} getNode={getNode}>
        {children}
      </NodeScope>
    </TreeBaseNodeContext.Provider>
  );
};

const TreeBasePos: typeof TreeBasic['Pos'] = (props) => {
  const pos = usePos();
  return <span {...props}> {pos?.join('-')} </span>;
};

const TreeBaseMove: typeof TreeBasic['Move'] = (props) => {
  const { pos, ...others } = props;
  const tree = useTree();
  const node = usePosNode(tree?.helper.formatPos(pos));
  const self = useField();
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
        const before = node.$pos;
        const after = [...node.$pos];
        const nowIndex = before[before.length - 1];
        after[after.length - 1] =
          props.to === 'down' ? nowIndex + 1 : Math.max(nowIndex - 1, 0);

        const req = tree.props.onMove?.(before, after, node?.$root!);
        // thenable
        if (typeof req?.then === 'function') {
          req.then(() => {
            tree.opreations.move(before, after, node.$root);
          });
        } else {
          tree.opreations.move(before, after, node.$root);
        }
      }}
    >
      {self.props.title || self.title}
    </Button>
  );
};

const TreeBaseRemove: typeof TreeBasic['Remove'] = (props) => {
  const { pos, ...others } = props;
  const tree = useTree();
  const node = usePosNode(tree?.helper.formatPos(pos));
  const self = useField();
  if (!tree) return null;
  if (tree.field.pattern !== 'editable') return null;

  return (
    <Popconfirm
      title={self.content || '确定要删除当前面数据吗?'}
      okText="是的"
      cancelText="我再想想"
      onConfirm={(e) => {
        e?.stopPropagation?.();
        if (self?.disabled) return;
        if (!node) return;
        const before = node.$pos;
        const req = tree.props.onRemove?.(
          before,
          node.$record,
          node.$lookup,
          node?.$root!,
        );
        // thenable
        if (typeof req?.then === 'function') {
          req.then(() => {
            tree.opreations.remove(before, node.$root);
          });
        } else {
          tree.opreations.remove(before, node.$root);
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
  const { pos, factory, method, ...others } = props;
  const tree = useTree();
  const node = usePosNode(tree?.helper.formatPos(pos));
  const self = useField();
  if (!tree) return null;
  if (tree.field.pattern !== 'editable') return null;

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
        const before = node.$pos;
        const req = tree.props?.onAdd?.(
          before,
          node.$record,
          node.$lookup,
          node.$root,
        );

        // thenable
        if (typeof req?.then === 'function') {
          req.then((neo) => {
            tree.opreations.append(
              before,
              neo ?? factory?.(node.$lookup),
              node.$root,
              method,
            );
          });
        } else {
          tree.opreations.append(
            before,
            factory?.(node.$lookup) || {},
            node.$root,
            method,
          );
        }
      }}
    >
      {self.props.title || self.title}
    </Button>
  );
};

const TreeBaseCopy: typeof TreeBasic['Copy'] = (props) => {
  const { pos, clone, ...others } = props;
  const tree = useTree();
  const node = usePosNode(tree?.helper.formatPos(pos));
  const self = useField();
  if (!tree) return null;
  if (tree.field.pattern !== 'editable') return null;

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
        const before = node.$pos;
        const req = tree.props?.onCopy?.(
          before,
          node.$record,
          node.$lookup,
          node.$root,
        );

        // thenable
        if (typeof req?.then === 'function') {
          req.then((neo) => {
            tree.opreations.copy(
              before,
              neo ?? clone?.(node.$lookup),
              node.$root,
            );
          });
        } else {
          tree.opreations.copy(before, clone?.(node.$lookup) || {}, node.$root);
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
  return target;
};

export const TreeBase = TreeBasic as typeof TreeBasic &
  Required<ComposedTreeBase>;
