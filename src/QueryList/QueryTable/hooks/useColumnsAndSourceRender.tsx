/* eslint-disable no-shadow */
import DownOutlined from '@ant-design/icons/DownOutlined';
import { ArrayBase as AntdArrayBase } from '@formily/antd';
import { ArrayField, FieldDisplayTypes, GeneralField } from '@formily/core';
import { RecursionField, Schema, useFieldSchema } from '@formily/react';
import { isArr } from '@formily/shared';
import { Dropdown, Menu, Space } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import React from 'react';
import { useQueryList$ } from '../../shared';

import {
  isAdditionComponent,
  isColumnComponent,
  isOperationsComponent,
} from './utils';

const ArrayBase = AntdArrayBase as Required<typeof AntdArrayBase>;

export interface ObservableColumnSource {
  field: GeneralField;
  columnProps: ColumnProps<any>;
  schema: Schema;
  display: FieldDisplayTypes;
  name: string;
}

const parseArrayItems = (
  schema: Schema['items'],
  parser: (subSchema: Schema) => any,
): ObservableColumnSource[] => {
  if (!schema) return [];
  const sources: ObservableColumnSource[] = [];
  const items = isArr(schema) ? schema : [schema];
  return items.reduce((columns, schema) => {
    const item = parser(schema);
    if (item) {
      return columns.concat(item);
    }
    return columns;
  }, sources);
};

const renderOperations = (
  props: any,
  schema: Schema,
  index: number,
  field: ArrayField,
) => {
  const propLength = Object.keys(schema.properties || {}).length;
  const max = props.maxItems || 2;
  const menu =
    propLength > max ? (
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

  return (
    <ArrayBase.Item index={index} record={() => field?.value?.[index]}>
      <Space size="small">
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
        {propLength > max ? (
          <Dropdown overlay={menu!}>
            <a>
              <DownOutlined />
            </a>
          </Dropdown>
        ) : null}
      </Space>
    </ArrayBase.Item>
  );
};

export const useColumnsAndSourceRender = (arrayField: ArrayField) => {
  const ctx = useQueryList$();
  const schema = useFieldSchema();
  const parseSources = (schema: Schema): ObservableColumnSource[] => {
    if (
      isColumnComponent(schema) ||
      isOperationsComponent(schema) ||
      isAdditionComponent(schema)
    ) {
      if (!schema['x-component-props']?.['dataIndex'] && !schema['name'])
        return [];

      const name = schema['x-component-props']?.['dataIndex'] || schema['name'];

      const field = arrayField.query(arrayField.address.concat(name)).take();

      const columnProps =
        (field?.component as any)?.[1] || schema['x-component-props'] || {};

      const display = field?.display || schema['x-display'];

      return [
        {
          name,
          display,
          field,
          schema,
          columnProps,
        },
      ];
    } else if (schema.properties) {
      return schema.reduceProperties((buf, schema) => {
        return buf.concat(parseSources(schema));
      }, [] as ObservableColumnSource[]);
    } else {
      return [];
    }
  };

  if (!schema) throw new Error('can not found schema object');

  const sources = parseArrayItems(schema.items as any, parseSources);

  const columns = sources.reduce(
    (buf, { name, columnProps, schema, display }, key) => {
      // hidden by user select
      if (
        ctx &&
        ctx._cofnig &&
        ctx?._cofnig._showColumns!.length > 0 &&
        ctx?._cofnig._showColumns?.findIndex(
          (dataIndex) => dataIndex === name,
        ) === -1
      ) {
        return buf;
      }
      if (display === 'hidden') return buf;
      if (isOperationsComponent(schema)) {
        return buf.concat({
          fixed: true,
          ...columnProps,
          key,
          dataIndex: name,
          render: (value: any, record: any) => {
            const index = arrayField?.value?.indexOf(record);
            return renderOperations(columnProps, schema, index, arrayField);
          },
        });
      }

      if (!isColumnComponent(schema)) return buf;

      return buf.concat({
        ...columnProps,
        filters: Array.isArray(columnProps.filters)
          ? columnProps.filters
          : undefined,
        key: name,
        dataIndex: name,
        render: (value: any, record: any) => {
          const index = arrayField?.value?.indexOf(record);
          const children = (
            <ArrayBase.Item
              index={index}
              record={() => arrayField?.value?.[index]}
            >
              <RecursionField
                schema={schema}
                name={index}
                onlyRenderProperties
              />
            </ArrayBase.Item>
          );
          return children;
        },
      });
    },
    [] as ColumnProps<any>[],
  );

  const renderSources = () => {
    return sources.map((column, key) => {
      //专门用来承接对Column的状态管理
      if (!isColumnComponent(column.schema)) return null;

      return (
        <RecursionField
          key={key}
          schema={column.schema}
          name={column.name}
          onlyRenderSelf
        />
      );
    });
  };

  // console.log('--columns', { columns, sources });

  return [columns, renderSources] as const;
};
