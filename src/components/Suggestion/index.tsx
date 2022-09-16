import { Checkbox, Select, Space, Steps } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';

type Input =
  | string
  | number
  | { label: string; value: string | number }
  | Input[];

const getInit = (multiple?: boolean, value?: Input): Input => {
  let ret = value;
  if (multiple) {
    ret = Array.isArray(value) ? value : [];
  }
  return ret as any;
};

export const Suggestion: React.FC<{
  placeholder: string;
  style: React.CSSProperties;
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
  const [data, setData] = useState<{ label: string; value: string | number }[]>(
    [],
  );
  const [value, setValue] = useState<Input>(
    getInit(props.multiple, props.value),
  );

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
      suggest.current?.(params)?.then((options) => {
        if (now < rank.current) return;
        setData(options);
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
    console.log('onChange', newValue);
    setValue(newValue);
    props.onChange?.(newValue);
  };

  return (
    <Select
      showSearch
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
    ></Select>
  );
};

// const App: React.FC = () => {
//   const [value, setValue] = useState<Input>([{ label: '第一', value: 1 }]);

//   const [labelInValue, setLabelInValue] = useState(true);
//   const [multiple, setMultiple] = useState(true);

//   useEffect(() => {
//     console.log('--value ', value);
//   }, [value]);

//   return (
//     <Space direction="vertical">
//       <Space>
//         <label>
//           <Checkbox
//             checked={labelInValue}
//             onChange={() => setLabelInValue((x) => !x)}
//           ></Checkbox>
//           labeInValue
//         </label>
//         <label>
//           <Checkbox
//             checked={multiple}
//             onChange={() => setMultiple((x) => !x)}
//           ></Checkbox>
//           multiple
//         </label>
//       </Space>
//       <Suggestion
//         labelInValue={labelInValue}
//         multiple={multiple}
//         value={value}
//         onChange={setValue}
//         placeholder="input search text"
//         style={{ width: 200 }}
//       />
//     </Space>
//   );
// };

// export default App;
