/* eslint-disable no-shadow */
import { ArrayField } from '@formily/core';
import { useField, useFieldSchema } from '@formily/react';
import { observable } from '@formily/reactive';
import { TableProps } from 'antd';
import React, { useCallback, useEffect, useRef } from 'react';
import { useQueryList$ } from '../../shared';

type TFieldSchema = ReturnType<typeof useFieldSchema>;

const findQueryListSchema = (schema: TFieldSchema): TFieldSchema | null => {
  if (schema.parent?.['x-component'] === 'QueryList') {
    return schema.parent;
  } else if (schema.parent) {
    return findQueryListSchema(schema.parent);
  } else {
    return null;
  }
};

const hasSelection = (queryListSchema?: TFieldSchema | null): boolean => {
  if (!queryListSchema) {
    return false;
  } else {
    const ret: boolean = queryListSchema.reduceProperties(
      (buf: boolean, schema) => {
        if (buf) return buf;
        const is = schema['x-component'] === 'QueryTable.Selection';
        if (is) {
          console.log('schema', schema);
          return true;
        }
        if (schema.properties) {
          return hasSelection(schema);
        } else {
          return false;
        }
      },
      false,
    );
    return ret;
  }
};

export const useRowSelection = (
  rowKey?: React.Key | ((record: any) => React.Key),
  rowSelection?: TableProps<any>['rowSelection'],
) => {
  const field = useField() as ArrayField;
  const ctx = useQueryList$();
  const fieldSchema = useFieldSchema();
  const has = hasSelection(findQueryListSchema(fieldSchema));

  const rowKeyRef = useRef(rowKey);

  useEffect(() => {
    rowKeyRef.current = rowKey;
  }, [rowKey]);

  const getSelection = useCallback(() => {
    if (!ctx) return undefined;
    console.log('has', has);
    if (!has && !rowSelection) return undefined;
    const conf = ctx._cofnig;

    const config: TableProps<any>['rowSelection'] & {
      selectedRows: any[];
      clear: () => void;
      reverse: () => void;
    } = observable({
      type: 'checkbox' as const,
      ...rowSelection,
      selectedRows: conf._selectedRows ?? [],
      selectedRowKeys: conf._selectedRowKeys ?? [],
      clear: () => {
        conf._selectedRowKeys = [];
        conf._selectedRows = [];
      },
      reverse: () => {
        const array = field.value;
        const reverseRows = array.filter(
          (x) => !conf._selectedRows.find((r) => r === x),
        );
        const resverKeys = reverseRows.map((x) => {
          const key =
            typeof rowKeyRef.current == 'function'
              ? rowKeyRef.current(x)
              : x[rowKeyRef.current!];
          return key;
        });
        conf._selectedRowKeys = resverKeys;
        conf._selectedRows = reverseRows;
      },
      onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
        conf._selectedRowKeys = selectedRowKeys;
        conf._selectedRows = selectedRows;
      },
    });
    conf._selectReverse = config.reverse;
    conf._selectClear = config.clear;
    return config;
  }, [ctx, field.value, has, rowSelection]);

  return getSelection();
};
