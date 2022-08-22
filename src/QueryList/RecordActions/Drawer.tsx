import { Drawer as AntdDrawer, Button } from 'antd';
import React from 'react';
import { useAction } from './useAction';
import { usePopAction } from './usePopAction';
import { TActionProps } from './shared';

export const Drawer = (props: TActionProps<typeof AntdDrawer>) => {
  const action = useAction();
  const { field } = action;
  const { form, load, visible, btnProps, reset, footer, loading } =
    usePopAction(action, 'middle');

  return (
    <>
      <AntdDrawer
        maskClosable={false}
        keyboard={false}
        closable={false}
        width={'68.88%'}
        {...props}
        title={props.title || field.title}
        onClose={(e) => {
          reset();
          props?.onClose?.(e);
        }}
        afterVisibleChange={(show) => {
          if (!show) {
            reset();
          }
          props?.afterVisibleChange?.(show);
        }}
        visible={visible}
        footer={footer}
      >
        {form}
        {field.content}
      </AntdDrawer>
      <Button {...btnProps} {...props?.btn} loading={loading} onClick={load}>
        {(field.title as string) || '编辑'}
      </Button>
    </>
  );
};
