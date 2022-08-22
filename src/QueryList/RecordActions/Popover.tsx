import { Popover as AntdPopover, Button } from 'antd';
import React from 'react';
import { TActionProps } from './shared';
import { useAction } from './useAction';
import { usePopAction } from './usePopAction';

export const Popover = (props: TActionProps<typeof AntdPopover>) => {
  const action = useAction();
  const { field } = action;
  const { form, reset, btnProps, footer, load, loading, visible } =
    usePopAction(action, 'small');

  return (
    <AntdPopover
      {...props}
      trigger="click"
      title={props.title || field.title}
      content={
        <>
          {form}
          {field.content}
          {footer}
        </>
      }
      visible={visible}
      onVisibleChange={(show) => {
        props?.onVisibleChange?.(show);
        if (!show) {
          reset();
        }
      }}
    >
      <Button {...btnProps} {...props.btn} loading={loading} onClick={load}>
        {(field.title as string) || '编辑'}
      </Button>
    </AntdPopover>
  );
};
