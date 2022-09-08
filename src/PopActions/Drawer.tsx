import { Button, Drawer as AntdDrawer } from 'antd';
import React from 'react';
import { usePopAction } from './shared';

export const Drawer = (props: React.ComponentProps<typeof AntdDrawer>) => {
  const { body, field, footer, header, loading, open, reset, visible } =
    usePopAction();

  return (
    <>
      <AntdDrawer
        width={'68.88%'}
        {...props}
        title={props.title || field.title}
        onClose={(e) => {
          reset();
          props?.onClose?.(e);
        }}
        afterOpenChange={(show) => {
          if (!show) {
            reset();
          }
          props?.afterOpenChange?.(show);
        }}
        open={visible}
        footer={footer}
      >
        {header}
        {body}
      </AntdDrawer>
      <Button loading={loading} onClick={open}>
        {(field.title as string) || '编辑'}
      </Button>
    </>
  );
};
