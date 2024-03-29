import { Select } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';

type Input = string | number | { label: string; value: string | number } | Input[];

const getInit = (multiple?: boolean, value?: Input): Input => {
  let ret = value;
  if (multiple) {
    ret = Array.isArray(value) ? value : [];
  }
  return ret as any;
};

export const Suggestion: React.FC<{
  placeholder?: string;
  style?: React.CSSProperties;
  labelInValue?: boolean;
  params?: object;
  multiple?: boolean;
  value?: Input;
  onChange?: (neo: Input) => void;
  disabled?: boolean;
  suggest?: (
    parmas: object & { kw: string },
  ) => Promise<{ label: string; value: string | number }[]>;
}> = (props) => {
  const [data, setData] = useState<{ label: string; value: string | number }[]>([]);
  const [value, setValue] = useState<Input>(getInit(props.multiple, props.value));

  const [loading, setLoading] = useState(false);

  const suggest = useRef(props.suggest);

  useEffect(() => {
    if (props.suggest) {
      suggest.current = props.suggest;
    }
  }, [props.suggest]);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rank = useRef(0);

  const lazySuggest = useCallback((params: any) => {
    const now = ++rank.current;
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      setLoading(true);
      if (!suggest.current) {
        setLoading(false);
      }
      suggest
        .current?.(params)
        ?.then((options) => {
          if (now < rank.current) return;
          setData(options);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 200);
  }, []);

  const handleSearch = (newValue: string) => {
    if (!suggest.current) return;
    if (newValue) {
      lazySuggest({ ...props.params, kw: newValue });
    } else {
      setData([]);
    }
  };

  const handleChange = (newValue: Input) => {
    setValue(newValue);
    props.onChange?.(newValue);
  };

  return (
    <Select
      showSearch
      loading={loading}
      value={value}
      labelInValue={props.labelInValue}
      mode={props.multiple ? 'multiple' : undefined}
      placeholder={props.placeholder}
      style={props.style}
      disabled={props.disabled}
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      options={data}
    />
  );
};
