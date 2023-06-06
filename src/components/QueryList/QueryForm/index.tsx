import type { FormLayout } from '@formily/antd-v5';
import { FormButtonGroup, FormGrid } from '@formily/antd-v5';
import type { ObjectField } from '@formily/core';
import { observer, useField, useForm } from '@formily/react';
import { Button } from 'antd';
import React, { useEffect } from 'react';
import { useQueryList$ } from '../shared';
import { useCollapseGrid } from './useCollapseGrid';

type QueryFormProps = React.PropsWithChildren<{
  resetText?: string;
  submitText?: string;
  grid?: React.ComponentProps<typeof FormGrid>;
  layout?: React.ComponentProps<typeof FormLayout>;
}>;

export const QueryForm = observer((props: QueryFormProps) => {
  const { resetText, submitText } = props;
  const field = useField<ObjectField>();
  const form = useForm();
  const { grid, expanded, toggle } = useCollapseGrid(props.grid!);
  const ctx = useQueryList$();
  const { _loading, _refresh, _reset, _trigger } = ctx || {};

  const onReset = () => {
    if (_loading) return;
    if (ctx) {
      form.reset(ctx._address?.query, { forceClear: true, validate: false }).then(() => {
        _reset?.();
      });
    } else {
      // next tick
      setTimeout(() => {
        _reset?.();
      });
    }
  };

  const onSubmit = () => {
    if (_loading) return;
    return _trigger?.();
  };

  useEffect(() => {
    if (!ctx) return;
    ctx._address!.query = field.address.toString();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx, field?.address?.toString()]);

  const renderActions = () => {
    return (
      <FormButtonGroup
        align="right"
        style={{
          width: '100%',
          marginBottom: '22px',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        {expanded !== undefined ? (
          <Button
            type="link"
            onClick={(e) => {
              e.preventDefault();
              toggle();
            }}
          >
            {expanded ? '收起' : '展开'}
          </Button>
        ) : null}
        <Button onClick={onReset}>{resetText || '重置'}</Button>
        <Button onClick={onSubmit} type="primary">
          {submitText || '查询'}
        </Button>
      </FormButtonGroup>
    );
  };

  return props.children ? (
    <FormGrid {...grid} grid={grid}>
      {props.children}
      <FormGrid.GridColumn
        gridSpan={-1}
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        {renderActions()}
      </FormGrid.GridColumn>
    </FormGrid>
  ) : null;
});
