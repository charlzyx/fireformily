import { ObjectField } from '@formily/core';
import {
  observer,
  RecursionField,
  useField,
  useFieldSchema,
} from '@formily/react';
import { observe, observable, toJS } from '@formily/reactive';
import { Tree } from 'antd';
import React, {
  Children,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TreeBase, NodePos } from '../../pro/TreeBase';
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

type BaseTreeProps = {
  value?: TreeNode;
  onChange?: (neo: BaseTreeProps['value']) => void;
  loadData?: (options: TreeNode[]) => Promise<TreeNode[]>;
};

const getNodePos = (
  parent: TreeNode,
  target: TreeNode,
  eqeq: (a: TreeNode, b: TreeNode) => boolean,
  parentPos?: any[],
) => {
  if (eqeq(parent, target)) {
    return [0];
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

const getParents = (root: TreeNode, target: TreeNode) => {
  const pos = getNodePos(root, target, eqeqeq);

  const chain: TreeNode[] = [];
  pos.reduce((parent, idx) => {
    const current = parent.children[idx];
    chain.push(current);
    return current;
  }, root);

  return chain;
};
export interface MergedTreeProps
  extends Omit<React.ComponentProps<typeof Tree>, 'loadData'>,
    BaseTreeProps {}

const TreeWrapper = (
  props: React.PropsWithChildren<{ fieldNames: typeof FIELD_NAMES }>,
) => {};

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

const TreeInner = observer((props: MergedTreeProps) => {
  const { onChange, value, loadData, ...others } = props;
  const tree = TreeBase.useTree();
  const root = TreeBase.useRoot();
  console.log('so much');

  const [treeData, setTreeData] = useState<TreeNode[]>(value?.children ?? []);

  const methods = useRef({
    onChange: onChange,
    loadData: loadData,
  });

  const refs = useRef({
    value: value,
  });

  useEffect(() => {
    methods.current.loadData = loadData;
    methods.current.onChange = onChange;
  }, [loadData, onChange]);

  useEffect(() => {
    refs.current.value = value;
  }, [value]);

  useEffect(() => {
    methods.current.onChange?.({
      ...value,
      children: treeData,
    });
  }, [treeData, value]);

  const onLoad = useCallback((node: any) => {
    let chain = getParents(refs.current.value!, node);
    const last = chain[chain.length - 1];
    last.loading = true;
    const promise = methods.current.loadData ?? noop;
    return promise(chain)
      .then((list) => {
        last.children = list;
        last.loading = false;
        // setTreeData((pre) => [...pre]);
      })
      .finally(() => {
        last.loading = false;
      });
  }, []);

  const onDrop = ({ dragNode, node }: any) => {
    const before = dragNode.pos.split('-').map(Number);
    // 这是 antd  tree 的 pos, 最前面有个0需要去掉
    before.shift();
    const after = node.pos.split('-').map(Number);
    // 这是 antd  tree 的 pos, 最前面有个0需要去掉
    after.shift();
    const neo = tree?.opreations.move(before, after, root?.$root!);
    setTreeData(neo?.children as any);

    console.log('onDrop', { before, after });
  };
  return (
    <Tree
      selectable={false}
      showLine
      {...others}
      titleRender={(node) => {
        const pos = getNodePos({ children: treeData }, node, eqeqeq);
        return (
          <TreeBase.Node pos={pos} key={pos.join('-')}>
            <TitleRender></TitleRender>
          </TreeBase.Node>
        );
      }}
      draggable
      blockNode
      fieldNames={FIELD_NAMES}
      treeData={treeData}
      onDrop={onDrop}
      loadData={onLoad}
    ></Tree>
  );
});

export const TreeNodes = observer((props: MergedTreeProps) => {
  const field = useField<ObjectField>();
  const fieldSchema = useFieldSchema();
  const fieldNames = { ...FIELD_NAMES, ...props.fieldNames };

  return (
    <>
      <RecursionField schema={fieldSchema} onlyRenderSelf></RecursionField>

      <TreeBase
        nodeKey={fieldNames.key}
        getRoot={() => field.value}
        fieldNames={fieldNames}
      >
        <TreeInner {...props}></TreeInner>
      </TreeBase>

      <RecursionField
        schema={fieldSchema}
        name=""
        onlyRenderProperties
      ></RecursionField>
    </>
  );
});

TreeBase.mixin(TreeNodes);
