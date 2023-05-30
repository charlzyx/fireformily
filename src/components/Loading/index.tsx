import React, { useLayoutEffect, useState } from 'react';
import { Skeleton } from 'antd';

const absolute: React.CSSProperties = {
  position: 'absolute',
  transition: 'all ease 0.2s',
};

export const Loading = (props: React.ComponentProps<typeof Skeleton>) => {
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 67);
  }, []);
  return <Skeleton style={{ ...absolute, display: loading ? '' : 'none' }} paragraph loading />;
};
