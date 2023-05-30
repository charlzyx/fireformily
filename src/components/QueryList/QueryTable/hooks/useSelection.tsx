import { RecordScope, RecursionField, useFieldSchema } from '@formily/react';
import { Divider, Space } from 'antd';
import React from 'react';
import { useQueryList$ } from '../../shared';
import { isSelectionComponent } from './utils';

export const useSelection = () => {
  const ctx = useQueryList$();
  const schema = useFieldSchema();

  const selectionsComsumer = schema.reduceProperties((selections, subSchema, key) => {
    if (isSelectionComponent(subSchema)) {
      selections.push(
        <RecordScope
          key={key}
          getRecord={() => {
            return {
              selectedRowKeys: ctx?._cofnig?._selectedRowKeys ?? [],
              selectedRows: ctx?._cofnig?._selectedRows ?? [],
            };
          }}
          getIndex={() => {
            return -1;
          }}
        >
          <Space split={<Divider type="vertical" />}>
            {subSchema.mapProperties((propSchema, propKey) => {
              return <RecursionField key={propKey} schema={propSchema} name={propKey} />;
            })}
          </Space>
        </RecordScope>,
      );
    }
    return selections;
  }, [] as any[]);
  return selectionsComsumer.length > 0 ? selectionsComsumer : null;
};
