import {
  ColumnHeightOutlined,
  ReloadOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { observer, useField } from '@formily/react';
import {
  Alert,
  Button,
  Checkbox,
  Divider,
  Dropdown,
  Menu,
  Space,
  Typography,
} from 'antd';
import React from 'react';
import { useQueryList$ } from '../shared';
import { useSelection } from './hooks';

export const Titlebar = observer((props: any) => {
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
     />
  );

  const selections = useSelection();

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
              <Checkbox checked={checked} />
              {item.label}
            </Space>
          ),
          key: item.key,
        };
      })}
     />
  );

  return (
    <Space
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
      }}
    >
      <Space size="small">
        <Typography.Title level={5}>
          {field.title || props.title}
        </Typography.Title>
        {conf._selectedRowKeys.length ? (
          <Alert
            style={{ padding: '3px 4px' }}
            type="info"
            message={
              <Space size="small" split={<Divider type="vertical" />}>
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
                {selections}
              </Space>
            }
           />
        ) : null}
      </Space>
      <Space size="small">
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
