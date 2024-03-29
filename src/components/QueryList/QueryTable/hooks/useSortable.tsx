import { usePrefixCls } from '@formily/antd/lib/__builtins__';
import type { ArrayField } from '@formily/core';
import { useField, useFieldSchema } from '@formily/react';
import { toJS } from '@formily/reactive';
import React, { useCallback, useMemo } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { useQueryList$ } from '../../shared';
import { hasSortable } from './utils';
import { useExpressionScope } from '../../../../compatible';

const SortableRow = SortableElement((props: any) => <tr {...props} />);
const SortableBody = SortableContainer((props: any) => <tbody {...props} />);

const RowComp = (props: any) => {
  return <SortableRow index={props['data-row-sort-index'] || 0} {...props} />;
};

const addTdStyles = (node: HTMLElement, prefixCls: string) => {
  const helper = document.body.querySelector(`.${prefixCls}-sort-helper`);
  // console.log('helper', helper);
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
  const scope = useExpressionScope();

  const withSortable = useMemo(() => {
    return hasSortable(schema);
  }, [schema]);

  const ctx = useQueryList$();

  const WrapperComp = useCallback(
    (wrapperProps: any) => {
      return (
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
            const action = field.componentProps?.onSort;
            if (typeof action === 'function') {
              const ret = action(oldIndex, newIndex, toJS(field.value), scope);
              if (ret instanceof Promise) {
                field.setLoading(true);
                field.move(oldIndex, newIndex);
                ret
                  .then((sholudFresh) => {
                    if (sholudFresh) {
                      ctx?._refresh?.();
                    }
                    field.setLoading(false);
                  })
                  .catch(() => {
                    // 反向操作
                    field.move(newIndex, oldIndex);
                    field.setLoading(false);
                  });
              } else {
                field.move(oldIndex, newIndex);
              }
            } else {
              field.move(oldIndex, newIndex);
            }
          }}
          {...wrapperProps}
        />
      );
    },
    [ctx, field, parentRef, prefixCls, scope],
  );

  const body = {
    wrapper: withSortable ? WrapperComp : undefined,
    row: withSortable ? RowComp : undefined,
  };

  return body;
};
