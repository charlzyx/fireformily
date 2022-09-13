import { ArrayBase } from '@formily/antd';
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
  load?: (record?: Record, index?: number, records?: Record[]) => Promise<Data>;
  cancel?: (
    record?: Record,
    index?: number,
    records?: Record[],
  ) => Promise<Data>;
  submit?: (
    data?: Data,
    record?: Record,
    index?: number,
    records?: Record[],
  ) => Promise<Record>;
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
  //   { index: JSON.stringify(scope?.$index) },
  //   { record: JSON.stringify(scope?.$record) },
  //   { lookup: JSON.stringify(scope?.$lookup) },
  //   { records: JSON.stringify(scope?.$records) },
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
    return loader(scope?.$record, scope?.$index, scope?.$records)
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
    const loader = methods.current.cancel || noop;

    return preReset()
      .then(() => {
        return loader(scope?.$record, scope?.$index, scope?.$records);
      })
      .then(() => {
        setVisible(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [field, loading, scope?.$index, scope?.$record, scope?.$records]);

  const submit = useCallback(() => {
    if (field.disabled) return;
    if (loading) return;
    const preSubmit = isVoidField(field) ? noop : () => field.submit();
    const preReset = isVoidField(field) ? noop : () => field.reset();
    const loader = methods.current.submit || noop;

    return preSubmit()
      .then((data) => {
        return loader(data, scope?.$record, scope?.$index, scope?.$records);
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
  }, [ctx, field, loading, scope?.$index, scope?.$record, scope?.$records]);

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
