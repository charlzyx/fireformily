import React from 'react';
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

import { createForm } from '@formily/core';
import { FormProvider, createSchemaField } from '@formily/react';
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
    Space,
  },
});

const form = createForm();

const service = ({ current, pageSize, q1, q2, ...others }: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        total: 44,
        data: Array.from({
          length: current * pageSize < 44 ? pageSize : 44 % pageSize,
        })
          .map((_, idx) => {
            return {
              name: `[${q1 || 'q1'}]${idx}...${current}`,
              id: `[${q2 || 'q2'}]${idx}...${current}`,
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

const actions = {
  load: (record: any) => {
    return Promise.resolve(record);
  },
  cancel: () => {
    return Promise.resolve();
  },
  submit: (data: any, record: any) => {
    const neoRecord = {
      ...record,
      name: data.name,
      id: data.id,
    };
    // return Promise.resolve(neoRecord);
    return Promise.resolve();
  },
};

const schema: React.ComponentProps<typeof SchemaField>['schema'] = {
  type: 'object',
  properties: {
    querylist: {
      type: 'object',
      'x-component': 'QueryList',
      'x-component-props': {
        service: service,
      },
      properties: {
        query: {
          type: 'object',
          'x-component': 'QueryForm',
          'x-component-props': {
            grid: {
              maxRows: 2,
              maxColumns: 3,
            },
          },
          properties: {
            q1: {
              title: 'q1',
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            q2: {
              title: 'q2',
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            select1: {
              title: 'select1',
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Select',
            },
            select2: {
              title: 'select2',
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Select',
            },
            '[startTime, endTime]': {
              title: '时间',
              type: 'string',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                gridSpan: 2,
              },
              'x-component': 'DatePicker.RangePicker',
            },
            input5: {
              title: 'input5',
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            input6: {
              title: 'input6',
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            // q7: {
            //   title: 'q7',
            //   type: 'string',
            //   'x-decorator': 'FormItem',
            //   'x-component': 'Input',
            // },
          },
        },
        toolbar: {
          title: '新增',
          type: 'object',
          'x-component': 'QueryTable.Toolbar',
          properties: {
            popover: {
              title: 'Popover 新增',
              type: 'object',
              'x-content': 'Popover content',
              'x-component': 'QueryTable.Action.Popover',
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
              'x-component': 'QueryTable.Action.Popconfirm',
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
              'x-component': 'QueryTable.Action.Modal',
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
              'x-component': 'QueryTable.Action.Drawer',
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
            selectable: true,
          },
          items: {
            type: 'object',
            properties: {
              expand: {
                type: 'void',
                'x-component': 'QueryTable.Expand',
                properties: {
                  ex: {
                    type: 'array',
                    'x-decorator': 'FormItem',
                    'x-component': 'ArrayTable',
                    'x-component-props': {
                      scroll: { x: '100%' },
                    },
                    items: {
                      type: 'object',
                      properties: {
                        column1: {
                          type: 'void',
                          'x-component': 'ArrayTable.Column',
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
                          'x-component-props': { width: 200, title: 'EXNAME' },
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
              // column1: {
              //   type: 'void',
              //   'x-component': 'QueryTable.Column',
              //   'x-component-props': {
              //     width: 50,
              //     title: 'Sort',
              //     align: 'center',
              //   },
              //   properties: {
              //     sort: {
              //       type: 'void',
              //       'x-component': 'QueryTable.SortHandle',
              //     },
              //   },
              // },
              column2: {
                type: 'void',
                'x-component': 'QueryTable.Column',
                'x-component-props': {
                  width: 80,
                  title: 'Index',
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
                'x-component-props': { width: 200, title: 'NAME' },
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
                'x-component-props': { width: 200, title: 'ID' },
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
                'x-component': 'QueryTable.Column',
                'x-component-props': {
                  title: '操作',
                  type: 'actions',
                  maxItems: 2,
                  width: 260,
                  fixed: 'right',
                },
                properties: {
                  popover: {
                    title: 'Popover',
                    type: 'object',
                    'x-content': 'Popover content',
                    'x-component': 'QueryTable.Action.Popover',
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
                    'x-component': 'QueryTable.Action.Popconfirm',
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
                    'x-component': 'QueryTable.Action.Modal',
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
                    'x-component': 'QueryTable.Action.Drawer',
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
