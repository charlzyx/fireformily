import { RobotOutlined } from '@ant-design/icons';
import { FormItem, Input, Space } from '@formily/antd';
import { createForm } from '@formily/core';
import {
  createSchemaField,
  FormProvider,
  useExpressionScope,
} from '@formily/react';
import { Button } from 'antd';
import { PopActions, safeStringify, TreeBase, TreeNodes } from 'fireformily';

import { useState } from 'react';
import { actions, loadData } from './mock';

const form = createForm();

const Debug = (props: { value: any }) => {
  const [pos, setPos] = useState('');
  const node = TreeBase.useNodeScope?.(pos.split('-').map(Number));
  return (
    <div>
      <div>Input Node Pos</div>
      <Input
        placeholder="例如: 2-0-1"
        value={pos}
        onChange={(e) => setPos(e.target.value)}
      ></Input>
      <Button
        onClick={() => {
          console.log('node scope', safeStringify(node));
        }}
      >
        LOOK NODE SCOPE
      </Button>
    </div>
  );
};

const ScopeLogger = () => {
  const scope = useExpressionScope();
  return (
    <RobotOutlined
      onClick={() => {
        console.log('---scope.$pos', safeStringify(scope.$pos));
        console.log('---scope.$index', safeStringify(scope.$index));
        console.log(
          '---scope.$records.length',
          safeStringify(scope.$records.length),
        );
        console.log('---scope.$record', safeStringify(scope.$record));
        // console.log(safeStringify(scope));
      }}
    />
  );
};

const NodeHeader = (props: { count: number }) => {
  return <div>{`共有 ${props.count} 个下级`}</div>;
};

const NodeFooter = (props: any) => {
  const scope = useExpressionScope();

  return (
    <div style={{ margin: '8px 0' }}>
      <hr />
      SHOULD BE FOOTER
      <Button
        size="small"
        onClick={() => {
          return scope.$lookup.children.push({
            value: scope.$pos.join('+'),
            label: 'neo',
          });
        }}
        // icon={<FileAddOutlined></FileAddOutlined>}
        type="primary"
      >
        index: {scope.$index} | length: {scope.$records.length} | pos:{' '}
        {scope.$pos.join(',')}
        {props.hidden ? 'true' : 'false'}
      </Button>
    </div>
  );
};

const SchemaField = createSchemaField({
  components: {
    TreeNodes,
    Space,
    PopActions,
    TreeBase,
    NodeHeader,
    NodeFooter,
    Debug,
    ScopeLogger,
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
          justifyContent: 'space-between',
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
          items: {
            type: 'void',
            properties: {
              // _header: {
              //   type: "void",
              //   "x-visible": "{{$index === 0}}",
              //   "x-component-props": "{{{count: $records && $records.length}}}",
              //   "x-component": "NodeHeader",
              // },
              pos: {
                type: 'void',
                'x-component': 'TreeBase.Pos',
              },
              label: {
                type: 'string',
                // "x-decorator": "FormItem",
                // "x-read-pretty": true,
                'x-component': 'Input',
                'x-component-props': {
                  style: {
                    width: '200px',
                  },
                },
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
              remove: {
                type: 'void',
                'x-component': 'TreeBase.Remove',
              },
              copy: {
                type: 'void',
                'x-component': 'TreeBase.Copy',
                'x-component-props': {
                  clone: (old: any) =>
                    JSON.parse(
                      JSON.stringify(old, (k, v) => {
                        if (k === 'value') {
                          return `clone_${v}`;
                        } else {
                          return v;
                        }
                      }),
                    ),
                },
              },
              add: {
                type: 'void',
                'x-component': 'TreeBase.Addition',
                'x-component-props': {
                  factory: (parent: any) => {
                    return {
                      label: `${parent.label}之 ${parent.children.length} 子`,
                      value: `${parent.value}${parent.children.length}`,
                    };
                  },
                },
              },
              // edit: {
              //   title: "编辑",
              //   type: "object",
              //   "x-component": "PopActions",
              //   "x-component-props": {
              //     actions: "{{actions.update}}",
              //   },
              //   properties: {
              //     label: {
              //       type: "string",
              //       "x-decorator": "FormItem",
              //       "x-component": "Input",
              //     },
              //     value: {
              //       type: "string",
              //       "x-decorator": "FormItem",
              //       "x-component": "Input",
              //     },
              //   },
              // },
              scopelog: {
                type: 'void',
                'x-component': 'ScopeLogger',
              },
              // _footer: {
              //   type: "void",
              //   "x-hidden": "{{!$last}}",
              //   "x-component": "NodeFooter",
              // },
            },
          },

          properties: {
            code: {
              type: 'object',
              'x-component': 'Debug',
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
