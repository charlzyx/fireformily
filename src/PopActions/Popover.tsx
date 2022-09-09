import { Popover as AntdPopover } from 'antd';
import React from 'react';
import { Open } from './Open';
import { usePopAction } from './shared';

export const Popover = (props: React.ComponentProps<typeof AntdPopover>) => {
  const { body, field, scope, footer, header, loading, open, reset, visible } =
    usePopAction();
  // console.log('--popovver', { visible });

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
