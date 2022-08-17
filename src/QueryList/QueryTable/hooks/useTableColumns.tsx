import { ArrayField } from '@formily/core';
import { ArrayBase as AntdArrayBase } from '@formily/antd';
import { RecursionField, Schema } from '@formily/react';
import { Button, Divider, Dropdown, Menu, Space } from 'antd';
import { TableProps } from 'antd/lib/table';
import React from 'react';
import {
  ObservableColumnSource,
  isActionsColumnComponent,
  isColumnComponent,
} from '../shared';

const ArrayBase = AntdArrayBase as Required<typeof AntdArrayBase>;

const children = (
  props: any,
  schema: Schema,
  index: number,
  field: ArrayField,
) => {
  // console.log('props.type', props);
  const propLength = Object.keys(schema.properties || {}).length;
  const max = props.maxItems || 2;
  const menu =
    propLength >= max ? (
      <Menu
        mode="vertical"
        items={schema
          .mapProperties((propSchema, key, idx) => {
            if (idx < max) return null;
            return {
              key: idx,
              label: (
                <RecursionField schema={propSchema} name={`${index}.${key}`} />
              ),
            };
          })
          .filter(Boolean)}
      ></Menu>
    ) : undefined;

  return props.type === 'actions' ? (
    <ArrayBase.Item index={index} record={() => field?.value?.[index]}>
      <Space size="small" split={<Divider type="vertical"></Divider>}>
        {schema.mapProperties((propSchema, key, idx) => {
          if (idx >= max) return null;
          return (
            <RecursionField
              key={`${index}.${key}`}
              schema={propSchema}
              name={`${index}.${key}`}
            />
          );
        })}
        {propLength >= max ? (
          <Dropdown overlay={menu!}>
            <Button size="small" type="link">
              ...
            </Button>
          </Dropdown>
        ) : null}
      </Space>
    </ArrayBase.Item>
  ) : (
    <ArrayBase.Item index={index} record={() => field?.value?.[index]}>
      <RecursionField schema={schema} name={index} onlyRenderProperties />
    </ArrayBase.Item>
  );
};

export const useTableColumns = (
  field: ArrayField,
  sources: ObservableColumnSource[],
): TableProps<any>['columns'] => {
  return sources.reduce((buf, { name, columnProps, schema, display }, key) => {
    if (display !== 'visible') return buf;
    if (!isColumnComponent(schema) && !isActionsColumnComponent(schema))
      return buf;
    return buf.concat({
      ...columnProps,
      key,
      dataIndex: name,
      render: (value: any, record: any) => {
        const index = field?.value?.indexOf(record);
        const child = children(columnProps, schema, index, field);
        // (
        //   <ArrayBase.Item index={index} record={() => field?.value?.[index]}>
        //     <RecursionField schema={schema} name={index} onlyRenderProperties />
        //   </ArrayBase.Item>
        // );
        return child;
      },
    });
  }, [] as Required<TableProps<any>>['columns']);
};
