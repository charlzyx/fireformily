import React from 'react';
import { QueryListProvider, QueryListProviderProps } from './shared';

export const QueryList = (
  props: React.PropsWithChildren<QueryListProviderProps>,
) => {
  return <QueryListProvider {...props}>{props.children}</QueryListProvider>;
};
