import { ArrayBase, FormGrid, FormLayout } from '@formily/antd';
import { RecursionField } from '@formily/react';
import { Popover as AntdPopover, Button, Space } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { EmptyActions, TActionProps } from './shared';

import React from 'react';
type BaseProps = TActionProps<typeof AntdPopover>;

export const usePopAction = (
  props: BaseProps,
  buttonSize?: React.ComponentProps<typeof Button>['size'],
) => {
  const { actions, okText, cancelText, schema, layout, grid } =
    props as BaseProps & {
      actions: EmptyActions;
    };

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const array = ArrayBase.useArray?.();

  const btnProps: React.ComponentProps<typeof Button> = useMemo(() => {
    return array
      ? {
          size: 'small',
          type: 'link',
        }
      : {};
  }, [array]);

  const load = useCallback(() => {
    setLoading(true);
    actions
      .load()
      .then(() => {
        setVisible(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [actions]);

  const submit = useCallback(() => {
    setLoading(true);
    actions
      .submit()
      .then((neoRecord: any) => {
        setVisible(false);
        return neoRecord;
      })
      .finally(() => {
        setLoading(false);
      });
  }, [actions]);

  const reset = useCallback(() => {
    setLoading(true);
    actions
      .cancel()
      .then(() => {
        setVisible(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [actions]);

  const form = useMemo(() => {
    return schema ? (
      <>
        <FormLayout {...layout}>
          <FormGrid {...grid}>
            <RecursionField schema={schema}></RecursionField>
          </FormGrid>
        </FormLayout>
      </>
    ) : null;
  }, [grid, layout, schema]);

  const footer = useMemo(() => {
    return (
      <Space
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '16px',
        }}
      >
        <Button
          loading={loading}
          size={buttonSize || btnProps.size}
          onClick={reset}
        >
          {cancelText || '取消'}
        </Button>
        <Button
          loading={loading}
          size={buttonSize || btnProps.size}
          onClick={submit}
          type="primary"
        >
          {okText || '确定'}
        </Button>
      </Space>
    );
  }, [btnProps.size, buttonSize, cancelText, loading, okText, reset, submit]);

  return {
    form,
    footer,
    visible,
    setVisible,
    loading,
    setLoading,
    load,
    submit,
    reset,
    btnProps,
  };
};
