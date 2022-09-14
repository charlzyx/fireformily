import React, { Fragment } from 'react';
import { TDictShape, isColorStatus } from '../../shared';
import { Space, Tag, Badge } from 'antd';
import { useMemo } from 'react';

type Input = string | number | Input[];

export const Dict = (props: {
  value?: Input;
  type: 'badge' | 'tag';
  options: TDictShape['options'];
  /** 严格模式, 将区分  string 和 number, 默认关闭 */
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
        ) : (
          <Tag key={item?.key} color={item?.color}>
            {item?.label}
          </Tag>
        );
      })}
    </Space>
  );
};
