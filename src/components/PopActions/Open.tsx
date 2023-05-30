import { Button } from 'antd';
import React from 'react';
import type { usePopAction } from './shared';

const noop = () => {};

export const Open = (
  action: Pick<ReturnType<typeof usePopAction>, 'open' | 'scope' | 'loading' | 'field'>,
) => {
  const { field, loading, open, scope } = action;

  const inArray = scope?.$index !== undefined;

  const click = loading ? noop : open;

  return field.display !== 'visible' ? null : (
    <Button
      onClick={click}
      size={inArray ? 'small' || field?.componentProps?.size : field.componentProps?.size}
      type={inArray ? 'link' || field?.componentProps?.type : field.componentProps?.type}
    >
      {field?.title}
    </Button>
  );
};
