import { Modal as AntdModal } from 'antd';
import React from 'react';
import { Open } from './Open';
import type { Actions, IButtonType } from './shared';
import { usePopAction } from './shared';

export const Modal = (
  props: React.ComponentProps<typeof AntdModal> & IButtonType & { actions: Actions },
) => {
  const { visible, body, field, scope, footer, header, loading, open, reset } = usePopAction();

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
      <Open open={open} field={field} loading={loading} scope={scope} />
    </>
  );
};
