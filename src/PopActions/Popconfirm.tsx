import { Button, Popconfirm as AntdPopconfirm } from 'antd';
import React from 'react';
import { usePopAction } from './shared';

export const Popconfirm = (
  props: React.ComponentProps<typeof AntdPopconfirm>,
) => {
  const { body, field, header, loading, open, reset, submit, visible } =
    usePopAction();

  return (
    <AntdPopconfirm
      {...props}
      title={
        <>
          <h4>{header}</h4>
          {body}
        </>
      }
      cancelButtonProps={{ loading: loading }}
      okButtonProps={{ loading: loading }}
      onCancel={reset}
      onConfirm={submit}
      onOpenChange={(show) => {
        if (!show) {
          reset();
        }
        props?.onOpenChange?.(show);
      }}
      open={visible}
    >
      <Button loading={loading} onClick={open}>
        {(field.title as string) || '编辑'}
      </Button>
    </AntdPopconfirm>
  );
};
