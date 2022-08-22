/* eslint-disable no-shadow */
import { observer, useField } from '@formily/react';
import { Pagination } from 'antd';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useQueryListContext } from '../ctx';

type IPaginationProps = Omit<
  React.ComponentProps<typeof Pagination>,
  'pageSize' | 'current' | 'total' | 'size' | 'showSizeChanger' | 'onChange'
>;

export const ObPagination: React.FC = observer((props: IPaginationProps) => {
  // QueryTable 所在的 field
  const field = useField();
  const data = field?.data;

  const {
    refresh,
    startIndex = 1,
    pageSize: defaultPageSize = 10,
  } = useQueryListContext();

  const total = data?.total || 0;
  const current = data?.current || startIndex;

  const pageSize = useMemo(() => {
    return data?.pageSize !== undefined ? data.pageSize : defaultPageSize;
  }, [data?.pageSize, defaultPageSize]);

  const totalPage = Math.ceil(total / pageSize);

  useEffect(() => {
    field.setState((s) => {
      s.data = s.data || {};
      s.data.current = s.data.current || startIndex;
      s.data.pageSize = pageSize;
      if (s.data.total) {
        refresh!();
      }
    });
  }, [field, pageSize, startIndex, refresh]);

  useEffect(() => {
    // 刷新之后, 数量少于当前页面, 修复一下当前页码
    if (data?.current && totalPage < data.current) {
      field.setState((s) => {
        s.data = s.data || {};
        s.data.current = totalPage;
      });
    }
  }, [data, field, totalPage]);

  const handleChange = useCallback(
    (current: number, size: number) => {
      field.setState((s) => {
        s.data = s.data || {};
        s.data.current = current;
        s.data.pageSize = size;
        if (s.data.total) {
          refresh!();
        }
      });
    },
    [field, refresh],
  );

  return totalPage <= 1 ? null : (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}
    >
      <div style={{ marginRight: '8px' }}>
        第 {(current - startIndex) * pageSize + 1}-
        {Math.min((current - startIndex + 1) * pageSize, total)} 条, 总共{' '}
        {total} 条
      </div>
      <div>
        <Pagination
          {...props}
          pageSize={pageSize}
          current={data.current || 1}
          showQuickJumper
          size="small"
          total={total}
          showSizeChanger
          onShowSizeChange={handleChange}
          onChange={handleChange}
        />
      </div>
    </div>
  );
});
