import { ArrayBase as AntdArrayBase } from '@formily/antd-v5';
import type { ArrayField } from '@formily/core';
import { RecursionField, useField, useFieldSchema } from '@formily/react';
import type { Table } from 'antd';
import React, { useMemo } from 'react';

import { isExpandComponent } from './utils';

const ArrayBase = AntdArrayBase as Required<typeof AntdArrayBase>;

type TExpandable = React.ComponentProps<typeof Table>['expandable'];

export const useExpandable = (props?: Omit<TExpandable, 'expandedRowRender'>) => {
  const arrayField = useField<ArrayField>();
  const arraySchema = useFieldSchema();
  const expandSchema = arraySchema.reduceProperties((addition, schema, key) => {
    if (isExpandComponent(schema)) {
      return schema;
    }
    return addition;
  }, null);

  const expandable: TExpandable = useMemo(() => {
    if (!expandSchema) return undefined;
    return {
      ...props,
      expandedRowRender: (record, index, indent, expanded) => {
        return (
          <ArrayBase.Item
            // 就硬刷新
            key={expanded ? `expand-${new Date()}` : `hidden-${index}`}
            index={index}
            record={() => arrayField?.value?.[index]}
          >
            <RecursionField schema={expandSchema} name={index} onlyRenderProperties />
          </ArrayBase.Item>
        );
      },
    };
  }, [arrayField?.value, expandSchema, props]);

  return expandable;
};
