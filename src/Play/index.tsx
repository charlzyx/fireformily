import {
  ArrayTable,
  DatePicker,
  Editable,
  FormItem,
  Input,
  Select,
  Space,
} from '@formily/antd';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import React from 'react';

import { createForm } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import { PopActions } from '../PopActions';
import { QueryForm, QueryList, QueryTable } from '../QueryList';

const SchemaField = createSchemaField({
  components: {
    QueryList,
    QueryForm,
    FormItem,
    Input,
    Select,
    DatePicker,
    Editable,
    QueryTable,
    ArrayTable,
    PopActions,
    Space,
  },
});

const form = createForm();

const service = ({ pagination, query, ...others }: any) => {
  console.log('request', { query, pagination, others });
  const { pageSize, current } = pagination;
  const { q1, q2 } = query;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        total: 44,
        list: Array.from({
          length: current * pageSize < 44 ? pageSize : 44 % pageSize,
        })
          .map((_, idx) => {
            return {
              name: `[${q1 || 'q1'}]${idx}...${current}`,
              id: idx + current * pageSize,
              ex: [
                {
                  name: `ex [${q1 || 'q1'}]${idx}...${current}`,
                  id: `ex [${q2 || 'q2'}]${idx}...${current}`,
                },
              ],
            };
          })
          .filter(Boolean),
      });
    }, 200);
  });
};

const batch = {
  load: (record: any, ...others: any[]) => {
    console.log('load ...args', { record, others });
    return Promise.resolve(record);
  },
  cancel: (...args: any[]) => {
    console.log('cancel ...args', args);
    return Promise.resolve();
  },
  submit: (data: any, record: any, ...others: any) => {
    console.log('submit ...args', { data, record, others });
    return Promise.resolve();
  },
};
const actions = {
  load: (record: any, ...others: any[]) => {
    console.log('load ...args', { record, others });
    return Promise.resolve(record);
  },
  cancel: (...args: any[]) => {
    console.log('cancel ...args', args);
    return Promise.resolve();
  },
  submit: (data: any, record: any, ...others: any) => {
    console.log('submit ...args', { data, record, others });
    return Promise.resolve();
  },
};

