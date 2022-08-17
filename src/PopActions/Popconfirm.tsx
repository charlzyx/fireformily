import { Popconfirm as AntdPopconfirm } from 'antd';
import React from 'react';
import { Open } from './Open';
import { usePopAction } from './shared';

export const Popconfirm = (
  props: React.ComponentProps<typeof AntdPopconfirm>,
) => {
  const { body, field, header, loading, scope, open, reset, submit, visible } =
    usePopAction();

  return (
    <AntdPopconfirm
      {...props}
      title={
        <>
          <h4>{field.title || header}</h4>
          {field.title ? null : header}
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
      <Open open={open} field={field} loading={loading} scope={scope}></Open>
    </AntdPopconfirm>
  );
};
