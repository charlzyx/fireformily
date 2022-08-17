import { ArrayBase as AntdArrayBase } from '@formily/antd';
import { RecursionField, useField, useFieldSchema } from '@formily/react';
import { TableProps } from 'antd/lib/table';
import { Schema } from '@formily/json-schema';
import React from 'react';
import { isExpandComponent } from '../shared';

const ArrayBase = AntdArrayBase as Required<typeof AntdArrayBase>;

export const findExpandComponent = (schema: Schema): Schema | undefined => {
  if (isExpandComponent(schema)) {
    return schema as Schema;
  }
  if (schema.properties) {
    const trytry = schema.reduceProperties((buf, propSchame) => {
      if (buf) return buf;
      const maybe = findExpandComponent(propSchame);
      return maybe;
    });
    if (trytry) return trytry as Schema;
  }

  if (schema.items) {
    const trytry = (schema.items as Schema).reduceProperties(
      (buf, propSchame) => {
        if (buf) return buf;
        const maybe = findExpandComponent(propSchame);
        return maybe;
      },
    );
    if (trytry) return trytry as Schema;
  }
};

export const useTableExpandable = (
  expandable?: TableProps<any>['expandable'],
) => {
  const arrayField = useField();
  const schema = useFieldSchema();

  const expendSchema = findExpandComponent(schema);

  const config: TableProps<any>['expandable'] = {
    expandedRowRender: (record, index, indent, expaned) => {
      return expendSchema ? (
        <ArrayBase.Item
          index={index}
          record={() => (arrayField as any)?.value?.[index]}
        >
          <RecursionField
            schema={expendSchema}
            name={index}
            onlyRenderProperties
          />
        </ArrayBase.Item>
      ) : null;
    },
    ...expandable,
  };

  return expendSchema ? config : undefined;
};
