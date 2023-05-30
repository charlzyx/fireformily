import { Typography } from 'antd';
import React from 'react';
import 'antd/dist/antd.min.css';

const { Paragraph } = Typography;

export const LongText = (
  props: {
    value?: string;
  } & React.ComponentProps<typeof Paragraph>,
) => {
  return (
    <Paragraph copyable ellipsis {...props}>
      {props.value}
    </Paragraph>
  );
};
