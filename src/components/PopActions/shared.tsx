import { isVoidField } from '@formily/core';
import {
  RecursionField,
  Schema,
  useExpressionScope,
  useField,
  useFieldSchema,
} from '@formily/react';
import { Button, Space } from 'antd';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useQueryList$ } from '../QueryList/shared';

const nextTick = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve('');
    }, 0);
  });

export interface IButtonType {
  size?: React.ComponentProps<typeof Button>['size'];
  type?: React.ComponentProps<typeof Button>['type'];
}
/**
 * https://github.com/alibaba/formily/discussions/3207
 */
export type Actions<Record = any, Data = Record> = {
  load?: (scope: {
    $record?: Record;
    $index?: number;
    $lookup?: object;
    $records?: Record[];
    $query?: object;
    $list?: Record[];
  }) => Promise<Data>;
  cancel?: (scope: {
    $record?: Record;
    $index?: number;
    $lookup?: object;
    $records?: Record[];
    $query?: object;
    $list?: Record[];
  }) => Promise<any> | void;
  submit?: (
    data: Data,
    scope: {
      $record?: Record;
      $index?: number;
      $lookup?: object;
      $records?: Record[];
      $query?: object;
      $list?: Record[];
    },
  ) => Promise<any>;
};

export interface IAction<Record = any, Data = Record> {
  actions?: Actions<Record, Data>;
  cancelText?: string;
  okText?: string;
  content?: React.ReactNode;
  schema?: Schema;
}

const noop = () => Promise.resolve({});

export const usePopAction = () => {
  const scope = useExpressionScope();
  const field = useField();
  const ctx = useQueryList$();
  // console.log(
  //   '--scope',
  //   // JSON.stringify(scope, null, 2)
  //   // { scope: JSON.stringify(scope, null, 2) },
  //   // { index: JSON.stringify(scope?.$index) },
  //   // { record: JSON.stringify(scope?.$record) },
  //   // { lookup: JSON.stringify(scope?.$lookup) },
  //   // { records: JSON.stringify(scope?.$records) },
  // );

  const actions = field?.componentProps?.actions as Actions;

  const schema = useFieldSchema();

  const methods = useRef(actions || {});

  useEffect(() => {
    methods.current.load = actions?.load;
    methods.current.cancel = actions?.cancel;
    methods.current.submit = actions?.submit;
  }, [actions]);

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const open = useCallback(() => {
    if (field.disabled) return;
    if (loading) return;
    const loader = methods.current.load || noop;
    setLoading(true);
    return loader(scope)
      .then((data) => {
        field.setState((s) => {
          s.value = data;
        });
        setVisible(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [field, loading, scope]);

  const reset = useCallback(() => {
    if (field.disabled) return;
    if (loading) return;
    const preReset = isVoidField(field) ? noop : () => field.reset();
    const cancler = methods.current.cancel || noop;

    return preReset()
      .then(() => {
        return cancler(scope);
      })
      .then(() => {
        setVisible(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [field, loading, scope]);

  const submit = useCallback(() => {
    if (field.disabled) return;
    if (loading) return;
    const preSubmit = isVoidField(field) ? noop : () => field.submit();
    const preReset = isVoidField(field) ? noop : () => field.reset();
    const submiter = methods.current.submit || noop;

    return preSubmit()
      .then((data) => {
        return submiter(data, scope);
      })
      .then(() => {
        setVisible(false);
        /** nexttick */
        return nextTick().then(preReset);
      })
      .finally(() => {
        setLoading(false);
        ctx?._refresh?.();
      });
  }, [ctx, field, loading, scope]);

  const header = useMemo(() => {
    return field.content ? field.content : null;
  }, [field.content]);

  const body = useMemo(() => {
    return schema ? (
      <Fragment>
        <RecursionField schema={schema}></RecursionField>
      </Fragment>
    ) : null;
  }, [schema]);

  const footer = useMemo(() => {
    return (
      <Space
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '16px',
        }}
      >
        <Button loading={loading} onClick={reset}>
          取消
        </Button>
        <Button loading={loading} onClick={submit} type="primary">
          确定
        </Button>
      </Space>
    );
  }, [loading, reset, submit]);

  return {
    submit,
    field,
    reset,
    open,
    visible,
    loading,
    body,
    header,
    footer,
    scope,
  };
};
