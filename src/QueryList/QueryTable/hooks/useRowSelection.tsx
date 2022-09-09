/* eslint-disable no-shadow */
import { ArrayField } from '@formily/core';
import { useField } from '@formily/react';
import { observable } from '@formily/reactive';
import { TableProps } from 'antd';
import React, { useCallback, useEffect, useRef } from 'react';
import { useQueryList$ } from '../../shared';

export const useRowSelection = (
  rowKey?: React.Key | ((record: any) => React.Key),
  rowSelection?: TableProps<any>['rowSelection'],
) => {
  const field = useField() as ArrayField;
  const ctx = useQueryList$();

  const rowKeyRef = useRef(rowKey);

  useEffect(() => {
    rowKeyRef.current = rowKey;
  }, [rowKey]);

  const getSelection = useCallback(() => {
    if (!ctx) return undefined;
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
  }, [ctx, field.value, rowSelection]);

  return getSelection();
};
