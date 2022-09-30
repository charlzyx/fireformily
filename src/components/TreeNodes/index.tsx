import type { ObjectField } from '@formily/core';
import {
  observer,
  RecursionField,
  useField,
  useFieldSchema,
} from '@formily/react';
import { Space, Tree } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Loading } from '../Loading';
import { TreeBase } from '../../pro/TreeBase';
import './style.css';
import { useLatest } from 'ahooks';

export type TreeNode = {
  label?: string;
  value?: React.Key;
  isLeaf?: boolean;
  children?: TreeNode[];
  disabled?: boolean;
  loading?: boolean;
  __init?: boolean;
};

type AntdTreeProps = React.ComponentProps<typeof Tree>;

type TreeNodesProps = React.ComponentProps<typeof TreeBase> &
  Omit<
    AntdTreeProps,
    'loadData' | 'onDrop' | 'value' | 'onChange' | 'fieldNames'
  > & {
    loadData?: (options: TreeNode[]) => Promise<TreeNode[]>;
    loadAll?: () => Promise<TreeNode[]>;
    value?: {
      expanedKeys?: React.Key[];
      selectedKeys?: React.Key[];
      checkedKeys?: React.Key[];
      halfCheckedKeys?: React.Key[];
      children?: TreeNode[];
    };
    layout?: React.ComponentProps<typeof Space>;
  };

const FIELD_NAMES = {
  title: 'label',
  key: 'value',
  children: 'children',
};

const HACKDomToHiddenAntdNodeForFixNodeFlash = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let parent = ref.current?.parentElement;
    let catchyou = null as null | HTMLElement;
    while (parent && !catchyou) {
      catchyou = /ant-tree-treenode/.test(parent.getAttribute('class') || '')
        ? parent
        : null;
      parent = parent.parentElement;
    }
    if (catchyou) {
      catchyou.setAttribute('style', 'display: none');
    }
  }, []);

  return <span ref={ref}>hack</span>;
};

const TitleRender = (props: { dataKey?: React.Key }) => {
  const tree = TreeBase.useTree();
  const helper = TreeBase.useHelper();
  const node = TreeBase.useNode();

  /**
   * title render 拿到的node 跟 context 中的有一帧渲染的错位,
   * 页面闪一下，暂时没有什么好办法
   */
  const errorKeyRender = helper?.take(node?.$record).key !== props.dataKey;

  return errorKeyRender ? (
    <HACKDomToHiddenAntdNodeForFixNodeFlash />
  ) : (
    <div
      onClick={(e) => {
        if ((e?.target as any)?.tagName === 'INPUT') {
          e.stopPropagation();
        }
      }}
    >
      <RecursionField
        name={node?.$path}
        schema={tree?.schema.items as any}
       />
    </div>
  );
};

