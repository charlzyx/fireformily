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
import { Button } from 'antd';
import React, { createContext, useContext } from 'react';
import {
  opreations,
  INodeScope,
  IRootScope,
  NodeScope,
  RootScope,
  NodePos,
  NumberPos,
  NodeLike,
  helper,
} from './scopes';

export interface ITreeBaseRootProps
  extends React.ComponentProps<typeof RootScope> {
  disabled?: boolean;
  onAdd?: (
    pos: NumberPos,
    node: NodeLike,
    root: NodeLike,
  ) => void | Promise<void>;
  onCopy?: (
    pos: NumberPos,
    node: NodeLike,
    root: NodeLike,
  ) => void | Promise<void>;
  onRemove?: (
    pos: NumberPos,
    node: NodeLike,
    root: NodeLike,
  ) => void | Promise<void>;
  onMove?: (
    before: NumberPos,
    after: NumberPos,
    root: NodeLike,
  ) => void | Promise<void>;
}

export interface ITreeBaseRootContext {
  props: ITreeBaseRootProps;
  field: ObjectField;
  schema: Schema;
}

type AntdButtonProps = React.ComponentProps<typeof Button>;
export interface ITreeBaseNodeProps {
  pos: NodePos | ((root: NodeLike) => NodePos);
}

export type TreeBaseMixins = {
  opreations: typeof opreations;
  Addition?: React.FC<
    AntdButtonProps & {
      pos?: NodePos;
      factory: (parent: NodeLike) => NodeLike;
    }
  >;
  Copy?: React.FC<
    AntdButtonProps & {
      pos?: NodePos;
      clone: (node: NodeLike) => NodeLike;
    }
  >;
  Remove?: React.FC<
    AntdButtonProps & {
      pos?: NodePos;
    }
  >;
  Move?: React.FC<
    AntdButtonProps & {
      to?: 'up' | 'down';
      pos?: NodePos;
    }
  >;
  Pos?: React.FC<{ pos?: NodePos }>;
  useTree?: typeof useTree;
  useNodeScope?: typeof useNodeScope;
  useRecord?: typeof useRecord;
  usePos?: typeof usePos;
};

const takeNode = (
  root?: NodeLike,
  getPos?: NodePos | ((treeRoot: NodeLike) => NodePos),
) => {
  if (!root || !getPos) return undefined;
  const posLike = typeof getPos === 'function' ? getPos(root) : getPos;
  const pos = helper.formatPos(posLike);
  return pos.reduce((parent, idx) => {
    return parent?.children?.[idx]!;
  }, root);
};

const TreeBaseContext = createContext<ITreeBaseRootContext | null>(null);
const TreeBaseNodeContext = createContext<ITreeBaseNodeProps | null>(null);

export const useTree = () => {
  const ctx = useContext(TreeBaseContext);
  return ctx;
};

export const usePos = (pos?: NodePos) => {
  const ctx = useContext(TreeBaseNodeContext);
  const root = useRoot();
  const ret = ctx
    ? typeof ctx.pos === 'function'
      ? ctx.pos(root!)
      : ctx.pos
    : pos;

  return helper.formatPos(ret!);
};

export const useRoot = () => {
  const tree = useTree();
  return tree?.field?.value;
};

export const useRecord = (pos?: NodePos) => {
  const root = useRoot();
  const ctx = useContext(TreeBaseNodeContext);
  return takeNode(root, ctx?.pos ?? pos);
};

export const useNodeScope = (posLike?: NodePos) => {
  const scope = useExpressionScope() as INodeScope<NodeLike> &
    IRootScope<NodeLike>;

  const { $refs, $getKey, $root, $pos } = scope;
  const pos = helper.formatPos(posLike!);

  const node = [...(posLike ? pos : $pos)].reduce((parent, at) => {
    return parent.children?.[at]!;
  }, $root);

  const nodeScope = $refs.get($getKey(node));
  return nodeScope;
};

