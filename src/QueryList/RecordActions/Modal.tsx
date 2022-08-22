import { Modal as AntdModal, Button } from 'antd';
import React from 'react';
import { useAction } from './useAction';
import { usePopAction } from './usePopAction';
import { TActionProps } from './shared';

export const Modal = (props: TActionProps<typeof AntdModal>) => {
  const action = useAction();
  const { field } = action;
  const { form, btnProps, visible, load, reset, footer, loading } =
    usePopAction(action, 'middle');

  return (
    <>
      <AntdModal
        maskClosable={false}
        keyboard={false}
        closable={false}
        width={'68.88%'}
        {...props}
        afterClose={() => {
          props?.afterClose?.();
          // next tick
          reset();
        }}
        visible={visible}
        title={props.title || field.title}
        footer={footer}
      >
        {form}
        {field.content}
      </AntdModal>
      <Button {...btnProps} {...props?.btn} loading={loading} onClick={load}>
        {(field.title as string) || '编辑'}
      </Button>
    </>
  );
};