const TreeInner = observer((props: any) => {
  const { loadAll, loadData, checkedKeys, fieldNames, children, ...others } =
    props;

  const helper = TreeBase.useHelper();
  const field = useField<ObjectField>();

  const methods = useLatest({
    loadData,
    loadAll,
    onDrop: props.onDrop,
  });

  const onLoad = useCallback(
    (node: any) => {
      if (methods.current.loadAll) return;
      if (!methods.current.loadData) return;
      if (!helper) return;
      const pos = helper.getPos(node);
      const chain = helper.posToParents(pos!);
      const last = chain[chain.length - 1];
      last.loading = true;
      return methods.current
        .loadData(chain)
        .then((list: any) => {
          helper.append(pos!, 'replace', ...list);
        })
        .finally(() => {
          last.loading = false;
        });
    },
    [helper, methods],
  );

  const onDrop = useCallback(
    ({ dragNode, node }: any) => {
      const before = dragNode.pos.split('-').map(Number);
      // 这是 antd  tree 的 pos, 最前面有个0需要去掉
      before.shift();
      const after = node.pos.split('-').map(Number);
      // 这是 antd  tree 的 pos, 最前面有个0需要去掉
      after.shift();
      const ret = methods.current.onDrop?.(before, after);
      // thenable
      if (typeof ret?.then === 'function') {
        ret.then(() => {
          helper?.move(before, after);
        });
      } else {
        helper?.move(before, after);
      }

      // console.log('onDrop', { before, after });
    },
    [helper, methods],
  );

  return (
    <React.Fragment>
      <Loading />
      <Tree
        showLine
        blockNode
        {...others}
        className={`${props.className} fireformily-tree`}
        titleRender={(dataNode) => {
          if (!helper) return null;
          const pos = helper.getPos(dataNode);
          if (!pos) {
            return (
              <HACKDomToHiddenAntdNodeForFixNodeFlash />
            );
          }

          return (
            <TreeBase.Node
              key={helper.take(dataNode).key}
              pos={() => helper.getPos(dataNode)!}
              getExtra={() => {
                const nodeKey = helper.take(dataNode).key;
                const bind = field.value;
                const {
                  selectedKeys: selecteds = [],
                  checkedKeys: checkeds = [],
                  halfCheckedKeys: halfCheckeds = [],
                  expandedKeys: expandeds = [],
                } = bind as any;

                return {
                  checked: checkeds?.includes?.(nodeKey),
                  halfChecked: halfCheckeds?.includes?.(nodeKey),
                  selecteds: selecteds?.includes?.(nodeKey),
                  expanded: expandeds?.includes?.(nodeKey),
                };
              }}
            >
              <TitleRender dataKey={helper.take(dataNode).key} />
            </TreeBase.Node>
          );
        }}
        expandedKeys={field.value.expandedKeys ?? []}
        onExpand={(keys) => {
          field.setState((s) => {
            s.value.expandedKeys = keys;
          });
        }}
        selectedKeys={field.value.selectedKeys ?? []}
        onSelect={(keys) => {
          field.setState((s) => {
            s.value.selectedKeys = keys;
          });
        }}
        checkedKeys={field.value.checkedKeys}
        onCheck={(keys, info) => {
          if (!field.value) return;
          const checkeds = Array.isArray(keys) ? keys : keys.checked;
          const halfs = Array.isArray(keys)
            ? info.halfCheckedKeys
            : keys.halfChecked;

          field.setState((s) => {
            s.value.checkedKeys = checkeds;
            s.value.halfCheckedKeys = halfs ?? [];
          });
        }}
        fieldNames={fieldNames}
        treeData={helper?.dataSource}
        onDrop={onDrop}
        loadData={loadData && !loadAll ? (onLoad as any) : undefined}
       />
    </React.Fragment>
  );
});

export const TreeNodes = (props: TreeNodesProps) => {
  const {
    onAdd,
    value,
    fieldNames,
    onCopy,
    onMove,
    onRemove,
    layout,
    ...others
  } = props;
  const field = useField<ObjectField>();
  const fieldSchema = useFieldSchema();
  const names = useMemo(() => {
    return { ...FIELD_NAMES, ...fieldNames };
  }, [fieldNames]);

  const methods = useLatest({
    loader: props.loadAll || props.loadData,
  });

  useEffect(() => {
    if (!methods.current.loader) {
      return;
    }
    if (field.selfModified) {
      return;
    }
    methods.current.loader([]).then((rootList: any) => {
      console.log('reloaddd');
      field.setState((s) => {
        s.value.children = rootList;
      });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // console.log('render');

  return (
    <React.Fragment>
      <TreeBase
        getRoot={() => field.value}
        fieldNames={names}
        onAdd={onAdd}
        onRemove={onRemove}
        onCopy={onCopy}
        onMove={onMove}
      >
        <RecursionField schema={fieldSchema} onlyRenderSelf />
        <Space size="small" {...layout}>
          <Space direction="vertical" size="small">
            <TreeBase.Node getNode={() => field.value} pos={() => []}>
              <RecursionField
                schema={fieldSchema.items as any}
                onlyRenderProperties
                name=""
               />
            </TreeBase.Node>
            <TreeInner {...others} fieldNames={names} />
          </Space>
          <RecursionField
            schema={fieldSchema}
            name=""
            onlyRenderProperties
           />
        </Space>
      </TreeBase>
    </React.Fragment>
  );
};

TreeBase.mixin(TreeNodes);
