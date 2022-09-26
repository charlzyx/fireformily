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
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { NodePos } from 'src/pro/TreeBase/scopes';
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

const isChangeMatch = (type: string, path: string[]) => {
  const isTypeMatch = WATCH_OP[type];
  if (!isTypeMatch) return;
  const isLoading = path[path.length - 1] === 'loading';
  const isChildren = path[path.length - 1] === 'children';
  if (isChildren) return true;

  if (isLoading) {
    const isPropChildren = path[path.length - 3] === 'children';
    if (!isPropChildren) return;
    const isLength = /length|\d+/.test(path[path.length - 2]);
    return isLength;
  } else {
    const isPropChildren = path[path.length - 2] === 'children';
    if (!isPropChildren) return;
    const isLength = /length|\d+/.test(path[path.length - 1]);
    return isLength;
  }
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

const getChainNodes = (root: TreeNode, target: TreeNode) => {
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
  value?: {
    checkedKeys?: React.Key[];
    checkedNodes?: TreeNode[];
    selectedKey?: React.Key;
    selectedNode?: TreeNode;
    children?: TreeNode[];
  };
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
  /** set State 才能够出发 tree 展开的indent 更新 */
  const [root, setRoot] = useState(field.value?.children ?? []);

  const data = useMemo(() => {
    return observable({
      expandedKeys: [] as React.Key[],
      autoExpandParent: false,
    });
  }, []);

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
      // console.log('toload', chain);

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
    [field.value],
  );

  useEffect(() => {
    methods.current.loadData?.([])?.then?.((list) => {
      // state.root = list;
      field.setState(s => {
        s.value.label = "ROOT";
        s.value.value = "ROOT";
        s.value.children = list;
      })
      setRoot(toJS(field.value.children));
      let timer: ReturnType<typeof setTimeout> | null = null;

      const disposer = observe(field.value, (change) => {
        /** 通过判断children 长度变化 | loading 变化来精确更新 */
        const isMatch = isChangeMatch(change.type, change.path);
        if (isMatch) {
          if (timer) {
            clearTimeout(timer);
          }
          timer = setTimeout(() => {
            setRoot(toJS(field.value.children));
          });
        }
      });
      return disposer;
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
    TreeBase.opreations.move(before, after, field.value);

    console.log('onDrop', { before, after });
  };

  const onAdd = (pos: number[]) => {
    const parent = pos.reduce((p, at) => {
      return p?.children?.[at]!;
    }, field.value);
    if (data.expandedKeys.findIndex((k) => k == parent.value) === -1) {
      data.expandedKeys.push(parent.value);
      if (!parent.children) {
        return onLoad({ value: parent.value });
      }
    }
  };

  return (
    <React.Fragment>
      <RecursionField schema={fieldSchema} onlyRenderSelf></RecursionField>
      <TreeBase nodeKey={FIELD_NAMES.key} onAdd={onAdd}>
        <Tree
          selectable={false}
          showLine
          {...others}
          expandedKeys={[...data.expandedKeys]}
          checkedKeys={[...field.value.checkedKeys ?? []]}
          onCheck={keys => {
            field.value.checkedKeys = keys;
          }}
          autoExpandParent={data.autoExpandParent}
          onExpand={(ekeys) => {
            data.expandedKeys = ekeys;
            data.autoExpandParent = false;
          }}
          titleRender={(node) => {
            return (
              <TreeBase.Node
                pos={(treeRoot) => {
                  const pos = getNodePos(treeRoot, node, eqeqeq);
                  return pos;
                }}
              >
                {(scope) => {
                  const name = scope.$path;
                  if (!scope.$record) return null;
                  // HACK: 解决一个删除闪 ROOT 的问题
                  return (
                    <RecursionField
                      schema={fieldSchema.items as any}
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
          treeData={root}
          loadData={onLoad}
        ></Tree>
        <RecursionField
          schema={fieldSchema}
          name=""
          onlyRenderProperties
        ></RecursionField>
      </TreeBase>
    </React.Fragment>
  );
});

TreeBase.mixin?.(TreeNodes)

export default TreeNodes;
