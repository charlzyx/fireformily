import React, { useCallback, useMemo } from 'react';
import { useField, useFieldSchema } from '@formily/react';
import { ArrayField } from '@formily/core';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { hasSortable } from '../shared';
import { usePrefixCls } from '@formily/antd/lib/__builtins__';

const SortableRow = SortableElement((props: any) => <tr {...props} />);
const SortableBody = SortableContainer((props: any) => <tbody {...props} />);

const RowComp = (props: any) => {
  return <SortableRow index={props['data-row-key'] || 0} {...props} />;
};

const addTdStyles = (node: HTMLElement, prefixCls: string) => {
  const helper = document.body.querySelector(`.${prefixCls}-sort-helper`);
  if (helper) {
    const tds = node.querySelectorAll('td');
    requestAnimationFrame(() => {
      helper.querySelectorAll('td').forEach((td, index) => {
        if (tds[index]) {
          td.style.width = getComputedStyle(tds[index]).width;
        }
      });
    });
  }
};

export const useSortable = (parentRef: React.RefObject<HTMLDivElement>) => {
  const prefixCls = usePrefixCls('formily-array-table');
  const field = useField<ArrayField>();
  const schema = useFieldSchema();
  const withSortable = useMemo(() => {
    return hasSortable(schema);
  }, [schema]);

  const WrapperComp = useCallback(
    (wrapperProps: any) => (
      <SortableBody
        useDragHandle
        lockAxis="y"
        helperClass={`${prefixCls}-sort-helper`}
        helperContainer={() => {
          return parentRef.current?.querySelector('tbody');
        }}
        onSortStart={({ node }: any) => {
          addTdStyles(node as HTMLElement, prefixCls);
        }}
        onSortEnd={({ oldIndex, newIndex }: any) => {
          field.move(oldIndex, newIndex);
        }}
        {...wrapperProps}
      />
    ),
    [field, parentRef, prefixCls],
  );

  const body = {
    wrapper: withSortable ? WrapperComp : undefined,
    row: withSortable ? RowComp : undefined,
  };

  return body;
};
