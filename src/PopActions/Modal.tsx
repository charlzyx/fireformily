import { Button, Modal as AntdModal } from 'antd';
import React from 'react';
import { usePopAction } from './shared';

export const Modal = (props: React.ComponentProps<typeof AntdModal>) => {
  const { visible, body, field, footer, header, loading, open, reset } =
    usePopAction();

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
        open={visible}
        title={props.title || field.title}
        footer={footer}
      >
        {header}
        {body}
      </AntdModal>
      <Button loading={loading} onClick={open}>
        {(field.title as string) || '编辑'}
      </Button>
    </>
  );
};
