import { Popover as AntdPopover } from 'antd';
import React from 'react';
import { Open } from './Open';
import { Actions, IButtonType, usePopAction } from './shared';

export const Popover = (
  props: React.ComponentProps<typeof AntdPopover> &
    IButtonType & { actions: Actions },
) => {
  const { body, field, scope, footer, header, loading, open, reset, visible } =
    usePopAction();
  console.log('--popovver', { visible });

  return (
    <AntdPopover
      {...props}
      trigger="click"
      title={props.title || field.title}
      content={
        <>
          {header}
          {body}
          {footer}
        </>
      }
      open={visible}
      onOpenChange={(show) => {
        props?.onOpenChange?.(show);
        if (!show) {
          reset();
        }
      }}
    >
      <Open open={open} field={field} loading={loading} scope={scope}></Open>
    </AntdPopover>
  );
};
