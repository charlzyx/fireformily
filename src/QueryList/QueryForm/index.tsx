import { FormButtonGroup, FormGrid, FormLayout } from '@formily/antd';
import { observer, useField, useForm } from '@formily/react';
import { Button } from 'antd';
import React, { Fragment, useEffect, useMemo } from 'react';
import { useQueryListContext } from '../ctx';

const useCollapseGrid = (maxRows: number) => {
  const grid = useMemo(
    () =>
      FormGrid.createFormGrid({
        maxColumns: 4,
        maxWidth: 240,
        maxRows: maxRows,
        shouldVisible: (node, myGrid) => {
          if (node.index === grid.childSize - 1) return true;
          if (myGrid.maxRows === Infinity) return true;
          return node.shadowRow! < maxRows + 1;
        },
      }),
    [maxRows],
  );
  const expanded = grid.maxRows === Infinity;
  const realRows = grid.shadowRows;
  const computeRows = grid.fullnessLastColumn
    ? grid.shadowRows - 1
    : grid.shadowRows;

  const toggle = () => {
    if (grid.maxRows === Infinity) {
      grid.maxRows = maxRows;
    } else {
      grid.maxRows = Infinity;
    }
  };
  const takeType = () => {
    if (realRows < maxRows + 1) return 'incomplete-wrap';
    if (computeRows > maxRows) return 'collapsible';
    return 'complete-wrap';
  };
  return {
    grid,
    expanded,
    toggle,
    type: takeType(),
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
  const { grid, expanded, toggle } = useCollapseGrid(1);
  const { reset, refresh, registryAddress } = useQueryListContext();

  const onReset = () => {
    reset!();
    form.reset(field.address, { forceClear: true, validate: false });
  };

  const onSubmit = () => {
    return refresh!();
  };

  useEffect(() => {
    registryAddress?.('query', field.address.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.address]);

  const renderActions = () => {
    return (
      <Fragment>
        <FormButtonGroup
          align="right"
          style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}
        >
          <Button
            type="link"
            onClick={(e) => {
              e.preventDefault();
              toggle();
            }}
          >
            {expanded ? '收起' : '展开'}
          </Button>

          <Button onClick={onReset}>{resetText || '重置'}</Button>
          <Button onClick={onSubmit} type="primary">
            {submitText || '查询'}
          </Button>
        </FormButtonGroup>
      </Fragment>
    );
  };

  return props.children ? (
    <FormLayout {...props.layout}>
      <FormGrid {...grid} grid={grid} style={{ marginBottom: '12px' }}>
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
