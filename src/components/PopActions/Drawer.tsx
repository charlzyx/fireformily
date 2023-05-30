import { Drawer as AntdDrawer } from 'antd';
import React from 'react';
import { Open } from './Open';

import type { Actions, IButtonType } from './shared';
import { usePopAction } from './shared';

export const Drawer = (
  props: React.ComponentProps<typeof AntdDrawer> & IButtonType & { actions: Actions },
) => {
  const { body, field, footer, header, loading, scope, open, reset, visible } = usePopAction();

  return (
    <>
      <AntdDrawer
        width={'68.88%'}
        closable
        keyboard
        {...props}
        title={props.title || field.title}
        onClose={(e) => {
          reset();
          props?.onClose?.(e);
        }}
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
      <Open open={open} field={field} loading={loading} scope={scope} />
    </>
  );
};
