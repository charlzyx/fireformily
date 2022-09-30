import { useLatest } from 'ahooks';
import { Card as AntdCard } from 'antd';
import React, { useEffect } from 'react';

import type { Actions, IButtonType} from './shared';
import { usePopAction } from './shared';

/** 作为子表单使用, 也是合情合理的吧, 自动 open 就行了 */
export const Card = (
  props: React.ComponentProps<typeof AntdCard> &
    IButtonType & { actions: Actions },
) => {
  const { open, body, field, footer, header, loading } = usePopAction();

  const FBIOPENTHEDOOR = useLatest({ open });

  useEffect(() => {
    FBIOPENTHEDOOR.current.open();
  }, [FBIOPENTHEDOOR]);

  return (
    <AntdCard {...props} loading={loading} title={props.title || field.title}>
      {header}
      {body}
      {footer}
    </AntdCard>
  );
};
