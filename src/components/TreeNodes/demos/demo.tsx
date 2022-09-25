import { FormItem, Space, Input } from "@formily/antd";
import { createForm } from "@formily/core";
import {
  createSchemaField,
  FormProvider,
  observer,
  useExpressionScope,
} from "@formily/react";
import { PopActions, safeStringify, TreeBase, TreeNodes } from "fireformily";
import { FileAddOutlined, RobotOutlined } from "@ant-design/icons";
import { Button, Alert } from "antd";

import { actions, loadData } from "./mock";

const form = createForm();

const Code = (props: { value: any }) => {
  return (
    <div>NOTHING HERE</div>
    // <details>
    //   {/* <summary>value of TreeNodes</summary> */}
    //   <div>{/* <pre>{safeStringify(props.value)}</pre> */}</div>
    // </details>
  );
};

const ScopeLogger = () => {
  const scope = useExpressionScope();
  return (
    <RobotOutlined
      onClick={() => {
        console.log("---scope.$pos", safeStringify(scope.$pos));
        console.log("---scope.$index", safeStringify(scope.$index));
        console.log("---scope.$records.length", safeStringify(scope.$records.length));
        console.log("---scope.$record", safeStringify(scope.$record));
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
    <div style={{ margin: '8px 0'}}>
      <hr />
      SHOULD BE FOOTER
      <Button
        size="small"
        onClick={() => {
          return scope.$lookup.children.push({value: scope.$pos.join('+'), label: 'neo'});
        }}
        // icon={<FileAddOutlined></FileAddOutlined>}
        type="primary"
      >
         index: {scope.$index} | length: {scope.$records.length} | pos: {scope.$pos.join(',')}
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
    Code,
    ScopeLogger,
    Input,
    FormItem,
  },
  scope: {
    loadData,
    actions,
  },
});

const schema: React.ComponentProps<typeof SchemaField>["schema"] = {
  type: "object",
  properties: {
    layout: {
      type: "void",
      "x-component": "Space",
      "x-component-props": {
        style: {
          display: "flex",
          justifyContent: "space-between",
        },
      },
      properties: {
        tree: {
          type: "object",
          "x-decorator": "FormItem",
          "x-component": "TreeNodes",
          "x-component-props": {
            loadData: "{{loadData}}",
          },
          properties: {
            // _header: {
            //   type: "void",
            //   "x-visible": "{{$index === 0}}",
            //   "x-component-props": "{{{count: $records && $records.length}}}",
            //   "x-component": "NodeHeader",
            // },
            label: {
              type: "string",
              // "x-decorator": "FormItem",
              // "x-read-pretty": true,
              "x-component": "Input",
              "x-component-props": {
                style:{
                  width: "200px"
                }
              }
            },
            moveup: {
              type: "void",
              "x-component": "TreeBase.Move",
              "x-component-props": {
                to: "up",
              },
            },
            movedown: {
              type: "void",
              "x-component": "TreeBase.Move",
              "x-component-props": {
                to: "down",
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
              type: "void",
              "x-component": "ScopeLogger",
            },
            // _footer: {
            //   type: "void",
            //   "x-hidden": "{{!$last}}",
            //   "x-component": "NodeFooter",
            //   'x-component-props': {
            //     hidden: "{{!$last}}"
            //   }
            // },

          },
        },
        code: {
          type: "object",
          "x-component": "Code",
          "x-reactions": {
            dependencies: [".tree"],
            fulfill: {
              schema: {
                "x-value": "{{$deps[0]}}",
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
