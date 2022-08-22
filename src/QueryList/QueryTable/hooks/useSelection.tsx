/* eslint-disable no-shadow */
import { useField } from '@formily/react';
import { observable } from '@formily/reactive';
import { TableProps } from 'antd';
import { ArrayField } from '@formily/core';
import React, { useEffect, useMemo, useRef } from 'react';

export const useSelection = (
  propRowKey?: React.Key | ((record: any) => React.Key),
  rowSelection?: TableProps<any>['rowSelection'],
) => {
  const field = useField() as ArrayField;

  const rowKey = useMemo(() => {
    const takeKey =
      propRowKey ||
      ((record: any) => {
        const key = field.value.indexOf(record);
        return key;
      });
    return takeKey;
  }, [field.value, propRowKey]);

  const rowKeyRef = useRef(rowKey);

  useEffect(() => {
    rowKeyRef.current = rowKey;
  }, [rowKey]);

  const selection = useMemo(() => {
    const config: TableProps<any>['rowSelection'] & {
      selectedRows: any[];
      clear: () => void;
      reverse: () => void;
    } = observable({
      type: 'checkbox' as const,
      selectedRows: [] as any[],
      selectedRowKeys: [],
      clear: () => {
        config!.selectedRowKeys = [];
        config!.selectedRows = [];
      },
      reverse: () => {
        const array = field.value;
        const reverseRows = array.filter(
          (x) => !config.selectedRows.find((r) => r === x),
        );
        const resverKeys = reverseRows.map((x) => {
          const key =
            typeof rowKeyRef.current == 'function'
              ? rowKeyRef.current(x)
              : x[rowKeyRef.current];
          return key;
        });
        config.selectedRowKeys = resverKeys;
        config.selectedRows = reverseRows;
      },
      onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
        config.selectedRowKeys = selectedRowKeys;
        config.selectedRows = selectedRows;
      },
      ...rowSelection,
    });
    return config;
  }, [field, rowSelection]);

  return [rowKey, selection] as const;
};