const schema: React.ComponentProps<typeof SchemaField>['schema'] = {
  type: 'object',
  properties: {
    querylist: {
      type: 'void',
      'x-component': 'QueryList',
      'x-component-props': {
        service: service,
      },
      properties: {
        query: {
          type: 'object',
          'x-component': 'QueryForm',
          properties: {
            q1: {
              title: 'q1',
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
          },
        },
        titlebar: {
          title: '新增',
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
                    actions: batch,
                  },
                },
                batchDelete: {
                  type: 'object',
                  title: '批量删除',
                  'x-component': 'PopActions.Popconfirm',
                  'x-component-props': {
                    actions: batch,
                  },
                },
              },
            },
            popover: {
              title: 'Popover 新增',
              type: 'object',
              'x-content': 'Popover content',
              'x-component': 'PopActions.Popover',
              'x-component-props': {
                actions: actions,
              },
              properties: {
                name: {
                  title: 'name',
                  type: 'string',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                },
                id: {
                  title: 'id',
                  type: 'string',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                },
              },
            },
            popconfirm: {
              title: 'Popconfirm 新增',
              type: 'object',
              'x-content': 'Popconfirm content',
              'x-component': 'PopActions.Popconfirm',
              'x-component-props': {
                actions: actions,
                btn: {
                  size: 'default',
                },
              },
              properties: {
                name: {
                  title: 'name',
                  type: 'string',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                },
                id: {
                  title: 'id',
                  type: 'string',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                },
              },
            },
            modal: {
              title: 'Modal 新增',
              type: 'object',
              'x-content': 'Modal content',
              'x-component': 'PopActions.Modal',
              'x-component-props': {
                actions: actions,
              },
              properties: {
                name: {
                  title: 'name',
                  type: 'string',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                },
                id: {
                  title: 'id',
                  type: 'string',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                },
              },
            },
            drawer: {
              title: 'Drawer 新增',
              type: 'object',
              'x-content': 'Drawer content',
              'x-component': 'PopActions.Drawer',
              'x-component-props': {
                actions: actions,
                btn: {
                  type: 'primary',
                },
              },
              properties: {
                name: {
                  title: 'name',
                  type: 'string',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                },
                id: {
                  title: 'id',
                  type: 'string',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                },
              },
            },
          },
        },
        list: {
          type: 'array',
          'x-decorator': 'FormItem',
          'x-component': 'QueryTable',
          'x-component-props': {
            scroll: { x: '100%' },
            rowSelection: true,
          },
          items: {
            type: 'object',
            properties: {
              column1: {
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
              column2: {
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

              column4: {
                type: 'void',
                'x-component': 'QueryTable.Column',
                'x-component-props': {
                  width: 200,
                  title: '姓名',
                },
                properties: {
                  name: {
                    type: 'string',
                    'x-read-pretty': true,
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                  },
                },
              },
              column3: {
                type: 'void',
                'x-component': 'QueryTable.Column',
                'x-component-props': {
                  width: 200,
                  title: 'ID',
                  sorter: true,
                  filters: `{{$records ? $records.map(record => {
                    return { text: record.id, value: record.id }
                  }): []}}`,
                  onFilter: (value: string, record: any) => record.id !== value,
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
              column5: {
                type: 'void',
                'x-component': 'QueryTable.Operations',
                'x-component-props': {
                  title: '操作',
                  fixed: 'right',
                },
                properties: {
                  popover: {
                    title: 'Popover',
                    type: 'object',
                    'x-content': 'Popover content',
                    'x-component': 'PopActions.Popover',
                    'x-component-props': {
                      actions: actions,
                    },
                    properties: {
                      name: {
                        title: 'name',
                        type: 'string',
                        required: true,
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                      },
                      id: {
                        title: 'id',
                        type: 'string',
                        required: true,
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                      },
                    },
                  },
                  popconfirm: {
                    title: 'Popconfirm',
                    type: 'object',
                    'x-content': 'Popconfirm content',
                    'x-component': 'PopActions.Popconfirm',
                    'x-component-props': {
                      actions: actions,
                    },
                    properties: {
                      name: {
                        title: 'name',
                        type: 'string',
                        required: true,
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                      },
                      id: {
                        title: 'id',
                        type: 'string',
                        required: true,
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                      },
                    },
                  },
                  modal: {
                    title: 'Modal 编辑',
                    type: 'object',
                    'x-content': 'Modal content',
                    'x-component': 'PopActions.Modal',
                    'x-component-props': {
                      actions: actions,
                    },
                    properties: {
                      name: {
                        title: 'name',
                        type: 'string',
                        required: true,
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                      },
                      id: {
                        title: 'id',
                        type: 'string',
                        required: true,
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                      },
                    },
                  },
                  drawer: {
                    title: 'Drawer 编辑',
                    type: 'object',
                    'x-content': 'Drawer content',
                    'x-component': 'PopActions.Drawer',
                    'x-component-props': {
                      actions: actions,
                    },
                    properties: {
                      name: {
                        title: 'name',
                        type: 'string',
                        required: true,
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                      },
                      id: {
                        title: 'id',
                        type: 'string',
                        required: true,
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                      },
                    },
                  },
                },
              },
              // column6: {
              //   type: 'void',
              //   'x-component': 'QueryTable.Column',
              //   'x-component-props': {
              //     title: 'Operations',
              //     width: 200,
              //     fixed: 'right',
              //   },
              //   properties: {
              //     item: {
              //       type: 'void',
              //       'x-component': 'FormItem',
              //       properties: {
              //         remove: {
              //           type: 'void',
              //           'x-component': 'QueryTable.Remove',
              //         },
              //         moveDown: {
              //           type: 'void',
              //           'x-component': 'QueryTable.MoveDown',
              //         },
              //         moveUp: {
              //           type: 'void',
              //           'x-component': 'QueryTable.MoveUp',
              //         },
              //       },
              //     },
              //   },
              // },
            },
          },
          properties: {
            // add: {
            //   type: 'void',
            //   'x-component': 'QueryTable.Addition',
            //   title: '添加条目',
            // },
            expand: {
              type: 'void',
              'x-component': 'QueryTable.Expand',
              properties: {
                subitems: {
                  type: 'void',
                  'x-component': 'QueryList',
                  properties: {
                    ex: {
                      type: 'array',
                      'x-decorator': 'FormItem',
                      'x-component': 'QueryTable',
                      'x-component-props': {
                        scroll: { x: '100%' },
                      },
                      items: {
                        type: 'object',
                        properties: {
                          column1: {
                            type: 'void',
                            'x-component': 'QueryTable.Column',
                            'x-component-props': { width: 200, title: 'EXID' },
                            properties: {
                              id: {
                                type: 'string',
                                'x-decorator': 'FormItem',
                                'x-component': 'Input',
                              },
                            },
                          },
                          column2: {
                            type: 'void',
                            'x-component': 'QueryTable.Column',
                            'x-component-props': {
                              width: 200,
                              title: 'EXNAME',
                            },
                            properties: {
                              name: {
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
    },
  },
};

export const Guide = () => {
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

export default Guide;
