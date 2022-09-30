import { Popconfirm as AntdPopconfirm } from 'antd';
import React from 'react';
import { Open } from './Open';
import type { Actions, IButtonType} from './shared';
import { usePopAction } from './shared';

export const Popconfirm = (
  props: React.ComponentProps<typeof AntdPopconfirm> &
    IButtonType & { actions: Actions },
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
      open={visible}
      onOpenChange={(show) => {
        if (!show) {
          reset();
        }
        props?.onOpenChange?.(show);
      }}
    >
      <Open open={open} field={field} loading={loading} scope={scope} />
    </AntdPopconfirm>
  );
};
