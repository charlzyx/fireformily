import { ArrayBase, ArrayBaseMixins } from '@formily/antd';
import { usePrefixCls } from '@formily/antd/esm/__builtins__';
import { ArrayField } from '@formily/core';
import { observer, useField } from '@formily/react';
import { PaginationProps, Space, Table } from 'antd';
import React, { Fragment, useEffect, useRef } from 'react';
import { useQueryList$ } from '../shared';
import { useAddition, useColumnsAndSourceRender, useSortable } from './hooks';
import { useExpandable } from './hooks/useExpandable';

interface IQueryTableProps extends React.ComponentProps<typeof Table> {}

export const QueryTable: React.FC<IQueryTableProps> &
  ArrayBaseMixins & {
    Toolbar?: React.FC<React.PropsWithChildren<{}>>;
    Operations?: React.FC<React.PropsWithChildren<{}>>;
    Expand?: React.FC<React.PropsWithChildren<{}>>;
  } = observer((props: IQueryTableProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wrapperCls = usePrefixCls('formily-array-table');

  const ctx = useQueryList$();
  const field = useField<ArrayField>();

  console.log('field.value', field.value);

  const dataSource = Array.isArray(field.value) ? field.value.slice() : [];

  const sortableBody = useSortable(wrapperRef);

  const [columns, renderSources] = useColumnsAndSourceRender();

  const addtion = useAddition();

  const expandable = useExpandable(props.expandable);

  useEffect(() => {
    if (!ctx) return;
    ctx._address!.table = field.address.toString();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx, field?.address?.toString()]);

  useEffect(() => {
    if (!ctx?.service) return;
    if (field && !field.data) {
      field.data = {};
      field.data.pagination = {
        current: ctx?.pageStart || 1,
        pageSize: 10,
      } as PaginationProps;
    }
  }, [ctx, field]);

  // const page = useMemo(() => {
  //   const ret = field?.data?.pagination
  //     ? field.data.pgination
  //     : {
  //         current: ctx?.pageStart || 1,
  //         defaultCurrent: ctx?.pageStart || 1,
  //       };
  //   console.log('--page', ret);
  //   return ret;
  // }, [ctx?.pageStart, field]);

  const defaultRowKey = (record: any) => {
    return dataSource.indexOf(record);
  };

  console.log('--table', {
    dataSource,
    columns,
    page: field?.data?.pagination,
  });
  return (
    <div ref={wrapperRef} className={wrapperCls}>
      <ArrayBase>
        <Table
          rowKey={defaultRowKey}
          {...props}
          expandable={expandable}
          columns={columns}
          loading={props.loading || ctx?._loading}
          components={{ body: sortableBody }}
          dataSource={dataSource}
          pagination={field?.data?.pagination ?? false}
          onChange={(pagination, filters, sorter, extra) => {
            console.log('---onTableChange', {
              pagination,
              filters,
              sorter,
              extra,
            });
            field.setData({ pagination, filters, sorter, extra });
            ctx?._trigger?.();
          }}
        >
          {renderSources()}
        </Table>
        {addtion}
      </ArrayBase>
    </div>
  );
});

ArrayBase?.mixin?.(QueryTable);

QueryTable.Operations = () => {
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
