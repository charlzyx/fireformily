import { ObjectField } from '@formily/core';
import {
  observer,
  RecursionField,
  useExpressionScope,
  useField,
  useFieldSchema,
} from '@formily/react';
import { toJS } from '@formily/reactive';
import { Space, Tree } from 'antd';
import React, { useCallback, useEffect, useRef } from 'react';
import { moveTreeNode, TreeBase } from '../../pro/TreeBase';
import { safeStringify } from '../../shared';
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

const FIELD_NAMES = {
  title: 'label',
  key: 'value',
};

const getChainNodes = (
  parent: TreeNode,
  target: TreeNode,
  parentChain?: any[],
) => {
  const chain = parentChain || [];
  if (!Array.isArray(parent.children)) {
    return chain;
  }

  for (let index = 0; index < parent.children.length; index++) {
    const item = parent.children[index];
    if (item.value === target.value) {
      chain.unshift(item);
      return chain;
    }
    const inMyChild = getChainNodes(item, target, chain);
    if (inMyChild.length > 0) {
      chain.unshift(item);
      return chain;
    }
  }
  return chain;
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

const ScopeLogger = () => {
  const scope = useExpressionScope();

  return (
    <div
      onClick={() => {
        console.log('---scope', safeStringify(scope));
      }}
    >
      LOOK SCOPE
    </div>
  );
};

type BaseTreeProps = {
  value?: TreeNode;
  onChange?: (neo: BaseTreeProps['value']) => void;
  loadData?: (options: TreeNode[]) => Promise<TreeNode[]>;
};

interface MergedTreeProps
  extends Omit<React.ComponentProps<typeof Tree>, 'loadData'>,
    BaseTreeProps {}

export const TreeNodes = observer((props: MergedTreeProps) => {
  const { onChange, children, loadData, value, ...others } = props;

  const field = useField<ObjectField>();

  const root = field.value;

  const fieldSchema = useFieldSchema();

  const methods = useRef({
    onChange: props.onChange,
    loadData: props.loadData,
  });

  useEffect(() => {
    methods.current.loadData = props.loadData;
    methods.current.onChange = props.onChange;
  }, [props.loadData, props.onChange]);

  const onLoad = useCallback(
    (node: any) => {
      let chain = getChainNodes(root, node);
      const last = chain[chain.length - 1];

      last.loading = true;
      const promise = methods.current.loadData ?? noop;
      return promise(chain)
        .then((list) => {
          last.children = list;
          last.loading = false;
        })
        .finally(() => {
          last.loading = false;
        });
    },
    [root],
  );

  useEffect(() => {
    methods.current.loadData?.([])?.then?.((list) => {
      // state.root = list;
      field.setValue({
        label: 'ROOT',
        value: 'ROOT',
        children: list,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDrop = ({ dragNode, node }: any) => {
    const before = dragNode.pos.split('-').map(Number);
    // 这是 antd  tree 的 pos, 最前面有个0需要去掉
    before.shift();
    const after = node.pos.split('-').map(Number);
    // 这是 antd  tree 的 pos, 最前面有个0需要去掉
    after.shift();
    moveTreeNode(before, after, root);

    console.log('onDrop', { before, after });
  };

  return (
    <React.Fragment>
      <RecursionField schema={fieldSchema} onlyRenderSelf></RecursionField>
      <TreeBase nodeKey={FIELD_NAMES.key}>
        <Tree
          showLine
          {...others}
          titleRender={(node) => {
            return (
              <TreeBase.Node
                getPos={(treeRoot) => {
                  const pos = getNodePos(
                    treeRoot,
                    node,
                    (a, b) => a.value === b.value,
                  );
                  return pos;
                }}
              >
                {(scope) => {
                  const name = scope.$path;
                  return (
                    <Space key={name}>
                      <RecursionField
                        schema={fieldSchema}
                        name={name}
                        onlyRenderProperties
                      ></RecursionField>
                      <ScopeLogger />
                    </Space>
                  );
                }}
              </TreeBase.Node>
            );
          }}
          draggable
          onDrop={onDrop}
          blockNode
          fieldNames={FIELD_NAMES}
          treeData={toJS(root).children}
          loadData={onLoad}
        ></Tree>
      </TreeBase>
    </React.Fragment>
  );
});

export default TreeNodes;