type ComposedTreeBase = React.FC<React.PropsWithChildren<ITreeBaseRootProps>> &
  TreeBaseMixins & {
    Node: React.FC<
      ITreeBaseNodeProps & {
        children?:
          | ((scope: INodeScope<NodeLike>) => React.ReactNode)
          | React.ReactNode;
      }
    >;
    mixin?: <T extends JSXComponent>(target: T) => T & TreeBaseMixins;
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

const TreeNode: typeof TreeBase['Node'] = ({ children, ...props }) => {
  const { pos } = props;
  const takePos = typeof pos === 'function' ? pos : () => pos;
  return (
    <TreeBaseNodeContext.Provider value={props}>
      <NodeScope getPos={takePos}>
        {(scope: INodeScope<NodeLike>) => {
          const isRoot = scope.$root === scope.$record;
          // console.log('isNOde ROot', isRoot);
          return isRoot
            ? null
            : typeof children === 'function'
            ? children(scope)
            : children;
        }}
      </NodeScope>
    </TreeBaseNodeContext.Provider>
  );
};

const Move: typeof TreeBase['Move'] = observer((props) => {
  const tree = useTree();
  const node = useNodeScope(props.pos);
  const self = useField();
  if (!tree) return null;
  if (tree.field.pattern !== 'editable') return null;

  const onClick = (e: any) => {
    e.stopPropagation();

    if (self?.disabled) return;
    if (!node) return;
    const before = node.$pos!;
    const after = [...node.$pos!];
    const myIndex = before[before.length - 1];
    after[after.length - 1] =
      props.to === 'down' ? myIndex + 1 : Math.max(myIndex - 1, 0);
    const ret = tree.props.onMove?.(before, after, node.$root!);
    if (typeof ret?.then === 'function') {
      ret.then(() => {
        opreations.move(before, after, node.$root!);
      });
    } else {
      opreations.move(before, after, node.$root!);
    }
  };
  // console.log('ooo', node, '--', node?.parent);
  const shouldHidden =
    (props.to === 'up' && node?.$index! === 0) ||
    (props.to === 'down' &&
      node?.$index === (node?.$lookup?.children?.length ?? -1) - 1);
  // console.log('move down ', node);
  return shouldHidden ? null : (
    <Button
      type="link"
      size="small"
      icon={<ToTopOutlined rotate={props.to === 'up' ? 0 : 180} />}
      onClick={onClick}
    >
      {self.props.title || self.title}
    </Button>
  );
});

const Remove: typeof TreeBase['Remove'] = (props) => {
  const pos = usePos(props.pos);
  const tree = useTree();
  const self = useField();
  if (!tree) return null;
  if (tree.field.pattern !== 'editable') return null;

  const root = tree.field.value;

  return (
    <Button
      type="link"
      size="small"
      icon={<DeleteOutlined></DeleteOutlined>}
      {...props}
      onClick={(e) => {
        e.stopPropagation();

        if (self?.disabled) return;
        const ret = tree.props.onRemove?.(pos!, takeNode(root, pos)!, root);
        if (typeof ret?.then === 'function') {
          ret.then(() => {
            opreations.remove(pos!, root);
          });
        } else {
          opreations.remove(pos!, root);
        }
        e.stopPropagation();
        if (props.onClick) {
          props.onClick(e);
        }
      }}
    >
      {self.props.title || self.title}
    </Button>
  );
};

const Pos: typeof TreeBase['Pos'] = (props) => {
  const pos = usePos();
  return <span {...props}>#{pos?.join('.')}</span>;
};

const Copy: typeof TreeBase['Copy'] = (props) => {
  const { clone, ...others } = props;
  const pos = usePos(props.pos);
  const tree = useTree();
  const self = useField();
  if (!tree) return null;
  if (tree.field.pattern !== 'editable') return null;
  const root = tree.field.value;

  return (
    <Button
      type="link"
      size="small"
      {...others}
      icon={<CopyOutlined></CopyOutlined>}
      onClick={(e) => {
        e.stopPropagation();

        if (self?.disabled) return;
        opreations.copy(pos!, root!, props.clone);
        tree.props?.onCopy?.(pos!, takeNode(root, pos)!, root);
        e.stopPropagation();
        if (props.onClick) {
          props.onClick(e);
        }
      }}
    >
      {self.props.title || self.title}
    </Button>
  );
};

const Addition: typeof TreeBase['Addition'] = (props) => {
  const { factory, ...others } = props;
  const tree = useTree();
  const nodeScope = useNodeScope(props.pos);
  const self = useField();
  if (!tree || !nodeScope) return null;
  if (tree.field.pattern !== 'editable') return null;
  const root = tree.field.value;

  return (
    <Button
      type="link"
      size="small"
      {...others}
      icon={<PlusOutlined></PlusOutlined>}
      onClick={(e) => {
        if (self?.disabled) return;
        e.stopPropagation();
        if (props.onClick) {
          props.onClick(e);
        }
        // const parentPos = nodeScope.$pos.slice(0, nodeScope.$pos.length - 1);
        const ret = tree.props?.onAdd?.(
          nodeScope.$pos!,
          takeNode(root, nodeScope.$pos)!,
          root,
        );
        if (typeof ret?.then === 'function') {
          ret.then(() => {
            setTimeout(() => {
              const neo = factory(takeNode(root, nodeScope.$pos)!);
              opreations.add(nodeScope.$pos!, root!, neo);
              // 等页面刷新完
            }, 100);
          });
        } else {
          const neo = factory(takeNode(root, nodeScope.$pos)!);
          opreations.add(nodeScope.$pos!, root!, neo);
        }
      }}
    >
      {self.props.title || self.title}
    </Button>
  );
};

TreeBase.Node = TreeNode;
TreeBase.Addition = Addition;
TreeBase.Copy = Copy;
TreeBase.Move = Move;
TreeBase.Remove = Remove;
TreeBase.Pos = Pos;
TreeBase.useTree = useTree;
TreeBase.usePos = usePos;
TreeBase.useRecord = useRecord;
TreeBase.useNodeScope = useNodeScope;
TreeBase.opreations = opreations;

TreeBase.mixin = (target: any) => {
  target.Copy = TreeBase.Copy;
  target.Addition = TreeBase.Addition;
  target.Move = TreeBase.Move;
  target.Remove = TreeBase.Remove;
  target.Pos = TreeBase.Pos;
  target.useTree = TreeBase.useTree;
  target.usePos = TreeBase.usePos;
  target.useRecord = TreeBase.useRecord;
  target.useNodeScope = TreeBase.useNodeScope;
  target.opreations = TreeBase.opreations;
  return target;
};
