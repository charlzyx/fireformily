import { ObjectField } from '@formily/core';
import {
  observer,
  RecursionField,
  useField,
  useFieldSchema,
} from '@formily/react';
import { raw } from '@formily/reactive';
import { Space, Tree } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { NodePos, TreeBase } from '../../pro/TreeBase';
import './style.css';

export type TreeNode = {
  label?: string;
  value?: React.Key;
  key?: React.Key;
  isLeaf?: boolean;
  __init?: boolean;
  loading?: boolean;
  children?: TreeNode[];
};

const noop = () => Promise.resolve([] as TreeNode[]);
const eqeqeq = (a: TreeNode, b: TreeNode) => a.value === b.value;

const FIELD_NAMES = {
  title: 'label',
  key: 'value',
  children: 'children',
};

type BaseTreeProps = React.ComponentProps<typeof TreeBase> & {
  loadData?: (options: TreeNode[]) => Promise<TreeNode[]>;
  value?: {
    expanedKeys?: React.Key[];
    selectedKeys?: React.Key[];
    checkedKeys?: React.Key[];
    halfCheckedKeys?: React.Key[];
    children?: TreeNode[];
  };
  layout?: React.ComponentProps<typeof Space>;
  // 内部
  onDrop?: (before: NodePos, after: NodePos) => void | Promise<void>;
};

type AntdTreeProps = React.ComponentProps<typeof Tree>;

export interface TreeNodesProps
  extends Omit<
      AntdTreeProps,
      'loadData' | 'onDrop' | 'value' | 'onChange' | 'fieldNames'
    >,
    BaseTreeProps {}

const getNodePos = (
  parent: TreeNode,
  target: TreeNode,
  eqeq: (a: TreeNode, b: TreeNode) => boolean,
  parentPos?: any[],
) => {
  if (eqeq(parent, target)) {
    return [];
  }
  const pos = parentPos || [];
  if (!Array.isArray(parent.children)) return pos;

  for (let index = 0; index < parent.children.length; index++) {
    const item = parent.children[index];
    if (item === undefined) continue;
    if (eqeq(item, target)) {
      pos.unshift(index);
      return pos;
    }
    const inMyChild = getNodePos(item, target, eqeq, pos);
    if (inMyChild.length > 0) {
      pos.unshift(index);
      return pos;
    }
  }
  return pos;
};

const getParents = (root: TreeNode, pos: NodePos) => {
  const chain: TreeNode[] = [];
  pos.reduce((parent, idx) => {
    const current = parent?.children?.[idx]!;
    chain.push(current!);
    return current;
  }, root);

  return chain;
};

const TitleRender = () => {
  const tree = TreeBase.useTree();
  const node = TreeBase.useNode();

  return (
    <RecursionField
      name={node?.$path}
      schema={tree?.schema.items as any}
    ></RecursionField>
  );
};

