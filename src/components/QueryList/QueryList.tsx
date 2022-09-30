import React from 'react';
import type { QueryListProviderProps } from './shared';
import { QueryListProvider } from './shared';

export const QueryList = (
  props: React.PropsWithChildren<QueryListProviderProps>,
) => {
  return <QueryListProvider {...props}>{props.children}</QueryListProvider>;
};
