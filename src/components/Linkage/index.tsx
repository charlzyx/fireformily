import { Observer } from '@formily/react';
import { observable } from '@formily/reactive';
import { useLatest } from 'ahooks';
import { Cascader } from 'antd';
import React, { useCallback, useMemo } from 'react';
import 'antd/dist/antd.min.css';

export interface LinkageOption {
  label?: string;
  value?: React.Key;
  isLeaf?: boolean;
  children?: LinkageOption[];
  disabled?: boolean;
  __init?: boolean;
  loading?: boolean;
}

const fullWithStyle = {
  width: '100%',
};

type Input = string | number | { label: string; value: string | number };

export interface LinkageProps {
  /** 懒加载, 与整棵树加载不能共存 */
  loadData?: (selectOptions: LinkageOption[]) => Promise<LinkageOption[]>;
  /** 整棵树加载, 与懒加载不能共存 */
  loadAll?: () => Promise<LinkageOption[]>;
  /** 是否支持多选 */
  multiple?: boolean;
  /** 控制选项值是否包装为 { label, value } 格式 */
  labelInValue?: boolean;
  /**
   * 数组格式 Input[]
   * @type Input = (string | number | { label: string; value: string | number });
   */
  value?: Input[];
  onChange?: (val: Input[]) => any;
  disabled?: boolean;
  style?: React.CSSProperties;
}

interface MergedLinkageProps
  extends Omit<React.ComponentProps<typeof Cascader>, 'loadData' | 'value' | 'onChange'>,
    LinkageProps {}

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

const useLazyeOptions = (props: MergedLinkageProps) => {
  const { loadData, loadAll, value, labelInValue } = props;

  const loader = useLatest(loadAll || loadData);

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

export const Linkage = (props: MergedLinkageProps) => {
  const { value, loadAll, labelInValue, disabled, multiple, onChange, loadData, ...others } = props;

  const state = useLazyeOptions(props);

  const onChangeFn = useCallback(
    (values: string[], options: Required<LinkageOption>[]) => {
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
    <Observer>
      {() => {
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
          />
        );
      }}
    </Observer>
  );
};
