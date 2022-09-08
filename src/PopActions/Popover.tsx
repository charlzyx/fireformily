import { Button, Popover as AntdPopover } from 'antd';
import React from 'react';
import { usePopAction } from './shared';

export const Popover = (props: React.ComponentProps<typeof AntdPopover>) => {
  const { body, field, footer, header, loading, open, reset, visible } =
    usePopAction();

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
      <Button loading={loading} onClick={open}>
        {(field.title as string) || '编辑'}
      </Button>
    </AntdPopover>
  );
};
