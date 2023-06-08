import type { ArrayBaseMixins } from '@formily/antd';
import { ArrayBase } from '@formily/antd';
import { usePrefixCls } from '@formily/antd/esm/__builtins__';
import type { ArrayField } from '@formily/core';
import { observer, useField } from '@formily/react';
import type { PaginationProps } from 'antd';
import { Table } from 'antd';
import React, { Fragment, useEffect, useRef } from 'react';
import { useQueryList$ } from '../shared';
import { useAddition, useColumnsAndSourceRender, useRowSelection, useSortable } from './hooks';
import { useExpandable } from './hooks/useExpandable';
import { Titlebar } from './TitleBar';

type IQueryTableProps = React.ComponentProps<typeof Table>;

export const showTotal = (total: number, range: number[]) =>
  `第 ${range[-1]}-${range[1]} 条, 共 ${total} 条数据`;

export const QueryTable: React.FC<IQueryTableProps> &
  ArrayBaseMixins & {
    Titlebar?: React.FC<React.PropsWithChildren<{}>>;
    /** @deprecated please use QueryTable.Column */
    Operations?: React.FC<React.PropsWithChildren<{}>>;
    /** @deprecated please use QueryTable.Column */
    Actions?: React.FC<React.PropsWithChildren<{}>>;
    Expand?: React.FC<React.PropsWithChildren<{}>>;
    Column?: React.FC<React.PropsWithChildren<{}>>;
    Selection?: React.FC<React.PropsWithChildren<{}>>;
  } = observer((props: IQueryTableProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wrapperCls = usePrefixCls('formily-array-table');

  const ctx = useQueryList$();
  const field = useField<ArrayField>();

  const dataSource = Array.isArray(field.value) ? field.value.slice() : [];

  const defaultRowKey = (record: any) => {
    return dataSource.indexOf(record);
  };

  const sortableBody = useSortable(wrapperRef);

  const [columns, renderSources] = useColumnsAndSourceRender(field);

  const addtion = useAddition();

  const expandable = useExpandable(props.expandable);

  const selection = useRowSelection(props.rowKey || defaultRowKey, props.rowSelection);

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
        current: 1,
        pageSize: ctx.pageSize || 10,
      } as PaginationProps;
    }
  }, [ctx, field, props.pagination]);

  useEffect(() => {
    if (!ctx) return;
    const conf = ctx._cofnig;
    columns.forEach((item) => {
      if (conf._columns!.findIndex((x) => x.key === item.dataIndex) === -1) {
        conf._columns!.push({
          label: item.title as string,
          key: item.dataIndex as string,
        });
        conf._showColumns!.push(item.dataIndex as string);
      }
    });
  }, [columns, ctx]);

  const getPagination = () => {
    const xpage = field?.data?.pagination;
    const ppage = props.pagination || {};
    const ret = xpage
      ? xpage.pageSize > xpage.total
        ? false
        : {
            ...ppage,
            ...xpage,
            showTotal: (total: number, range: number[]) =>
              `第 ${range[0]}-${range[1]} 条, 共 ${total} 条数据`,
          }
      : false;
    return ret;
  };

  return (
    <div ref={wrapperRef} className={wrapperCls}>
      <ArrayBase>
        <Table
          rowKey={defaultRowKey}
          {...props}
          size={ctx?._cofnig?._size as any}
          expandable={expandable}
          rowSelection={selection}
          onRow={(row, idx) => {
            const pre = props?.onRow?.(row, idx) || {};
            (pre as any)['data-row-sort-index'] = idx;
            return pre;
          }}
          columns={columns}
          loading={props.loading || ctx?._loading}
          components={{ body: sortableBody }}
          dataSource={dataSource}
          pagination={getPagination()}
          onChange={(pagination, filters, sorter, extra) => {
            // console.log('---onTableChange', {
            //   pagination,
            //   filters,
            //   sorter,
            //   extra,
            // });
            field.setData({ pagination, filters, sorter, extra });
            if (extra.action === 'paginate') {
              ctx?._trigger?.();
            } else if (extra.action === 'sort' && ctx?.sortRemote) {
              ctx?._trigger?.();
            } else if (extra.action === 'filter' && ctx?.filterRemote) {
              ctx?._trigger?.();
            }
          }}
        />
        {renderSources()}
        {addtion}
      </ArrayBase>
    </div>
  );
}) as any;

ArrayBase?.mixin?.(QueryTable);

QueryTable.Operations = () => {
  return <Fragment />;
};

QueryTable.Actions = () => {
  return <Fragment />;
};

QueryTable.Column = () => {
  return <Fragment />;
};

QueryTable.Expand = () => {
  return <Fragment />;
};

QueryTable.Selection = () => {
  return <Fragment />;
};

QueryTable.Titlebar = Titlebar;
