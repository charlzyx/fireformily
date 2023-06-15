---
group:
  title: Pro 组件
  order: 4
---

# 🪟 Popup - 弹窗动作

> 弹窗系列, 是为了解决常见的 Popover/Popconfirm/Modal/Drawer 弹窗编辑子表单模板代码的问题, 更常用于与表格的行操作
>
> 注意：该组件只适用于 Schema 场景
## 为什么不是 [FormDialog](https://antd.formilyjs.org/zh-CN/components/form-dialog#formdialog-1)/[FormDrawer](https://antd.formilyjs.org/zh-CN/components/form-drawer#formdrawer-1) ?

- 这两个都是方法调用, 不能用 json 描述出来所以 `FormDialog/FormDrawer` 适合用于更灵活的场景;
- 此外, `FormDialog/FormDrawer` 内部是使用了 [document.body.appendChild](https://github.com/alibaba/formily/blob/formily_next/packages/antd/src/form-drawer/index.tsx#L122) 凭空创建了一个新的 dom 节点来承载这个表单, 脱离了 root 节点, 所以需要用 [Portals](https://zh-hans.reactjs.org/docs/portals.html) 打补丁, 可能会遇到一些奇奇怪怪的问题
- 目的是减少模版代码的处理, 不需要编程式那么灵活, 活着说， 灵活性转换到 `actions` 中处理;

因此对于常见的弹出表单处理逻辑, 尝试归纳为为三个固定的动作

```
- open    // 预加载? -> 打开弹窗
- cancel  // 取消 -> 关闭弹窗
- confirm // 确定 -> 关闭弹窗
```

> 在具体的实现中， Popup 所在的 void 节点内部创建了一个新的 **子表单**, 通过子表单的 `reset/submit` 来处理弹窗中的校验逻辑
>
> 为什么 `load` 可能会返回一个新的值? 很简单的例子: 根据列表项 id 查询详情
全部转换成表单领域的术语, 在加上 `Promise` 包装, 可以这样来表示

```ts | pure
export interface IPopupActions<Record = any, Data = any> {
  load?: (
    record: Record,
    field: GeneralField,
    rootForm: Form,
    popForm: Form
  ) => Promise<Data>
  cancel?: (
    record: Record,
    field: GeneralField,
    rootFform: Form,
    popForm: Form
  ) => Promise<any>
  submit?: (
    data: Data,
    field: GeneralField,
    rootForm: Form,
    popForm: Form
  ) => Promise<any>
}
```

## Markup Schema 案例

```tsx
import React from 'react'
import { FormItem, Input } from '@formily/antd-v5'
import { Popup } from 'fireformily'
import { createForm } from '@formily/core'
import { createSchemaField, FormProvider, IPopupActions } from '@formily/react'
const actions: IPopupActions = {
  load(record, field, form, popupForm) {
    console.log('load', { record, field, form, popupForm })
    return Promise.resolve({ ...record })
  },
  cancel(record, field, form, popupForm) {
    console.log('cancel', { record, field, form, popupForm })
    return Promise.resolve()
  },
  submit(data, field, form, popupForm) {
    console.log('submit', { data, field, form, popupForm })
    return Promise.resolve()
  },
}
const form = createForm()
const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    Popup,
  },
  scope: {
    actions,
  },
})
export default () => {
  return (
    <FormProvider form={form}>
      <SchemaField>
        <SchemaField.String
          name="aaa"
          title="input box 1"
          x-decorator="FormItem"
          x-component="Input"
          required
        />
        <SchemaField.String
          name="bbb"
          title="input box 2"
          x-decorator="FormItem"
          x-component="Input"
          required
        />
        <SchemaField.Void
          name="popupmodal"
          title="模态框弹出"
          x-component="Popup.Modal"
          x-component-props={{
            actions: '{{actions}}',
            openButton: {
              type: 'primary',
            },
          }}
        >
          <SchemaField.String
            name="aaa"
            title="input box 1"
            x-decorator="FormItem"
            x-component="Input"
            required
          />
          <SchemaField.String
            name="bbb"
            title="input box 2"
            x-decorator="FormItem"
            x-component="Input"
            required
          />
        </SchemaField.Void>
      </SchemaField>
    </FormProvider>
  )
}
```

## JSON Schema 案例

```tsx
import React from 'react'
import { FormItem, Input } from '@formily/antd-v5'
import { Popup } from 'fireformily'
import { createForm } from '@formily/core'
import { createSchemaField, FormProvider, IPopupActions } from '@formily/react'
const actions: IPopupActions = {
  load(record, field, form, popupForm) {
    console.log('load', { record, field, form, popupForm })
    return Promise.resolve({ ...record })
  },
  cancel(record, field, form, popupForm) {
    console.log('cancel', { record, field, form, popupForm })
    return Promise.resolve()
  },
  submit(data, field, form, popupForm) {
    console.log('submit', { data, field, form, popupForm })
    return Promise.resolve()
  },
}
const form = createForm()
const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    Popup,
  },
  scope: {
    actions,
  },
})
const schema = {
  type: 'object',
  properties: {
    aaa: {
      type: 'string',
      title: 'input box 1',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    bbb: {
      type: 'string',
      title: 'input box 2',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    popupmodal: {
      type: 'void',
      title: '模态框弹出',
      'x-component': 'Popup.Modal',
      'x-component-props': {
        actions: '{{actions}}',
        openButton: {
          type: 'primary',
        },
      },
      properties: {
        aaa: {
          type: 'string',
          title: 'input box 1',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
        bbb: {
          type: 'string',
          title: 'input box 2',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
      },
    },
  },
}
export default () => {
  return (
    <FormProvider form={form}>
      <SchemaField schema={schema} />
    </FormProvider>
  )
}
```

## 和 ArrayTable 一起使用的 Markup Schema 案例

```tsx
import React from 'react'
import {
  FormItem,
  Input,
  ArrayTable,
  FormButtonGroup,
  Submit,
  IPopupActions,
} from '@formily/antd-v5'
import { Popup } from 'fireformily'
import { createForm } from '@formily/core'
import { FormProvider, createSchemaField } from '@formily/react'
const actions: {
  modal: IPopupActions
  popconfirm: IPopupActions
} = {
  modal: {
    load(record, field, form, popupForm) {
      console.log('modal load', { record, field, form, popupForm })
      return Promise.resolve({ ...record })
    },
    cancel(record, field, form, popupForm) {
      console.log('modal cancel', { record, field, form, popupForm })
      return Promise.resolve()
    },
    submit(data, field, form, popupForm) {
      console.log('modal submit', { data, field, form, popupForm })
      return Promise.resolve()
    },
  },
  popconfirm: {
    load(record, field, form, popupForm) {
      console.log('popconfirm load', { record, field, form, popupForm })
      return Promise.resolve({ ...record })
    },
    cancel(record, field, form, popupForm) {
      console.log('popconfirm cancel', { record, field, form, popupForm })
      return Promise.resolve()
    },
    submit(data, field, form, popupForm) {
      console.log('popconfirm submit', { data, field, form, popupForm })
      return Promise.resolve()
    },
  },
}
const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    ArrayTable,
    Popup,
  },
  scope: {
    actions,
  },
})
const form = createForm({
  initialValues: {
    array: [{ a1: '点点右边试试' }],
  },
})
export default () => {
  return (
    <FormProvider form={form}>
      <SchemaField>
        <SchemaField.Array
          name="array"
          x-decorator="FormItem"
          x-component="ArrayTable"
          x-component-props={{
            pagination: { pageSize: 10 },
            scroll: { x: '100%' },
          }}
        >
          <SchemaField.Object>
            <SchemaField.Void
              x-component="ArrayTable.Column"
              x-component-props={{ width: 80, title: '顺序', align: 'center' }}
            >
              <SchemaField.Void
                x-decorator="FormItem"
                required
                x-component="ArrayTable.Index"
              />
            </SchemaField.Void>
            <SchemaField.Void
              x-component="ArrayTable.Column"
              x-component-props={{ title: 'A1', dataIndex: 'a1', width: 200 }}
            >
              <SchemaField.String
                name="a1"
                x-decorator="FormItem"
                required
                x-component="Input"
              />
            </SchemaField.Void>
            <SchemaField.Void
              x-component="ArrayTable.Column"
              x-component-props={{
                title: '操作',
                dataIndex: 'operations',
                width: 200,
                fixed: 'right',
              }}
            >
              <SchemaField.Void x-component="FormItem">
                <SchemaField.Void x-component="ArrayTable.Remove" />
                <SchemaField.Void x-component="ArrayTable.MoveDown" />
                <SchemaField.Void x-component="ArrayTable.MoveUp" />
              </SchemaField.Void>
              <SchemaField.Void
                title="模态框弹窗"
                x-component="Popup.Modal"
                x-component-props={{
                  actions: '{{actions.modal}}',
                  title: '我是一只模态框',
                  openButton: {
                    type: 'primary',
                  },
                }}
              >
                <SchemaField.String
                  name="a1"
                  x-decorator="FormItem"
                  required
                  x-component="Input"
                />
              </SchemaField.Void>
              <SchemaField.Void
                title="确认弹窗"
                x-component="Popup.Popconfirm"
                x-component-props={{
                  actions: '{{actions.popconfirm}}',
                  showCancel: false,
                  title: '我是一只确认弹窗',
                }}
              >
                <SchemaField.String
                  name="a1"
                  x-decorator="FormItem"
                  required
                  x-component="Input"
                />
              </SchemaField.Void>
            </SchemaField.Void>
          </SchemaField.Object>
          <SchemaField.Void
            x-component="ArrayTable.Addition"
            title="添加一条记录"
          />
        </SchemaField.Array>
      </SchemaField>
      <FormButtonGroup>
        <Submit onSubmit={console.log}>Submit</Submit>
      </FormButtonGroup>
    </FormProvider>
  )
}
```

## 和 ArrayTable 一起使用的 JSON Schema 案例

```tsx
import React from 'react'
import {
  FormItem,
  Input,
  ArrayTable,
  FormButtonGroup,
  Submit,
  IPopupActions,
} from '@formily/antd-v5'
import { Popup } from 'fireformily'
import { createForm } from '@formily/core'
import { FormProvider, createSchemaField } from '@formily/react'
const actions: {
  modal: IPopupActions
  popconfirm: IPopupActions
} = {
  modal: {
    load(record, field, form, popupForm) {
      console.log('modal2 load', { record, field, form, popupForm })
      return Promise.resolve({ ...record })
    },
    cancel(record, field, form, popupForm) {
      console.log('modal2 cancel', { record, field, form, popupForm })
      return Promise.resolve()
    },
    submit(data, field, form, popupForm) {
      console.log('modal2 submit', { data, field, form, popupForm })
      return Promise.resolve()
    },
  },
  popconfirm: {
    load(record, field, form, popupForm) {
      console.log('popconfirm2 load', { record, field, form, popupForm })
      return Promise.resolve({ ...record })
    },
    cancel(record, field, form, popupForm) {
      console.log('popconfirm2 cancel', { record, field, form, popupForm })
      return Promise.resolve()
    },
    submit(data, field, form, popupForm) {
      console.log('popconfirm2 submit', { data, field, form, popupForm })
      return Promise.resolve()
    },
  },
}
const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    ArrayTable,
    Popup,
  },
  scope: {
    actions,
  },
})
const form = createForm({
  initialValues: {
    array: [{ a1: '点点右边试试' }],
  },
})
const schema = {
  type: 'object',
  properties: {
    array: {
      type: 'array',
      'x-decorator': 'FormItem',
      'x-component': 'ArrayTable',
      'x-component-props': {
        pagination: { pageSize: 10 },
        scroll: { x: '100%' },
      },
      items: {
        type: 'object',
        properties: {
          column2: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': { width: 80, title: '顺序', align: 'center' },
            properties: {
              index: {
                type: 'void',
                'x-component': 'ArrayTable.Index',
              },
            },
          },
          column3: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': { width: 200, title: 'A1' },
            properties: {
              a1: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
            },
          },
          column6: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': {
              title: '操作',
              dataIndex: 'operations',
              width: 200,
              fixed: 'right',
            },
            properties: {
              item: {
                type: 'void',
                'x-component': 'FormItem',
                properties: {
                  remove: {
                    type: 'void',
                    'x-component': 'ArrayTable.Remove',
                  },
                  moveDown: {
                    type: 'void',
                    'x-component': 'ArrayTable.MoveDown',
                  },
                  moveUp: {
                    type: 'void',
                    'x-component': 'ArrayTable.MoveUp',
                  },
                  popupmodal: {
                    type: 'void',
                    title: 'Popup Modal',
                    'x-component': 'Popup.Modal',
                    'x-component-props': {
                      actions: '{{actions.modal}}',
                      title: "I'm Popup Popconfirm",
                      openButton: {
                        type: 'primary',
                      },
                    },
                    properties: {
                      a1: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                      },
                    },
                  },
                  popupconfirm: {
                    type: 'void',
                    title: 'Popup Popconfirm',
                    'x-component': 'Popup.Popconfirm',
                    'x-component-props': {
                      actions: '{{actions.popconfirm}}',
                      showCancel: false,
                      title: "I'm Popup Popconfirm",
                    },
                    properties: {
                      a1: {
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
      properties: {
        add: {
          type: 'void',
          'x-component': 'ArrayTable.Addition',
          title: '添加一条记录',
        },
      },
    },
  },
}
export default () => {
  return (
    <FormProvider form={form}>
      <SchemaField schema={schema} />
      <FormButtonGroup>
        <Submit onSubmit={console.log}>Submit</Submit>
      </FormButtonGroup>
    </FormProvider>
  )
}
```

## API

### Popup

默认为 `Popup.Modal`, title 属性作为按钮显示名称， `x-components-props` 中的 title 属性则作为弹窗标题, 如果不存在默认使用 title 属性

> 弹窗子表单组件
通用属性

```ts | pure
export interface IPopupActions<Record = any, Data = any> {
  load?: (
    record: Record,
    field: GeneralField,
    rootForm: Form,
    popForm: Form
  ) => Promise<Data>
  cancel?: (
    record: Record,
    field: GeneralField,
    rootFform: Form,
    popForm: Form
  ) => Promise<any>
  submit?: (
    data: Data,
    field: GeneralField,
    rootForm: Form,
    popForm: Form
  ) => Promise<any>
}
```

| 属性名      | 类型            | 描述                                       | 默认值 |
| ----------- | --------------- | ------------------------------------------ | ------ |
| actions     | `IPopupActions` | 表单动作                                   |        |
| showCancel  | `boolean`       | 是否展示取消按钮                           |        |
| cancelText  | `string`        | 取消按钮文案                               |        |
| okText      | `string`        | 确认按钮文案                               |        |
| openButton  | `ButtonProps`   | 触发弹窗按钮属性                           |        |
| formOptions | `IFormProps`    | 弹窗子表单 `createForm` 所使用的 `options` |        |

### Popup.Modal

> 对话框
其余参考 https://4x.ant.design/components/modal-cn/

### Popup.Drawer

> 抽屉
其余参考 https://4x.ant.design/components/drawer-cn/

### Popup.Popconfirm

> 气泡确认框
其余参考 https://4x.ant.design/components/popconfirm-cn/

### Popup.Popover

> 气泡卡片
其余参考 https://4x.ant.design/components/popover-cn/
