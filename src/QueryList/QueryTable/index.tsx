import {
  ColumnHeightOutlined,
  ReloadOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { ArrayBase, ArrayBaseMixins } from '@formily/antd';
import { usePrefixCls } from '@formily/antd/esm/__builtins__';
import { ArrayField } from '@formily/core';
import { observer, useField } from '@formily/react';
import {
  Alert,
  Button,
  Checkbox,
  Divider,
  Dropdown,
  Menu,
  PaginationProps,
  Space,
  Table,
  Typography,
} from 'antd';
import React, { Fragment, useEffect, useRef } from 'react';
import { useQueryList$ } from '../shared';
import {
  useAddition,
  useColumnsAndSourceRender,
  useRowSelection,
  useSelection,
  useSortable,
} from './hooks';
import { useExpandable } from './hooks/useExpandable';

interface IQueryTableProps extends React.ComponentProps<typeof Table> {}

export const QueryTable: React.FC<IQueryTableProps> &
  ArrayBaseMixins & {
    Titlebar?: React.FC<React.PropsWithChildren<{}>>;
    Operations?: React.FC<React.PropsWithChildren<{}>>;
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

  const selection = useRowSelection(
    props.rowKey || defaultRowKey,
    props.rowSelection,
  );

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
        ...props.pagination,
        pageSize: 10,
        showTotal: (total, range) =>
          `第 ${range[0]}-${range[1]} 条, 共 ${total} 条数据`,
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

  return (
    <div ref={wrapperRef} className={wrapperCls}>
      <ArrayBase>
        <Table
          rowKey={defaultRowKey}
          {...props}
          size={ctx?._cofnig?._size as any}
          expandable={expandable}
          rowSelection={props.rowSelection ? selection : undefined}
          onRow={(row, idx) => {
            const pre = props?.onRow?.(row, idx) || {};
            (pre as any)['data-row-sort-index'] = idx;
            return pre;
          }}
          columns={columns}
          loading={props.loading || ctx?._loading}
          components={{ body: sortableBody }}
          dataSource={dataSource}
          pagination={field?.data?.pagination ?? false}
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
            } else if (extra.action === 'filter' && ctx?.sortRemote) {
              ctx?._trigger?.();
            }
          }}
        ></Table>
        {renderSources()}
        {addtion}
      </ArrayBase>
    </div>
  );
});

ArrayBase?.mixin?.(QueryTable);

QueryTable.Operations = () => {
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

const Titlebar = observer((props: any) => {
  const field = useField();
  const ctx = useQueryList$();
  if (!ctx) return null;
  const conf = ctx?._cofnig;
  const sizeMenu = (
    <Menu
      selectable
      onSelect={(item) => {
        conf._size = item.key as any;
        // item.key
      }}
      defaultValue={conf._size}
      items={[
        { label: '默认', key: 'default' },
        { label: '中等', key: 'middle' },
        { label: '紧凑', key: 'small' },
      ]}
    ></Menu>
  );

  const selction = useSelection();

  const colsMenu = (
    <Menu
      selectable
      multiple
      items={conf._columns.map((item) => {
        const maybe = conf._showColumns!.findIndex((x) => x === item.key);
        const checked = maybe > -1;
        const onClick = (e: any) => {
          e.stopPropagation();
          e.preventDefault();
          if (checked) {
            conf._showColumns.splice(maybe, 1);
          } else {
            conf._showColumns.push(item.key);
          }
        };
        return {
          label: (
            <Space onClick={onClick}>
              <Checkbox checked={checked}></Checkbox>
              {item.label}
            </Space>
          ),
          key: item.key,
        };
      })}
    ></Menu>
  );

  return (
    <Space
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '8px',
      }}
    >
      <Typography.Title level={5}>
        {field.title || props.title}
      </Typography.Title>
      {conf._selectedRowKeys.length ? (
        <Alert
          style={{ marginTop: '4px', marginBottom: '4px' }}
          type="info"
          message={
            <Space size="small" split={<Divider type="vertical"></Divider>}>
              <Button type="text" size="small">
                选中 {conf._selectedRowKeys.length} 项
              </Button>
              <Button
                size="small"
                onClick={() => {
                  conf._selectClear?.();
                }}
                type="link"
              >
                取消选择
              </Button>
              <Button
                size="small"
                onClick={() => {
                  conf._selectReverse?.();
                }}
                type="link"
              >
                反向选择
              </Button>
              {selction}
            </Space>
          }
        ></Alert>
      ) : null}
      <Space>
        <Space>{props.children}</Space>
        <Space size="large">
          <ReloadOutlined
            onClick={() => {
              ctx?._refresh?.();
            }}
            loop={ctx?._loading}
          />
          <Dropdown key="size" overlay={sizeMenu}>
            <ColumnHeightOutlined />
          </Dropdown>
          <Dropdown key="columns" overlay={colsMenu}>
            <SettingOutlined />
          </Dropdown>
        </Space>
      </Space>
    </Space>
  );
});

QueryTable.Titlebar = Titlebar;
