import {
  ArrayTable,
  DatePicker,
  Editable,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Select,
  Space,
} from '@formily/antd';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import React from 'react';
import { createForm } from '@formily/core';
import { FormProvider, createSchemaField } from '@formily/react';
import {
  Dict,
  ImageView,
  LongText,
  PopActions,
  QueryForm,
  QueryList,
  QueryTable,
  dictEffects,
} from 'fireformily';
import { actions, loaders, onSort, service } from './shared';

const SchemaField = createSchemaField({
  components: {
    QueryList,
    QueryForm,
    FormItem,
    Input,
    Select,
    FormGrid,
    FormLayout,
    DatePicker,
    Editable,
    QueryTable,
    ArrayTable,
    PopActions,
    ImageView,
    Dict,
    LongText,
    Space,
  },
  scope: {
    service,
    onSort,
    actions,
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

const getEidtProperties = (): SchemaShape => {
  return {
    properties: {
      domain: {
        title: '域名',
        type: 'string',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      classify: {
        title: '分类',
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
      status: {
        title: '状态',
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-data': {
          dict: 'status',
        },
      },
      date: {
        title: '上线时间',
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'DatePicker',
      },
    },
  };
};

const query: SchemaShape = {
  type: 'object',
  'x-component': 'QueryForm',
  'x-decorator': 'FormLayout',
  'x-decorator-props': {
    layout: 'vertical',
  },
  properties: {
    domain: {
      title: '域名',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    classify: {
      title: '分类',
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
    status: {
      title: '状态',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-data': {
        dict: 'status',
      },
    },
    '[start, end]': {
      title: '日期区间',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 2,
      },
      'x-component': 'DatePicker.RangePicker',
    },
  },
};

const titlebar: SchemaShape = {
  title: '查询列表',
  type: 'void',
  'x-component': 'QueryTable.Titlebar',
  properties: {
    selection: {
      type: 'void',
      'x-component': 'QueryTable.Selection',
      properties: {
        batchExp: {
          type: 'object',
          title: '批量导出',
          'x-component': 'PopActions.Popover',
          'x-component-props': {
            actions: '{{actions.batch}}',
          },
        },
        batchDelete: {
          type: 'object',
          title: '批量删除',
          'x-component': 'PopActions.Popconfirm',
          'x-component-props': {
            actions: '{{actions.batch}}',
          },
        },
      },
    },
    popover: {
      title: '新增',
      type: 'object',
      'x-content': 'Popover content',
      'x-component': 'PopActions',
      'x-component-props': {
        actions: '{{actions.add}}',
        type: 'primary',
      },
      properties: getEidtProperties()?.properties,
    },
  },
};

const list: SchemaShape = {
  type: 'array',
  'x-decorator': 'FormItem',
  'x-component': 'QueryTable',
  'x-component-props': {
    scroll: { x: '100%' },
    onSort: `{{onSort}}`,
    expandable: {
      rowExpandable: (row: any) => {
        return row.subdomains.length > 0;
      },
    },
  },
  items: {
    type: 'object',
    properties: {
      sort: {
        type: 'void',
        'x-component': 'QueryTable.Column',
        'x-component-props': {
          width: 80,
          title: '排序',
          align: 'center',
        },
        properties: {
          sort: {
            type: 'void',
            'x-component': 'QueryTable.SortHandle',
          },
        },
      },
      index: {
        type: 'void',
        'x-component': 'QueryTable.Column',
        'x-component-props': {
          width: 80,
          title: '序号',
          align: 'center',
        },
        properties: {
          index: {
            type: 'void',
            'x-component': 'QueryTable.Index',
          },
        },
      },
      id: {
        type: 'void',
        'x-component': 'QueryTable.Column',
        'x-component-props': {
          title: 'ID',
          sorter: (a: any, b: any) => a.id - b.id,
        },
        properties: {
          id: {
            type: 'string',
            'x-read-pretty': true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
        },
      },
      status: {
        type: 'void',
        'x-component': 'QueryTable.Column',
        'x-component-props': {
          title: '状态',
        },
        properties: {
          status: {
            type: 'string',
            'x-read-pretty': true,
            'x-data': {
              dict: 'status',
            },
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              type: 'badge',
            },
          },
        },
      },
      domain: {
        type: 'void',
        'x-component': 'QueryTable.Column',
        'x-component-props': {
          title: '域名',
          filters: `{{$records ? $records.reduce((list, record) => {
              if (list.find(x => record.domain.includes(x.value))) return list;
              const parts = record.domain.split('.');
              list.push({ text: '.'+parts[parts.length - 1],  value: '.'+parts[parts.length - 1] });
              return list;
            }, []): []}}`,
          onFilter: (value: string, record: any) => record.domain.includes(value),
        },
        properties: {
          domain: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'LongText',
          },
        },
      },
      classify: {
        type: 'void',
        'x-component': 'QueryTable.Column',
        'x-component-props': {
          title: '类型标签',
        },
        properties: {
          classify: {
            type: 'array',
            'x-read-pretty': true,
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              type: 'tag',
              mode: 'multiple',
            },
            'x-data': {
              dict: 'classify',
            },
          },
        },
      },
      img: {
        type: 'void',
        'x-component': 'QueryTable.Column',
        'x-component-props': {
          title: '图片',
        },
        properties: {
          img: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'ImageView',
          },
        },
      },
      date: {
        type: 'void',
        'x-component': 'QueryTable.Column',
        'x-component-props': {
          title: '上线时间',
        },
        properties: {
          date: {
            type: 'string',
            'x-read-pretty': true,
            'x-decorator': 'FormItem',
            'x-component': 'DatePicker',
          },
        },
      },
      operations: {
        type: 'void',
        'x-component': 'QueryTable.Operations',
        'x-component-props': {
          title: '操作',
          width: '240px',
          fixed: 'right',
        },
        properties: {
          popconfirm: {
            title: '删除',
            type: 'object',
            'x-content': '确定要删除这一条记录吗?',
            'x-component': 'PopActions.Popconfirm',
            'x-component-props': {
              actions: '{{actions.remove}}',
            },
            properties: {},
          },
          drawer: {
            title: '编辑',
            type: 'object',
            'x-content': 'Drawer content',
            'x-component': 'PopActions.Drawer',
            'x-component-props': {
              actions: '{{actions.update}}',
            },
            properties: getEidtProperties()?.properties,
          },
        },
      },
    },
  },
  properties: {
    expandable: {
      type: 'void',
      'x-component': 'QueryTable.Expandable',
      properties: {
        subdomains: {
          type: 'void',
          'x-component': 'QueryList',
          properties: {
            titlebar: {
              type: 'void',
              title: '二级域名',
              'x-component': 'QueryTable.Titlebar',
              properties: {
                add: {
                  title: '新增',
                  type: 'object',
                  'x-content': 'Modal content',
                  'x-component': 'PopActions',
                  'x-component-props': {
                    actions: '{{actions.add}}',
                  },
                  properties: {
                    owner: {
                      title: 'Owner',
                      type: 'string',
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                    },
                    domain: {
                      title: '域名',
                      type: 'string',
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                    },
                  },
                },
              },
            },
            subdomains: {
              type: 'array',
              'x-component': 'QueryTable',
              items: {
                type: 'object',
                properties: {
                  owner: {
                    type: 'void',
                    'x-component': 'QueryTable.Column',
                    'x-component-props': {
                      title: 'Owner',
                    },
                    properties: {
                      owner: {
                        type: 'string',
                        'x-read-pretty': true,
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                      },
                    },
                  },
                  domain: {
                    type: 'void',
                    'x-component': 'QueryTable.Column',
                    'x-component-props': {
                      title: '域名',
                    },
                    properties: {
                      domain: {
                        type: 'string',
                        'x-read-pretty': true,
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                      },
                    },
                  },
                  operations: {
                    type: 'void',
                    'x-component': 'QueryTable.Operations',
                    'x-component-props': {
                      title: '操作',
                      width: '200px',
                    },
                    properties: {
                      popconfirm: {
                        title: '删除',
                        type: 'object',
                        'x-content': '确定要删除这一条记录吗?',
                        'x-component': 'PopActions.Popconfirm',
                        'x-component-props': {
                          actions: '{{actions.remove}}',
                        },
                        properties: {},
                      },
                      drawer: {
                        title: '编辑',
                        type: 'object',
                        'x-content': 'Drawer content',
                        'x-component': 'PopActions',
                        'x-component-props': {
                          actions: '{{actions.update}}',
                        },
                        properties: {
                          owner: {
                            type: 'string',
                            'x-decorator': 'FormItem',
                            'x-component': 'Input',
                          },
                          domain: {
                            type: 'string',
                            'x-decorator': 'FormItem',
                            'x-component': 'Input',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const schema: SchemaShape = {
  type: 'object',
  properties: {
    querylist: {
      type: 'void',
      'x-component': 'QueryList',
      'x-component-props': {
        size: 'small',
        service: '{{service}}',
      },
      properties: {
        query,
        titlebar,
        list,
      },
    },
  },
};

export const QueryListAll = () => {
  return (
    <div style={{ padding: '20px' }}>
      <ConfigProvider locale={zhCN}>
        <FormProvider form={form}>
          <SchemaField schema={schema} />
        </FormProvider>
      </ConfigProvider>
    </div>
  );
};

export default QueryListAll;
