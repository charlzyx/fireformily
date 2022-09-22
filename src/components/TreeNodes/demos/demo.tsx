import { FormItem, Space, Input } from '@formily/antd';
import { createForm } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import { PopActions, safeStringify, TreeBase, TreeNodes } from 'fireformily';

import { actions, loadData } from './mock';

const form = createForm();

const Code = (props: { value: any }) => {
  return (
    <details>
      <summary>value of TreeNodes</summary>
      <div>
        <pre>{safeStringify(props.value)}</pre>
      </div>
    </details>
  );
};
const SchemaField = createSchemaField({
  components: {
    TreeNodes,
    Space,
    PopActions,
    TreeBase,
    Code,
    Input,
    FormItem,
  },
  scope: {
    loadData,
    actions,
  },
});

const schema: React.ComponentProps<typeof SchemaField>['schema'] = {
  type: 'object',
  properties: {
    layout: {
      type: 'void',
      'x-component': 'Space',
      'x-component-props': {
        style: {
          display: 'flex',
          alignItems: 'flex-start',
        },
      },
      properties: {
        tree: {
          type: 'object',
          'x-decorator': 'FormItem',
          'x-component': 'TreeNodes',
          'x-component-props': {
            loadData: '{{loadData}}',
          },
          properties: {
            label: {
              type: 'string',
              'x-read-pretty': true,
              // 'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            moveup: {
              type: 'void',
              'x-component': 'TreeBase.Move',
              'x-component-props': {
                to: 'up',
              },
            },
            movedown: {
              type: 'void',
              'x-component': 'TreeBase.Move',
              'x-component-props': {
                to: 'down',
              },
            },
            edit: {
              title: '编辑',
              type: 'object',
              'x-component': 'PopActions',
              'x-component-props': {
                actions: '{{actions.update}}',
              },
              properties: {
                label: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                },
                value: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                },
              },
            },

            // value: {
            //   type: 'string',
            //   'x-decorator': 'FormItem',
            //   'x-component': 'Input',
            // },
          },
        },
        code: {
          type: 'object',
          'x-component': 'Code',
          'x-reactions': {
            dependencies: ['.tree'],
            fulfill: {
              schema: {
                'x-value': '{{$deps[0]}}',
              },
            },
          },
        },
      },
    },
  },
};

const TreeNodesDemo = () => {
  return (
    <FormProvider form={form}>
      <SchemaField schema={schema}></SchemaField>
    </FormProvider>
  );
};

export default TreeNodesDemo;
