import { ObjectField } from '@formily/core';
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

export type TreeNode = {
  label?: string;
  value?: React.Key;
  isLeaf?: boolean;
  children?: TreeNode[];
  loading?: boolean;
  key?: React.Key;
  __init?: boolean;
};

type AntdTreeProps = React.ComponentProps<typeof Tree>;

type TreeNodesProps = React.ComponentProps<typeof TreeBase> &
  Omit<
    AntdTreeProps,
    'loadData' | 'onDrop' | 'value' | 'onChange' | 'fieldNames'
  > & {
    loadData?: (options: TreeNode[]) => Promise<TreeNode[]>;
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

const TitleRender = () => {
  const tree = TreeBase.useTree();
  const node = TreeBase.useNode();

  return node?.$path == null ? null : (
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
      ></RecursionField>
    </div>
  );
};

const TreeInner = observer((props: any) => {
  const { loadData, checkedKeys, fieldNames, children, ...others } = props;

  const helper = TreeBase.useHelper();
  const field = useField<ObjectField>();

  const methods = useRef({
    loadData,
    onDrop: props.onDrop,
  });

  const onLoad = useCallback(
    (node: any) => {
      if (!methods.current.loadData) return;
      const pos = helper.getPos(node);
      let chain = helper.posToParents(pos!);
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
    [helper],
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
          helper.move(before, after);
        });
      } else {
        helper.move(before, after);
      }

      console.log('onDrop', { before, after });
    },
    [helper],
  );

  return (
    <React.Fragment>
      <Loading></Loading>
      <Tree
        showLine
        blockNode
        {...others}
        className={`${props.className} fireformily-tree`}
        titleRender={(node) => {
          const pos = helper.getPos(node);
          // 不然会闪一下 ,可以注释掉看看
          if (!pos)
            return (
              <HACKDomToHiddenAntdNodeForFixNodeFlash></HACKDomToHiddenAntdNodeForFixNodeFlash>
            );
          // console.log('pos of', helper.take(node).title, pos, node);

          return (
            <TreeBase.Node
              key={helper.take(node).key}
              pos={() => helper.getPos(node)!}
              getExtra={() => {
                const nodeKey = helper.take(node).key;
                const bind = field.value;
                const {
                  expandedKeys: expandeds = [],
                  selectedKeys: selecteds = [],
                  checkedKeys: checkeds = [],
                  halfCheckedKeys: halfCheckeds = [],
                } = bind as any;

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
        treeData={helper.dataSource}
        onDrop={onDrop}
        loadData={onLoad as any}
      ></Tree>
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

  const methods = useRef({
    loadData: props.loadData,
  });

  useEffect(() => {
    if (!methods.current.loadData) {
      return;
    }
    if (
      field.selfModified
      // Array.isArray(field.value.children) &&
      // field.value.children.length > 0
    ) {
      return;
    }
    methods.current.loadData([]).then((rootList: any) => {
      // console.log('reloaddd');
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
        <RecursionField schema={fieldSchema} onlyRenderSelf></RecursionField>
        <Space size="small" {...layout}>
          <div>
            <TreeBase.Node
              // getNode={()=> field.value}
              pos={() => []}
            >
              <RecursionField
                schema={fieldSchema.items as any}
                onlyRenderProperties
                name=""
              ></RecursionField>
            </TreeBase.Node>
            <TreeInner {...others} fieldNames={names}></TreeInner>
          </div>
          <RecursionField
            schema={fieldSchema}
            name=""
            onlyRenderProperties
          ></RecursionField>
        </Space>
      </TreeBase>
    </React.Fragment>
  );
};

TreeBase.mixin(TreeNodes);
