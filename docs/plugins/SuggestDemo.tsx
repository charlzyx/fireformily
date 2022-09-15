import { FormGrid, FormItem, FormLayout } from '@formily/antd';
import { createForm } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import jsonp from 'fetch-jsonp';
import { registerSuggestion, suggestEffects, Suggestion } from 'fireformily';
import qs from 'qs';
import React from 'react';

const loaders = {
  taobao: () => {
    registerSuggestion('taobao', (params, convert) => {
      console.log('search params', params);
      const str = qs.stringify({
        code: 'utf-8',
        q: params.kw,
      });
      return jsonp(`https://suggest.taobao.com/sug?${str}`)
        .then((response: any) => response.json())
        .then((d: any) => {
          const { result } = d;
          const data: { label: string; value: string }[] = result.map(
            (item: any) => {
              return {
                value: item[0] as string,
                label: item[0] as string,
              };
            },
          );
          return convert(data, 'label', 'value');
        });
    });
  },
};

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
  scope: {},
});

const form = createForm({
  effects(fform) {
    suggestEffects(fform);
  },
});

loaders.taobao();

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
          'x-data': {
            suggest: 'taobao',
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
          },
          'x-data': {
            suggest: 'taobao',
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
          },
          'x-data': {
            suggest: 'taobao',
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
          },
          'x-data': {
            suggest: 'taobao',
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
  return (
    <FormProvider form={form}>
      <SchemaField schema={schema} />
    </FormProvider>
  );
};

export default SuggestDemo;
