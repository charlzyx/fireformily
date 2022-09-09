import { Button } from 'antd';
import React from 'react';
import { usePopAction } from './shared';

const noop = () => {};

export const Open = (
  action: Pick<
    ReturnType<typeof usePopAction>,
    'open' | 'scope' | 'loading' | 'field'
  >,
) => {
  const { field, loading, open, scope } = action;

  const inArray = scope?.$index !== undefined;

  const click = loading ? noop : open;

  return inArray ? (
    <a
      onClick={(e) => {
        e.preventDefault();
        click();
      }}
    >
      {field?.title}
    </a>
  ) : (
    <Button onClick={click} {...field?.componentProps?.button}>
      {field?.title}
    </Button>
  );
};
