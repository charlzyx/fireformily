import { FormGrid, FormLayout } from '@formily/antd';
import { Schema } from '@formily/json-schema';
import { Button } from 'antd';
import React, { JSXElementConstructor } from 'react';

export type Actions<Record = any, Data = Record> = {
  load?: (record: Record) => Promise<Data>;
  cancel?: (record: Record) => Promise<any>;
  submit?: (data: Data, record: Record) => Promise<Record>;
};

export type EmptyActions = {
  load: () => Promise<any>;
  cancel: () => Promise<any>;
  submit: () => Promise<any>;
};

export type TActionProps<
  Comp extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>,
  Record = any,
  Data = Record,
> = React.ComponentProps<Comp> & {
  index: number;
  record: Record;
  actions?: Actions<Record, Data>;
  layout?: React.ComponentProps<typeof FormLayout>;
  grid?: React.ComponentProps<typeof FormGrid>;
  cancelText?: string;
  okText?: string;
  content?: React.ReactNode;
  schema?: Schema;
  btn?: React.ComponentProps<typeof Button>;
};
