import React, { Fragment } from 'react';
import { Image } from 'antd';
import { useMemo } from 'react';

type Input = string | string[];

const size: React.CSSProperties = {
  width: '60px',
  height: '60px',
  objectFit: 'contain',
};

export const ImageView = (props: { value?: Input }) => {
  const { value } = props;

  const uris = useMemo(() => {
    const ret = Array.isArray(value) ? value : [value];
    return ret.filter(Boolean);
  }, [value]);

  return (
    <Fragment>
      {uris.map((uri) => {
        return <Image style={size} key={uri} src={uri} preview></Image>;
      })}
    </Fragment>
  );
};
