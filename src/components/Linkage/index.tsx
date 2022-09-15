import { observer } from '@formily/react';
import { observable } from '@formily/reactive';
import { Cascader } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';

export interface LinkageOption {
  value: string;
  label: string;
  children?: LinkageOption[];
  isLeaf?: boolean;
  loading?: boolean;
  __init?: boolean;
}

const fullWithStyle = {
  width: '100%',
};

type Input = string | number | { label: string; value: string | number };

interface LinkageProps
  extends Omit<
    React.ComponentProps<typeof Cascader>,
    'loadData' | 'value' | 'onChange'
  > {
  loadData?: (current: LinkageOption[]) => Promise<LinkageOption[]>;
  loadAll?: () => Promise<LinkageOption[]>;
  multiple?: boolean;
  labelInValue?: boolean;
  value?: Input[];
  onChange?: (val: Input[]) => any;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const initOptions = (labelInValue?: boolean, value?: Input[]) => {
  return labelInValue && Array.isArray(value)
    ? value.length > 0
      ? value?.reduceRight((children: any, opt: any) => {
          if (children) {
            opt.children = children;
            opt.__init = true;
            return [opt];
          } else {
            opt.isLeaf = true;
            return [opt];
          }
        }, null)
      : []
    : [];
};

const useLazyeOptions = (props: LinkageProps) => {
  const { loadData, loadAll, value, labelInValue } = props;

  const loader = useRef(loadAll || loadData);

  useEffect(() => {
    loader.current = loadAll || loadData;
  }, [loadAll, loadData]);

  const state = useMemo(() => {
    return observable({
      inited: false,
      loading: false,
      options: initOptions(labelInValue, value) as LinkageOption[],
      load: (options: LinkageOption[]) => {
        const last = options[options.length - 1]!;
        if (!last) return;
        last.loading = true;
        // !! 不能去掉靠这个loading 触发刷新呢
        state.loading = true;
        loader
          .current?.(options)
          .then((child) => {
            if (!child) {
              last.isLeaf = true;
            } else {
              last.children = child.map((item) => {
                return {
                  isLeaf: false,
                  ...item,
                };
              });
            }
          })
          ?.finally(() => {
            last.loading = false;
            // !! 不能去掉靠这个loading 触发刷新呢
            state.loading = false;
          });
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!state.inited && !state.loading) {
    state.loading = true;
    state.inited = true;
    const options = Array.isArray(value)
      ? labelInValue
        ? value
        : value.map((v) => ({ value: v }))
      : [];

    loader
      .current?.(options as any)
      ?.then((child) => {
        if (child) {
          state.options = child.map((item) => {
            return {
              isLeaf: false,
              ...item,
            };
          });
        }
      })
      ?.finally(() => {
        state.loading = false;
      });
  }

  return state;
};

export const Linkage = observer((props: LinkageProps) => {
  const {
    value,
    loadAll,
    labelInValue,
    disabled,
    multiple,
    onChange,
    loadData,
    ...others
  } = props;

  const state = useLazyeOptions(props);

  const onChangeFn = useCallback(
    (values: string[], options: LinkageOption[]) => {
      if (labelInValue) {
        return onChange?.(options);
      } else {
        return onChange?.(values);
      }
    },
    [labelInValue, onChange],
  );

  const getValue = (val: any): React.Key[] | React.Key[][] => {
    return Array.isArray(val)
      ? val.map((item) => {
          // multiple mode
          if (Array.isArray(item)) {
            return getValue(item);
          } else if (item.label) {
            // labelInValue
            return item.value;
          } else {
            return item;
          }
        })
      : [];
  };

  return (
    <Cascader
      disabled={disabled}
      multiple={multiple}
      changeOnSelect
      {...others}
      loading={state.loading}
      value={getValue(value)}
      style={props.style || fullWithStyle}
      options={[...state.options]}
      loadData={loadAll ? undefined : (state.load as any)}
      onChange={onChangeFn as any}
    ></Cascader>
  );
});
