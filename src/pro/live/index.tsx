import { isSupportObservable, observable } from '@formily/reactive';
import { useMemo } from 'react';

const getInit = (x: any) => {
  const ret = typeof x === 'function' ? x() : x;
  if (!isSupportObservable(ret)) {
    if (process.env.NODE_ENV !== 'devlopment') {
      console.log('WARNING!!, not support obserable');
    } else {
      throw new Error(`WARNING!!, not support obserable ${typeof x}`);
    }
    return ret;
  }
  return observable(ret);
};

export const useLive = <D extends object>(d?: D | (() => D)): D => {
  const state = useMemo(() => {
    return getInit(d ?? {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
};
