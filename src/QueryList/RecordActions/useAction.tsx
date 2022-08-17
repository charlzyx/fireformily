/* eslint-disable no-shadow */
import { ArrayBase } from '@formily/antd';
import { Field } from '@formily/core';
import { useField, useFieldSchema } from '@formily/react';
import { toJS } from '@formily/reactive';
import { useMemo } from 'react';
import { useQueryListContext } from '../ctx';

const nextTick = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve('');
    }, 0);
  });

export const useAction = () => {
  /** 非 void field 可以 submit, 所以不能用 void */
  const field = useField() as Field;
  const schema = useFieldSchema();
  const index = ArrayBase?.useIndex?.()!;
  const record = ArrayBase?.useRecord?.()!;
  const array = ArrayBase?.useArray?.()!;
  const { refresh, list } = useQueryListContext();

  const memo = useMemo(() => {
    const actions = {
      load: () => {
        const loader =
          field.componentProps?.actions?.load ||
          (() => Promise.resolve(record));
        return loader(record).then((data: any) => {
          console.log('loader data', data);
          return data != undefined ? field.setValue(toJS(data)) : data;
        });
      },
      cancel: () => {
        const canceler =
          field.componentProps?.actions?.cancel || (() => Promise.resolve());
        /**
         * 在一些 visible 的回调中, visible 变化是在 field submit 之前的
         * 因此, 在 nextTick 之后再调用reset 比较能保证 field submit
         * 能够拿到数据
         *
         */
        return nextTick().then(() => {
          field.reset().then(() => {
            return canceler(record);
          });
        });
      },
      submit: () => {
        const submiter =
          field.componentProps?.actions?.submit ||
          ((data: any) => Promise.resolve(data));
        return field.submit().then((data) => {
          return submiter(data, record).then((neoRecord: any) => {
            if (neoRecord) {
              const maybe = array?.field || list;
              if (maybe) {
                if (index !== undefined) {
                  maybe.value[index] = neoRecord;
                } else {
                  maybe.value.unshift(neoRecord);
                }
              }
            } else {
              refresh?.();
            }
            field.reset();
            return neoRecord;
          });
        });
      },
    };
    return { actions, field, schema, index, record, array };
  }, [array, field, index, list, record, refresh, schema]);

  return memo;
};
