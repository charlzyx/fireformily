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
import { isObservable } from '@formily/reactive';
import { useQueryList$ } from '../QueryList/shared';

const nextTick = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve('');
    }, 0);
  });

const shallowClone = (x: any) => {
  return isObservable(x) ? x : Array.isArray(x) ? [...x] : { ...x };
};
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

  const actions = field?.componentProps?.actions as Actions;

  const calling = useRef({
    open: false,
    reset: false,
    submit: false,
  });

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

    if (calling.current.open) return;
    calling.current.open = true;

    const loader = methods.current.load || noop;
    setLoading(true);

    return loader(scope)
      .then((data) => {
        field.setState((s) => {
          s.value = shallowClone(data);
        });
        setVisible(true);
      })
      .finally(() => {
        calling.current.open = false;
        setLoading(false);
      });
  }, [field, loading, scope]);

  const reset = useCallback(() => {
    if (field.disabled) return;
    if (loading || !visible) return;

    if (calling.current.reset) return;
    calling.current.reset = true;

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
        calling.current.reset = false;
        setLoading(false);
      });
  }, [field, loading, scope, visible]);

  const submit = useCallback(() => {
    if (field.disabled) return;
    if (loading || !visible) return;

    if (calling.current.submit) return;
    calling.current.submit = true;

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
        calling.current.submit = false;
        ctx?._refresh?.();
      });
  }, [ctx, field, loading, scope, visible]);

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