const TreeInner = observer((props: TreeNodesProps) => {
  const { loadData, treeData, checkedKeys, ...others } = props;
  const root = TreeBase.useRoot();
  const tree = TreeBase.useTree();

  const fieldNames = useMemo(() => {
    return { ...FIELD_NAMES, ...props.fieldNames };
  }, [props.fieldNames]);

  const methods = useRef({
    loadData,
  });

  const onLoad = useCallback(
    (node: any) => {
      if (!methods.current.loadData) return;
      const pos = getNodePos(root?.$root!, node, eqeqeq);
      let chain = getParents(root?.$root!, pos);
      const last = chain[chain.length - 1];
      last.loading = true;
      return methods.current
        .loadData(chain)
        .then((list) => {
          tree?.opreations.appendChildren(pos, root?.$root, list as any);
        })
        .finally(() => {
          last.loading = false;
        });
    },
    [root?.$root, tree?.opreations],
  );

  const onDrop = ({ dragNode, node }: any) => {
    const before = dragNode.pos.split('-').map(Number);
    // 这是 antd  tree 的 pos, 最前面有个0需要去掉
    before.shift();
    const after = node.pos.split('-').map(Number);
    // 这是 antd  tree 的 pos, 最前面有个0需要去掉
    after.shift();
    const ret = props.onDrop?.(before, after);
    // thenable
    if (typeof ret?.then === 'function') {
      ret.then(() => {
        tree?.opreations.move(before, after, root?.$root!);
      });
    } else {
      tree?.opreations.move(before, after, root?.$root!);
    }

    console.log('onDrop', { before, after });
  };

  return (
    <Tree
      showLine
      blockNode
      className={`${props.className} fireformily-tree`}
      {...others}
      expandedKeys={root?.$root.expandedKeys ?? []}
      onExpand={(keys) => {
        if (!root) return;
        root.$root.expandedKeys = keys;
      }}
      selectedKeys={root?.$root.selectedKeys ?? []}
      onSelect={(keys) => {
        if (!root) return;
        root.$root.selectedKeys = keys;
      }}
      checkedKeys={root?.$root.checkedKeys}
      onCheck={(keys, info) => {
        if (!root) return;
        root.$root.checkedKeys = keys;
        root.$root.halfCheckedKeys = info.halfCheckedKeys;
      }}
      titleRender={(node) => {
        if (!root) return null;
        const pos = getNodePos(root.$root!, node, eqeqeq);
        // root 不 render 不然会闪
        if (pos.length === 0) return null;

        return (
          <TreeBase.Node
            pos={pos}
            getExtra={(treeRoot) => {
              const {
                expandedKeys: expandeds = [],
                selectedKeys: selecteds = [],
                checkedKeys: checkeds = [],
                halfCheckedKeys: halfCheckeds = [],
              } = treeRoot as any;
              const nodeKey = (node as any)[fieldNames.key];
              return {
                checked: checkeds?.includes?.(nodeKey),
                halfChecked: halfCheckeds?.includes?.(nodeKey),
                selecteds: selecteds?.includes?.(nodeKey),
                expanded: expandeds?.includes?.(nodeKey),
              };
            }}
          >
            <TitleRender></TitleRender>
          </TreeBase.Node>
        );
      }}
      fieldNames={FIELD_NAMES}
      treeData={treeData}
      onDrop={onDrop}
      loadData={onLoad as any}
    ></Tree>
  );
});

export const TreeNodes = observer(
  (props: TreeNodesProps & React.ComponentProps<typeof TreeBase>) => {
    const field = useField<ObjectField>();
    const fieldSchema = useFieldSchema();

    const fieldNames = useMemo(() => {
      return { ...FIELD_NAMES, ...props.fieldNames };
    }, [props.fieldNames]);
    const root = field.value;

    const { value, layout, onMove, onRemove, onAdd, onCopy, ...others } = props;

    const onDrop = (before: NodePos, after: NodePos) => {
      const req = onMove?.(before, after, field.value);
      return req;
    };

    const methods = useRef({
      loadData: props.loadData,
    });

    useEffect(() => {
      // not re load
      if (field.value.children) return;
      if (!methods.current.loadData) return;

      methods.current.loadData([]).then((rootList) => {
        field.setState((s) => {
          s.value.children = rootList;
        });
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (!field) return;
      // set default
      field.setState((s) => {
        s.value.children = value?.children ?? [];
        s.value.expandKeys = value?.expanedKeys ?? [];
        s.value.checkedKeys = value?.checkedKeys ?? [];
        s.value.halfCheckedKeys = value?.halfCheckedKeys ?? [];
        s.value.selectedKeys = value?.selectedKeys ?? [];
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [field]);

    let treeData = root.children?.slice() ?? [];

    if (root.__dirty) {
      treeData = raw(root).children.slice();
      root.__dirty = false;
    }

    return (
      <React.Fragment>
        <TreeBase
          getRoot={() => field.value}
          fieldNames={fieldNames}
          onAdd={onAdd}
          onRemove={onRemove}
          onCopy={onCopy}
          onMove={onMove}
        >
          <RecursionField schema={fieldSchema} onlyRenderSelf></RecursionField>
          <Space size="small" {...layout}>
            <TreeInner
              {...others}
              onDrop={onDrop}
              treeData={treeData}
            ></TreeInner>
            <RecursionField
              schema={fieldSchema}
              name=""
              onlyRenderProperties
            ></RecursionField>
          </Space>
        </TreeBase>
      </React.Fragment>
    );
  },
);

TreeBase.mixin(TreeNodes);
