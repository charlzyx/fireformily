import { ArrayBase as AntdArrayBase } from '@formily/antd';
import { ArrayField } from '@formily/core';
import { RecursionField, useField, useFieldSchema } from '@formily/react';
import { Table } from 'antd';
import React, { useMemo } from 'react';

import { isExpandComponent } from './shared';

const ArrayBase = AntdArrayBase as Required<typeof AntdArrayBase>;

type TExpandable = React.ComponentProps<typeof Table>['expandable'];

export const useExpandable = (
  props?: Omit<TExpandable, 'expandedRowRender'>,
) => {
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
      expandedRowRender: (record, index, indent, expanded) => {
        console.log('renwer', expandSchema);
        return (
          <ArrayBase.Item
            index={index}
            record={() => arrayField?.value?.[index]}
          >
            <RecursionField
              schema={expandSchema}
              name={index}
              onlyRenderProperties
            />
          </ArrayBase.Item>
        );
      },
      ...props,
    };
  }, [arrayField?.value, expandSchema, props]);

  return expandable;
};
