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

import { useMemo, useState } from 'react';
import { actions, loadData } from './mock';

const form = createForm();

const Debug = (props: { value: any }) => {
  const [posInput, setPosInput] = useState('');
  const pos = useMemo(() => {
    return posInput
      .split('-')
      .filter((x) => x != '')
      .map(Number)
      .filter((n) => !Number.isNaN(n));
  }, [posInput]);
  const node = TreeBase.usePosNode?.(pos);
  return (
    <div>
      <div>Input Node Pos</div>
      <Input
        placeholder="例如: 2-0-1"
        value={posInput}
        onChange={(e) => setPosInput(e.target.value)}
      ></Input>
      <Button
        type={node && pos.length > 0 ? 'primary' : 'dashed'}
        onClick={() => {
          if (!node) {
            console.log('---not found node by pos', pos);
            return;
          }
          console.groupCollapsed('点击查看 node scope');
          console.group('---node.$pos');
          console.log(safeStringify(node.$pos));
          console.groupEnd();

          console.group('---node.$record');
          console.log(safeStringify(node.$record));
          console.groupEnd();

          console.group('---node.$index');
          console.log(safeStringify(node.$index));
          console.groupEnd();

          console.group('---node.$records');
          console.log(safeStringify(node.$records));
          console.groupEnd();

          console.group('---node.$extra');
          console.log(safeStringify(node.$extra));
          console.groupEnd();

          console.group('---node.$root');
          console.log(safeStringify(node.$root));
          console.groupEnd();
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
        console.groupCollapsed('点击查看 scope');

        console.group('---scope.$pos');
        console.log(safeStringify(scope.$pos));
        console.groupEnd();

        console.group('---scope.$record');
        console.log(safeStringify(scope.$record));
        console.groupEnd();

        console.group('---scope.$index');
        console.log(safeStringify(scope.$index));
        console.groupEnd();

        console.group('---scope.$records');
        console.log(safeStringify(scope.$records));
        console.groupEnd();

        console.group('---scope.$extra');
        console.log(safeStringify(scope.$extra));
        console.groupEnd();

        console.group('---scope.$root');
        console.log(safeStringify(scope.$root));
        console.groupEnd();
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
            checkable: true,
            selectable: true,
            draggable: true,
            layout: {
              align: 'top',
            },
          },
          items: {
            type: 'object',
            properties: {
              // _header: {
              //   type: "void",
              //   "x-visible": "{{$index === 0}}",
              //   "x-component-props": "{{{count: $records && $records.length}}}",
              //   "x-component": "NodeHeader",
              // },
              pos: {
                type: 'void',
                'x-component': 'TreeNodes.Pos',
              },
              label: {
                type: 'string',
                // "x-decorator": "FormItem",
                'x-component': 'Input',
                'x-component-props': {
                  size: 'small',
                  style: {
                    width: '140px',
                  },
                },
              },
              moveup: {
                type: 'void',
                'x-component': 'TreeNodes.Move',
                'x-component-props': {
                  to: 'up',
                },
              },
              movedown: {
                type: 'void',
                'x-component': 'TreeNodes.Move',
                'x-component-props': {
                  to: 'down',
                },
              },
              remove: {
                type: 'void',
                'x-component': 'TreeNodes.Remove',
              },
              copy: {
                type: 'void',
                'x-component': 'TreeNodes.Copy',
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
                'x-component': 'TreeNodes.Append',
                'x-component-props': {
                  factory: (parent: any) => {
                    return {
                      label: `${parent.label}之 ${
                        parent.children?.length ?? 0
                      } 子`,
                      value: `${parent.value}${parent.children?.length ?? 0}`,
                    };
                  },
                },
              },
              edit: {
                title: '编辑',
                type: 'object',
                'x-component': 'PopActions',
                'x-component-props': {
                  actions: '{{actions.update}}',
                },
                "x-reactions": {
                  fulfill: {
                    schema: {
                      "x-visible": "{{$record !== $lookup}}"
                    }
                  }
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
