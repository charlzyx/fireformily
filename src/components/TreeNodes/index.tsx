import { ObjectField } from '@formily/core';
import {
  RecursionField,
  useExpressionScope,
  useField,
  useFieldSchema,
} from '@formily/react';
import { observe } from '@formily/reactive';
import { Space, Tree, TreeDataNode } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TreeRecordScope, TreeRootScope } from '../../pro/TreeDataScope';
import { OptionData } from '../../shared';
import './style.css';

const noop = () => Promise.resolve([] as OptionData[]);

const FIELD_NAMES = {
  title: 'label',
  key: 'value',
};

type NodeData = OptionData & TreeDataNode;

const getChainNodes = (
  treeData: NodeData[],
  target: NodeData,
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
  value?: {
    expandedKeys: React.Key[];
    selectedKeys: React.Key[];
    checkedKeys:
      | React.Key[]
      | {
          checked: React.Key[];
          halfChecked: React.Key[];
        };
    tree?: OptionData[];
  };
  onChange?: (neo: BaseTreeProps['value']) => void;
  loadData?: (options: OptionData[]) => Promise<OptionData[]>;
};

interface MergedTreeProps
  extends Omit<React.ComponentProps<typeof Tree>, 'loadData'>,
    BaseTreeProps {}

export const TreeNodes = (props: MergedTreeProps) => {
  const { onChange, value, children, loadData, ...others } = props;
  const [root, setRoot] = useState<NodeData[]>([]);

  // const state = useMemo(() => {
  //   return observable({ root: props?.value?.tree || [], loading: false });
  // }, [props?.value?.tree]);

  const field = useField<ObjectField>();

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

  const data: Required<MergedTreeProps>['value'] = useMemo(() => {
    if (!field) return;
    const init = {
      expandedKeys: value?.expandedKeys || [],
      selectedKeys: value?.selectedKeys || [],
      checkedKeys: value?.checkedKeys || [],
    };
    console.log('---value', field.data);
    if (!field.data) {
      field.data = init;
    }
    return field.data;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field]);

  const watch = useCallback(() => {
    setTimeout(() => {
      methods.current.onChange?.({
        tree: refs.current.root,
        ...data,
      });
    });
  }, [data]);

  useEffect(() => {
    // let timer: ReturnType<typeof setTimeout> | null = null;
    // const disposer = observe(state.root, () => {
    //   if (timer) clearTimeout(timer);
    //   timer = setTimeout(() => {
    //     watch();
    //   }, 67);
    // });
    let timer2: ReturnType<typeof setTimeout> | null = null;
    const disposer2 = observe(data, () => {
      if (timer2) clearTimeout(timer2);
      timer2 = setTimeout(() => {
        watch();
      }, 67);
    });
    return () => {
      // disposer();
      disposer2();
    };
  }, [watch, data]);

  useEffect(() => {
    if (!data) return;
    if (value?.selectedKeys) {
      data.selectedKeys = value.selectedKeys;
    }
  }, [data, value?.selectedKeys]);

  useEffect(() => {
    if (!data) return;
    if (value?.expandedKeys) {
      data.expandedKeys = value.expandedKeys;
    }
  }, [data, value?.expandedKeys]);

  useEffect(() => {
    if (!data) return;
    if (value?.checkedKeys) {
      data.checkedKeys = value.checkedKeys;
    }
  }, [data, value?.checkedKeys, value?.expandedKeys]);

  const onLoad = (node: any) => {
    let chain = getChainNodes(root, node);
    const last = chain[chain.length - 1];

    // state.loading = true;

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
        // state.loading = false;
      });
  };

  useEffect(() => {
    methods.current.loadData?.([])?.then?.((list) => {
      // state.root = list;
      setRoot(list as any);
      // data.tree = state.root;
      watch();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // console.log(data?.selectedKeys);

  return (
    <>
      <RecursionField schema={fieldSchema} onlyRenderSelf></RecursionField>
      <TreeRootScope nodeKey={FIELD_NAMES.key} getRoot={() => root}>
        <Tree
          showLine
          {...others}
          className="fireformily-tree"
          titleRender={(node: any) => {
            return (
              <TreeRecordScope<NodeData>
                getNode={() => {
                  const withSelf = getChainNodes(root, node);
                  return withSelf[withSelf.length - 1];
                }}
                getParents={(current, treeRoot) => {
                  const withSelf = getChainNodes(treeRoot!, current!);
                  withSelf.pop();
                  return withSelf;
                }}
              >
                {(scope) => {
                  const name = `${field.path.toString()}.${scope.$name}`;
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
              </TreeRecordScope>
            );
          }}
          checkedKeys={props.checkable ? data?.checkedKeys : undefined}
          onCheck={(checkInfo) => {
            if (!props.checkable) return;
            data.checkedKeys = checkInfo;
          }}
          selectedKeys={props.selectable ? data?.selectedKeys : undefined}
          onSelect={(selectInfo) => {
            console.log('----selectInfo', selectInfo);
            if (!props.selectable) return;
            data.selectedKeys = selectInfo;
          }}
          expandedKeys={data?.expandedKeys}
          onExpand={(expandInfo) => {
            data.expandedKeys = expandInfo;
          }}
          autoExpandParent
          blockNode
          fieldNames={FIELD_NAMES}
          treeData={root}
          loadData={onLoad}
        ></Tree>
      </TreeRootScope>
    </>
  );
};

export default TreeNodes;
