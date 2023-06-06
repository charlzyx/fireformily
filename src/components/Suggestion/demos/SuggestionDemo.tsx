import { FormGrid, FormItem, FormLayout } from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { FormProvider, createSchemaField } from '@formily/react';
import { Suggestion } from 'fireformily';
import React, { useMemo } from 'react';
import { suggest } from './mock';

const Code = (props: { value: any }) => {
  return (
    <div>
      <pre>
        <code>{JSON.stringify(props.value, null, 2)}</code>
      </pre>
    </div>
  );
};

const SchemaField = createSchemaField({
  components: {
    FormGrid,
    FormLayout,
    FormItem,
    Suggestion,
    Code,
  },
  scope: {
    suggest,
  },
});

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
        maxColumns: 4,
        minColumns: 2,
      },
      properties: {
        s1: {
          title: '淘宝搜索',
          description: 'string',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Suggestion',
          'x-component-props': {
            suggest: '{{suggest}}',
          },
        },
        s2: {
          title: '淘宝搜索',
          description: 'labelInValue',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Suggestion',
          'x-component-props': {
            labelInValue: true,
            suggest: '{{suggest}}',
          },
        },
        s3: {
          title: '淘宝搜索',
          description: 'multiple',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Suggestion',
          'x-component-props': {
            multiple: true,
            suggest: '{{suggest}}',
          },
        },
        s4: {
          title: '淘宝搜索',
          description: 'multiple & labelInValue',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Suggestion',
          'x-component-props': {
            multiple: true,
            labelInValue: true,
            suggest: '{{suggest}}',
          },
        },
        code: {
          type: 'object',
          'x-component': 'Code',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            span: 4,
          },
          'x-reactions': {
            dependencies: ['.s1', '.s2', '.s3', '.s4'],
            fulfill: {
              schema: {
                'x-value': `{{{string: $deps[0], labelInValue: $deps[1], multiple: $deps[2],multipleAndLabelInValue: $deps[3]} }}`,
              },
            },
          },
        },
      },
    },
  },
};

const SuggestDemo = () => {
  const form = useMemo(() => {
    return createForm({
      effects(fform) {},
    });
  }, []);
  return (
    <FormProvider form={form}>
      <SchemaField schema={schema} />
    </FormProvider>
  );
};

export default SuggestDemo;
