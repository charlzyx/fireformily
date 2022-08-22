import { Popconfirm as AntdPopconfirm, Button } from 'antd';
import React from 'react';
import { useAction } from './useAction';
import { usePopAction } from './usePopAction';
import { TActionProps } from './shared';

export const Popconfirm = (props: TActionProps<typeof AntdPopconfirm>) => {
  const action = useAction();
  const { field } = action;
  const { form, btnProps, load, submit, reset, loading, visible } =
    usePopAction(action, 'small');

  return (
    <AntdPopconfirm
      {...props}
      title={
        <>
          <h4>{props.title || field.title}</h4>
          {form}
          {field.content}
        </>
      }
      cancelButtonProps={{ loading: loading }}
      okButtonProps={{ loading: loading }}
      onCancel={reset}
      onConfirm={submit}
      onVisibleChange={(show) => {
        if (!show) {
          reset();
        }
        props?.onVisibleChange?.(show);
      }}
      visible={visible}
    >
      <Button {...btnProps} {...props?.btn} loading={loading} onClick={load}>
        {(field.title as string) || '编辑'}
      </Button>
    </AntdPopconfirm>
  );
};
