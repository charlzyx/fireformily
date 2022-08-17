/* eslint-disable no-shadow */
import { Schema } from '@formily/json-schema';
import { useField, useFieldSchema } from '@formily/react';
import { isArr } from '@formily/shared';

import {
  ObservableColumnSource,
  isAdditionComponent,
  isColumnComponent,
  isOperationsComponent,
} from '../shared';

const parseArrayItems = (
  schema: Schema['items'],
  parser: (subSchema: Schema) => any,
) => {
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

export const useTableSources = () => {
  const arrayField = useField();
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

  return parseArrayItems(schema.items, parseSources);
};
