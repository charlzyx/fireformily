import React, { Fragment } from 'react';
import { isColorStatus } from '../../shared';
import { TDictShape } from '../../pro';
import { Space, Tag, Badge } from 'antd';
import { useMemo } from 'react';

type Input = string | number | Input[];

export const Dict = (props: {
  /**
   * 对应枚举值
   * @type Input = string | number | Input[];
   */
  value?: Input;
  /** 渲染形式 Badeg | Tag */
  type?: 'badge' | 'tag';
  /** 选项 */
  options?: TDictShape['options'];
  /**
   * 严格模式, 将使用 === 来对比 value
   * 非严格模式下采用 == 对比
   * @default false
   */
  strict?: boolean;
}) => {
  const { strict, type, value, options } = props;

  const items = useMemo(() => {
    if (!Array.isArray(options)) return [];
    const ret = Array.isArray(value)
      ? value.map((v) =>
          // eslint-disable-next-line eqeqeq
          options.find((x) => (strict ? x.value === v : x.value == v)),
        )
      : // eslint-disable-next-line eqeqeq
        [options.find((x) => (strict ? x.value === value : x.value == value))];
    return ret.filter(Boolean);
  }, [options, strict, value]);

  return (
    <Space size="small">
      {items.map((item) => {
        return type === 'badge' ? (
          <Badge
            key={item?.key}
            status={
              isColorStatus(item?.color) ? (item?.color as any) : undefined
            }
            color={isColorStatus(item?.color) ? undefined : item?.color}
            text={item?.label}
          ></Badge>
        ) : type === 'tag' ? (
          <Tag key={item?.key} color={item?.color}>
            {item?.label}
          </Tag>
        ) : (
          item?.label
        );
      })}
    </Space>
  );
};
