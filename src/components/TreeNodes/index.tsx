import { ObjectField } from '@formily/core';
import {
  connect,
  observer,
  RecursionField,
  Schema,
  useExpressionScope,
  useField,
  useFieldSchema,
} from '@formily/react';
import { observe, raw, toJS } from '@formily/reactive';
import { RobotOutlined  } from '@ant-design/icons'
import { createPortal } from 'react-dom';
import { Space, Tree } from 'antd';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
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
const eqeqeq = (a: TreeNode, b: TreeNode) => a.value === b.value;

const FIELD_NAMES = {
  title: 'label',
  key: 'value',
};

// https://reactive.formilyjs.org/zh-CN/api/observe
const WATCH_OP: Record<string, true> = {
  add: true,
  delete: true,
  set: true,
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

const getChainNodes = (
  root: TreeNode,
  target: TreeNode,
) => {
  const pos = getNodePos(root, target, eqeqeq);

  const chain: TreeNode[] = [];
  pos.reduce((parent, idx) => {
    const current = parent.children[idx];
    chain.push(current);
    return current;
  }, root);

  return chain;
};

type BaseTreeProps = {
  value?: TreeNode;
  onChange?: (neo: BaseTreeProps['value']) => void;
  loadData?: (options: TreeNode[]) => Promise<TreeNode[]>;
};

export interface MergedTreeProps
  extends Omit<React.ComponentProps<typeof Tree>, 'loadData'>,
    BaseTreeProps {}

export const TreeNodes = observer((props: MergedTreeProps) => {
  const { onChange, children, loadData, value, ...others } = props;

  const field = useField<ObjectField>();
  const fieldSchema = useFieldSchema();
  // const [root, setRoot]= useState(field.value?.children ?? []);

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
      let chain = getChainNodes(field.value, node);
      const last = chain[chain.length - 1];

      last.loading = true;
      const promise = methods.current.loadData ?? noop;
      return promise(chain)
        .then((list) => {
          last.children = list;
          last.loading = false;
          // setRoot((list: any) => [...list]);
        })
        .finally(() => {
          last.loading = false;
        });
    },
    [],
  );

  useEffect(() => {
    methods.current.loadData?.([])?.then?.((list) => {
      // state.root = list;
      field.setValue({
        label: 'ROOT',
        value: 'ROOT',
        children: list,
      });
      // setRoot(list);
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
    moveTreeNode(before, after, field.value);

    console.log('onDrop', { before, after });
  };

  const cloneAndCompile = (schema: Schema, scope: any) => {
    schema.mapProperties((ps, key) => {
      schema.properties![key] = ps.compile(scope);
    });
    return schema;
  }

  return (
    <React.Fragment>
      <RecursionField schema={fieldSchema} onlyRenderSelf></RecursionField>
      <TreeBase nodeKey={FIELD_NAMES.key}>
        <Tree
          selectable={false}
          showLine
          {...others}
          titleRender={(node) => {
            return (
              <TreeBase.Node
                getPos={(treeRoot) => {
                  const pos = getNodePos(
                    treeRoot,
                    node,
                    eqeqeq
                  );
                  return pos;
                }}
              >
                {(scope) => {
                  const name = scope.$path;
                  // const before = fieldSchema;
                  // fieldSchema.mapProperties(sub => sub.compile(scope))

                  // const clone = cloneAndCompile(fieldSchema, scope);

                  // const after = fieldSchema.compile(scope);
                  // console.log('compile', {after: after.properties._footer });
                  return (
                     <RecursionField
                        schema={fieldSchema}
                        name={name}
                        onlyRenderProperties
                      ></RecursionField>
                  );
                }}
              </TreeBase.Node>
            );
          }}
          draggable
          onDrop={onDrop}
          blockNode
          fieldNames={FIELD_NAMES}
          treeData={toJS(field.value).children}
          loadData={onLoad}
        ></Tree>
      </TreeBase>
    </React.Fragment>
  );
});

export default TreeNodes;
