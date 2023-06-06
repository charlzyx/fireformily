import { Typography } from 'antd';
import React from 'react';

const { Paragraph } = Typography;

export const LongText = (
  props: {
    value?: string;
  } & React.ComponentProps<typeof Paragraph>,
) => {
  return (
    <Paragraph copyable ellipsis {...props} style={{ marginBottom: 0 }}>
      {props.value}
    </Paragraph>
  );
};
