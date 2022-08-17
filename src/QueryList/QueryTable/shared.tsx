/* eslint-disable no-shadow */
import { ArrayBaseMixins } from '@formily/antd';
import { FieldDisplayTypes, GeneralField } from '@formily/core';
import { Schema } from '@formily/json-schema';
import { Drawer, Modal, Popconfirm, Popover } from 'antd';
import { ColumnProps, TableProps } from 'antd/lib/table';
import React from 'react';
import { TActionProps } from '../RecordActions/shared';

export interface ObservableColumnSource {
  field: GeneralField;
  columnProps: ColumnProps<any>;
  schema: Schema;
  display: FieldDisplayTypes;
  name: string;
}

export type ComposedQueryTable = React.FC<
  React.PropsWithChildren<
    TableProps<any> & {
      selectable?: boolean;
    }
  >
> &
  ArrayBaseMixins & {
    Column?: React.FC<React.PropsWithChildren<ColumnProps<any>>>;
    Expand?: React.FC<React.PropsWithChildren<{}>>;
    Toolbar?: React.FC<React.PropsWithChildren<{}>>;
    Actions?: React.FC<React.PropsWithChildren<ColumnProps<any>>>;
    Action?: {
      Popover: React.FC<React.PropsWithChildren<TActionProps<typeof Popover>>>;
      Popconfirm: React.FC<
        React.PropsWithChildren<TActionProps<typeof Popconfirm>>
      >;
      Modal: React.FC<React.PropsWithChildren<TActionProps<typeof Modal>>>;
      Drawer: React.FC<React.PropsWithChildren<TActionProps<typeof Drawer>>>;
    };
  };

export const isColumnComponent = (schema: Schema) => {
  return schema['x-component']?.indexOf('Column') > -1;
};

export const hasSortable = (schema: Schema): Schema | undefined => {
  const canMap = (schema.items || (schema as any)) as Schema;
  return canMap.reduceProperties((sortable, propSchema) => {
    if (sortable) return sortable;
    if (propSchema['x-component']?.indexOf('SortHandle') > -1) {
      return propSchema;
    } else if (propSchema.properties || propSchema.items) {
      return hasSortable(propSchema);
    }
    return sortable as any;
  });
};

export const isActionsColumnComponent = (schema: Schema) => {
  return schema['x-component']?.indexOf('Actions') > -1;
};

export const isExpandComponent = (schema: Schema) => {
  return (
    schema['x-component']?.indexOf('Expand') > -1 ||
    schema['x-decorator']?.indexOf('Expand') > -1
  );
};

export const isOperationsComponent = (schema: Schema) => {
  return schema['x-component']?.indexOf('Operations') > -1;
};

export const isAdditionComponent = (schema: Schema) => {
  return schema['x-component']?.indexOf('Addition') > -1;
};

export const isToolbarComponent = (schema: Schema) => {
  return schema['x-component']?.indexOf('Toolbar') > -1;
};
