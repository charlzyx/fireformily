/* eslint-disable no-shadow */
import { useField } from '@formily/react';
import { TableProps } from 'antd';
import React, { useMemo, useState } from 'react';

export const useSelection = (
  rowSelection?: TableProps<any>['rowSelection'],
) => {
  // QueryTable 所在的 field
  const field = useField();
  const [rowKeys, setRowKeys] = useState<React.Key[]>(
    field?.data?.selectedRowKeys || [],
  );

  const selection = useMemo(() => {
    const config: TableProps<any>['rowSelection'] = {
      type: 'checkbox',
      selectedRowKeys: rowKeys,
      onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
        setRowKeys(selectedRowKeys);
        field.setState((s) => {
          s.data = s.data || {};
          s.data.selectedRowKeys = selectedRowKeys;
          s.data.selectedRows = selectedRows;
        });
      },
      ...rowSelection,
    };
    return config;
  }, [field, rowKeys, rowSelection]);

  return selection;
};
