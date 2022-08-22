import { FormButtonGroup, FormGrid, FormLayout } from '@formily/antd';
import { observer, useField, useForm } from '@formily/react';
import { Button } from 'antd';
import React, { useEffect, useMemo, useRef } from 'react';
import { useQueryListContext } from '../ctx';

const layouts: React.ComponentProps<typeof FormLayout> = {
  breakpoints: [680],
  layout: ['vertical', 'horizontal'],
  labelAlign: ['left', 'right'],
  labelCol: [24, 6],
  wrapperCol: [24, 10],
};

const useCollapseGrid = (conf: React.ComponentProps<typeof FormGrid> = {}) => {
  const maxRows = conf.maxRows || 2;
  const grid = useMemo(() => {
    return FormGrid.createFormGrid({
      maxColumns: conf.maxColumns || 4,
      maxWidth: conf.maxWidth || 320,
      maxRows,
      shouldVisible: (node, myGrid) => {
        if (node.index === grid.childSize - 1) return true;
        if (myGrid.maxRows === Infinity) return true;
        return node.shadowRow! < maxRows + 1;
      },
    });
  }, [conf.maxColumns, conf.maxWidth, maxRows]);

  const computeRows = grid.fullnessLastColumn
    ? grid.shadowRows - 1
    : grid.shadowRows;

  const expanded =
    computeRows <= maxRows ? undefined : grid.maxRows === Infinity;

  const toggle = () => {
    if (grid.maxRows === Infinity) {
      grid.maxRows = maxRows;
    } else {
      grid.maxRows = Infinity;
    }
  };

  return {
    grid,
    expanded,
    toggle,
  };
};

type QueryFormProps = React.PropsWithChildren<{
  resetText?: string;
  submitText?: string;
  grid?: React.ComponentProps<typeof FormGrid>;
  layout?: React.ComponentProps<typeof FormLayout>;
}>;

export const QueryForm = observer((props: QueryFormProps) => {
  const { resetText, submitText } = props;
  const field = useField();
  const form = useForm();
  const { grid, expanded, toggle } = useCollapseGrid(props.grid!);
  const { reset, refresh, query, list, registryAddress, autoload } =
    useQueryListContext();

  const onReset = () => {
    reset!();
    form.reset(field.address, { forceClear: true, validate: false });
  };

  const onSubmit = () => {
    return refresh!();
  };

  const autoloadDone = useRef(false);

  useEffect(() => {
    registryAddress?.('query', field.address.toString());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.address]);

  useEffect(() => {
    const canload =
      autoloadDone.current === false && autoload !== false && list && query;
    if (canload) {
      refresh!();
      autoloadDone.current = true;
    }
  }, [autoload, list, query, refresh]);

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
    <FormLayout
      breakpoints={layouts.breakpoints}
      layout={layouts.layout}
      labelAlign={layouts.labelAlign}
      labelCol={layouts.labelCol}
      {...props.layout}
    >
      <FormGrid {...grid} grid={grid}>
        {props.children}
        <FormGrid.GridColumn
          gridSpan={-1}
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          {renderActions()}
        </FormGrid.GridColumn>
      </FormGrid>
    </FormLayout>
  ) : null;
});
