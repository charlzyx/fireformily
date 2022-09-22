import { ArrayField, ObjectField } from '@formily/core';
import {
  Field,
  RecursionField,
  useExpressionScope,
  useField,
  useFieldSchema,
} from '@formily/react';
import { observe, observable } from '@formily/reactive';
import { Space, Tree, TreeDataNode } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TreeBase } from '../../pro/TreeBase';
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
  treeData: TreeNode[],
  target: TreeNode,
  parentChain?: any[],
) => {
  const chain = parentChain || [];
  for (let index = 0; index < treeData.length; index++) {
    const item = treeData[index];
    if (item.value === target.value) {
      chain.unshift(item);
      return chain;
    }
    if (item.children) {
      const inMyChild = getChainNodes(item.children, target, chain);
      if (inMyChild.length > 0) {
        chain.unshift(item);
        return chain;
      }
    }
  }
  return chain;
};

const ScopeLogger = () => {
  const scope = useExpressionScope();
  const psr = (x: any) => {
    try {
      return JSON.parse(JSON.stringify(x));
    } catch (error) {
      return x;
    }
  };

  return (
    <div
      onClick={() => {
        console.log('---scope', JSON.parse(JSON.stringify(scope, null, 2)));
        let $lookup = scope.$lookup;
        console.log('$name', scope.$name, scope.$record.label);
        console.log('$lookup', psr($lookup));
        console.log('$lookup.$lookup', psr($lookup?.$lookup));
        console.log('$lookup.$lookup.$lookup', psr($lookup?.$lookup?.$lookup));
      }}
    >
      LOG SCOPE
    </div>
  );
};

type BaseTreeProps = {
  value?: TreeNode[];
  onChange?: (neo: BaseTreeProps['value']) => void;
  loadData?: (options: TreeNode[]) => Promise<TreeNode[]>;
};

interface MergedTreeProps
  extends Omit<React.ComponentProps<typeof Tree>, 'loadData'>,
    BaseTreeProps {}

export const TreeNodes = React.memo((props: MergedTreeProps) => {
  const { onChange, children, loadData, value, ...others } = props;

  const field = useField<ObjectField>();
  const [root, setRoot] = useState<TreeNode[]>(
    Array.isArray(field.value) ? field.value.slice() : [],
  );

  const fieldSchema = useFieldSchema();

  const methods = useRef({
    onChange: props.onChange,
    loadData: props.loadData,
  });

  const refs = useRef({
    root: root,
  });

  useEffect(() => {
    refs.current.root = root;
  }, [root]);

  useEffect(() => {
    methods.current.loadData = props.loadData;
    methods.current.onChange = props.onChange;
  }, [props.loadData, props.onChange]);

  const watch = useCallback(() => {
    setTimeout(() => {
      methods.current.onChange?.(refs.current.root);
    });
  }, []);

  const onLoad = useCallback(
    (node: any) => {
      let chain = getChainNodes(refs.current.root, node);
      const last = chain[chain.length - 1];

      last.loading = true;
      const promise = methods.current.loadData ?? noop;
      return promise(chain)
        .then((list) => {
          last.children = list;
          last.loading = false;
          setRoot((x) => [...x]);
          watch();
        })
        .finally(() => {
          last.loading = false;
        });
    },
    [watch],
  );

  useEffect(() => {
    methods.current.loadData?.([])?.then?.((list) => {
      // state.root = list;
      setRoot(list as any);
      // data.tree = state.root;
      watch();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDrop = (...args: any[]) => {
    console.log('onDrop', { args });
  };

  return (
    <>
      <RecursionField schema={fieldSchema} onlyRenderSelf></RecursionField>
      <TreeBase nodeKey={FIELD_NAMES.key} getRoot={() => refs.current.root}>
        <Tree
          showLine
          {...others}
          titleRender={(node) => {
            return (
              <TreeBase.Node
                getNode={(treeRoot) => {
                  const withSelf = getChainNodes(treeRoot, node);
                  return withSelf[withSelf.length - 1];
                }}
                getParents={(current, treeRoot) => {
                  const withSelf = getChainNodes(treeRoot!, current!);
                  withSelf.pop();
                  return withSelf;
                }}
                extra={node}
              >
                {(scope) => {
                  // const name = `${field.path.toString()}.${scope.$name}`;
                  const name = `${scope.$name}`;
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
          autoExpandParent
          draggable
          onDrop={onDrop}
          blockNode
          fieldNames={FIELD_NAMES}
          treeData={root}
          loadData={onLoad}
        ></Tree>
      </TreeBase>
    </>
  );
});

export default TreeNodes;
