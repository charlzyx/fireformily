import { Drawer as AntdDrawer } from 'antd';
import React from 'react';
import { Open } from './Open';
import { IButtonType, usePopAction } from './shared';

export const Drawer = (
  props: React.ComponentProps<typeof AntdDrawer> & IButtonType,
) => {
  const { body, field, footer, header, loading, scope, open, reset, visible } =
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
        // /**
        //  * @deprecated `visible` is deprecated which will be removed in next major version. Please use
        //  *   `open` instead.
        //  */
        // visible={visible}
        // /**
        //  * @deprecated `afterVisibleChange` is deprecated which will be removed in next major version.
        //  *   Please use `afterOpenChange` instead.
        //  */
        // afterVisibleChange={(show) => {
        //   if (!show) {
        //     reset();
        //   }
        //   props?.afterOpenChange?.(show);
        // }}
        open={visible}
        afterOpenChange={(show) => {
          if (!show) {
            reset();
          }
          props?.afterOpenChange?.(show);
        }}
        footer={footer}
      >
        {header}
        {body}
      </AntdDrawer>
      <Open open={open} field={field} loading={loading} scope={scope}></Open>
    </>
  );
};
