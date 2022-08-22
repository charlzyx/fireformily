/* eslint-disable no-shadow */
import { ArrayBase as AntdArrayBase, ArrayBaseMixins } from '@formily/antd';
import { usePrefixCls } from '@formily/antd/lib/__builtins__';
import { ArrayField } from '@formily/core';
import { RecursionField, observer, useField } from '@formily/react';
import { Alert, Button, Divider, Space } from 'antd';
import Table from 'antd/lib/table';
import React, { Fragment, useEffect, useMemo, useRef } from 'react';
import { useQueryListContext } from '../ctx';
import { Action } from '../RecordActions';
import {
  useAddition,
  useSelection,
  useSortable,
  useTableColumns,
  useTableExpandable,
  useTableSources,
} from './hooks';
import { ObPagination } from './ObPagination';
import { ComposedQueryTable, isColumnComponent } from './shared';

const ArrayBase = AntdArrayBase as typeof AntdArrayBase &
  Required<typeof AntdArrayBase>;

export const QueryTable: ComposedQueryTable = observer((props) => {
  const ref = useRef<HTMLDivElement>(null);
  const field = useField<ArrayField>();
  const prefixCls = usePrefixCls('formily-array-table');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dataSource = field.value;
  //  Array.isArray(field.value) ? field.value.slice() : [];
  const sources = useTableSources();
  const columns = useTableColumns(field, sources);
  const { registryAddress } = useQueryListContext();

  const sortbody = useSortable(ref);

  const addition = useAddition();

  const [rowKey, selection] = useSelection(props.rowKey, props.rowSelection);

  const expandable = useTableExpandable(props.expandable);

  useEffect(() => {
    registryAddress!('list', field.address.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.address]);

  return (
    <div ref={ref} className={prefixCls}>
      {props.selectable && selection.selectedRowKeys?.length ? (
        <Alert
          style={{ marginTop: '4px', marginBottom: '4px' }}
          type="info"
          message={
            <Space size="small" split={<Divider type="vertical"></Divider>}>
              <Button type="text" size="small">
                选中 {selection.selectedRowKeys?.length} 项
              </Button>
              <Button
                size="small"
                onClick={() => {
                  selection.clear();
                }}
                type="link"
              >
                取消选择
              </Button>
              <Button
                size="small"
                onClick={() => {
                  selection.reverse();
                }}
                type="link"
              >
                反向选择
              </Button>
            </Space>
          }
        ></Alert>
      ) : null}

      <ArrayBase>
        <Table
          size="small"
          bordered
          {...props}
          rowKey={rowKey as any}
          expandable={expandable}
          rowSelection={props.selectable ? selection : undefined}
          components={{ body: sortbody }}
          onChange={() => {}}
          pagination={false}
          columns={columns}
          dataSource={dataSource}
        />
        <div style={{ marginTop: 5, marginBottom: 5 }}>
          <ObPagination></ObPagination>
        </div>
        {sources.map((column, key) => {
          //专门用来承接对Column的状态管理
          if (!isColumnComponent(column.schema)) return;
          return React.createElement(RecursionField, {
            name: column.name,
            schema: column.schema,
            onlyRenderSelf: true,
            key,
          });
        })}
        {addition}
      </ArrayBase>
    </div>
  );
});

QueryTable.Column = () => {
  return <Fragment />;
};

QueryTable.Expand = () => {
  return <Fragment />;
};

QueryTable.Toolbar = (props) => {
  return (
    <Space
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '8px',
      }}
    >
      {props.children}
    </Space>
  );
};

ArrayBase?.mixin?.(QueryTable);

const Addition: ArrayBaseMixins['Addition'] = (props) => {
  return <ArrayBase.Addition method="unshift" {...props}></ArrayBase.Addition>;
};

QueryTable.Addition = Addition;
QueryTable.Action = Action;
