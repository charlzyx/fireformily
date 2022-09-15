import {
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Select,
  Space,
} from '@formily/antd';
import { createForm } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import { dict, Dict, dictEffects, registerDictLoader } from 'fireformily';
import React from 'react';

const loaders = {
  bool: () => {
    registerDictLoader('bool', (convert) => {
      return Promise.resolve([
        { label: '是', value: 1, color: 'success' },
        { label: '否', value: 0, color: 'error' },
      ]).then((list) => {
        return convert(list);
      });
    });
  },
  status: () => {
    registerDictLoader('status', (convert) => {
      return Promise.resolve([
        { label: '已上线', value: 0, color: 'success' },
        { label: '运行中', value: 1, color: 'processing' },
        { label: '关闭', value: 2, color: 'default' },
        { label: '已宕机', value: 3, color: 'error' },
        { label: '已超载', value: 4, color: 'warning' },
      ]).then((list) => {
        return convert(list);
      });
    });
  },
  classify: () => {
    registerDictLoader('classify', (convert) => {
      return Promise.resolve([
        { label: '文艺', value: 0 },
        { label: '喜剧', value: 1 },
        { label: '爱情', value: 2 },
        { label: '动画', value: 3 },
        { label: '悬疑', value: 4 },
        { label: '科幻', value: 5 },
      ]).then((list) => {
        return convert(list);
      });
    });
  },
};

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    Select,
    FormGrid,
    FormLayout,
    Dict,
    Space,
  },
  scope: {
    dict,
  },
});

const form = createForm({
  effects(fform) {
    dictEffects(fform);
  },
});

loaders.bool();
loaders.status();
loaders.classify();

type SchemaShape = React.ComponentProps<typeof SchemaField>['schema'];

const schema: SchemaShape = {
  type: 'object',
  properties: {
    layout: {
      type: 'void',
      'x-decorator': 'FormLayout',
      'x-decorator-props': {
        layout: 'vertical',
      },
      'x-component': 'FormGrid',
      'x-component-props': {
        maxColumns: 3,
        minColumns: 2,
      },
      properties: {
        classify: {
          title: 'SELECT MULTIPLE',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            mode: 'multiple',
          },
          'x-data': {
            dict: 'classify',
          },
        },
        selectReadonly: {
          title: 'SELECT MULTIPLE READONLY',
          type: 'string',
          'x-read-pretty': true,
          'x-reactions': {
            dependencies: ['.classify'],
            fulfill: {
              schema: {
                'x-value': '{{$deps[0]}}',
              },
            },
          },
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            type: 'badge',
          },
          'x-data': {
            dict: 'classify',
          },
        },
        classifyReadonly: {
          title: 'DICT TAG READONLY',
          type: 'string',
          'x-reactions': {
            dependencies: ['.classify'],
            fulfill: {
              schema: {
                'x-value': '{{$deps[0]}}',
              },
            },
          },
          'x-decorator': 'FormItem',
          'x-component': 'Dict',
          'x-component-props': {
            type: 'tag',
          },
          'x-data': {
            dict: 'classify',
          },
        },
        status: {
          title: 'SELECT',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-data': {
            dict: 'status',
          },
        },
        statusSelectReadonly: {
          title: 'SELECT READ PRETTY',
          type: 'string',
          'x-read-pretty': true,
          'x-reactions': {
            dependencies: ['.status'],
            fulfill: {
              schema: {
                'x-value': '{{$deps[0]}}',
              },
            },
          },
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            type: 'tag',
          },
          'x-data': {
            dict: 'status',
          },
        },
        statusReadonly: {
          title: 'DICT BADGE READ PRETTY',
          type: 'string',
          'x-reactions': {
            dependencies: ['.status'],
            fulfill: {
              schema: {
                'x-value': '{{$deps[0]}}',
              },
            },
          },
          'x-decorator': 'FormItem',
          'x-component': 'Dict',
          'x-component-props': {
            type: 'badge',
          },
          'x-data': {
            dict: 'status',
          },
        },
      },
    },
  },
};

const DictDemo = () => {
  return (
    <FormProvider form={form}>
      <SchemaField schema={schema} />
    </FormProvider>
  );
};

export default DictDemo;
