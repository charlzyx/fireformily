/* eslint-disable no-shadow */
import { ArrayBase as AntdArrayBase, ArrayBaseMixins } from '@formily/antd';
import { usePrefixCls } from '@formily/antd/lib/__builtins__';
import { ArrayField } from '@formily/core';
import { RecursionField, observer, useField } from '@formily/react';
import { Alert, Space } from 'antd';
import Table from 'antd/lib/table';
import React, { Fragment, useEffect, useRef } from 'react';
import { useQueryListContext } from '../ctx';
import { Action } from '../RecordActions';
import {
  useAddition,
  useSelection,
  useSortable,
  useTableColumns,
  useTableExpandable,
  useTableSources,
  useToolbar,
} from './hooks';
import { ObPagination } from './ObPagination';
import { ComposedQueryTable, isColumnComponent } from './shared';

const ArrayBase = AntdArrayBase as typeof AntdArrayBase &
  Required<typeof AntdArrayBase>;

export const QueryTable: ComposedQueryTable = observer((props) => {
  const ref = useRef<HTMLDivElement>(null);
  const field = useField<ArrayField>();
  const prefixCls = usePrefixCls('formily-array-table');
  const dataSource = Array.isArray(field.value) ? field.value.slice() : [];
  const sources = useTableSources();
  const columns = useTableColumns(field, sources);
  const { registryAddress } = useQueryListContext();

  const sortbody = useSortable(ref);

  const addition = useAddition();
  const toolbar = useToolbar();

  const selection = useSelection(props.rowSelection);

  const expandable = useTableExpandable(props.expandable);

  const defaultRowKey = (record: any) => {
    const key = dataSource.indexOf(record);
    return key;
  };

  useEffect(() => {
    registryAddress!('list', field.address.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.address]);

  return (
    <div ref={ref} className={prefixCls}>
      {toolbar}
      {props.selectable && selection.selectedRowKeys?.length ? (
        <Alert
          style={{ marginTop: '6px', marginBottom: '6px' }}
          type="info"
          message={<Space>选中{selection.selectedRowKeys?.length}项</Space>}
        ></Alert>
      ) : null}
      <ArrayBase>
        <Table
          size="small"
          bordered
          rowKey={defaultRowKey}
          {...props}
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

QueryTable.displayName = 'QueryTable';

QueryTable.Column = () => {
  return <Fragment />;
};

QueryTable.Expand = () => {
  return <Fragment />;
};

QueryTable.Toolbar = (porps) => {
  return <div style={{ padding: `8px 0` }}>{porps.children}</div>;
};

ArrayBase?.mixin?.(QueryTable);

const Addition: ArrayBaseMixins['Addition'] = (props) => {
  return <ArrayBase.Addition method="unshift" {...props}></ArrayBase.Addition>;
};

QueryTable.Addition = Addition;
QueryTable.Action = Action;
