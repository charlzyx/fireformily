import { Modal as AntdModal } from 'antd';
import React from 'react';
import { Open } from './Open';
import { Actions, IButtonType, usePopAction } from './shared';

export const Modal = (
  props: React.ComponentProps<typeof AntdModal> &
    IButtonType & { actions: Actions },
) => {
  const { visible, body, field, scope, footer, header, loading, open, reset } =
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
        /**
         * @deprecated `visible` is deprecated which will be removed in next major version. Please use
         *   `open` instead.
         */
        // visible={visible}
        open={visible}
        title={props.title || field.title}
        footer={footer}
      >
        {header}
        {body}
      </AntdModal>
      <Open open={open} field={field} loading={loading} scope={scope}></Open>
    </>
  );
};
