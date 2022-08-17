import { useField, useForm } from '@formily/react';
import { ArrayField, Field, Form } from '@formily/core';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export interface IQueryListContext {
  service?: (params: {
    current: number;
    pageSize: number;
    [key: string]: any;
  }) => Promise<{
    total: number;
    data: any[];
  }>;
  refresh?: () => Promise<{
    total: number;
    data: any[];
  }>;
  reset?: () => Promise<{
    total: number;
    data: any[];
  }>;
  form?: Form;
  query?: Field;
  list?: ArrayField;
  pageSize?: number;
  startIndex?: number;
  registryAddress?: (key: 'query' | 'list', v: string) => void;
}

const defaults: IQueryListContext = {
  pageSize: 10,
  startIndex: 1,
  service: () => Promise.resolve({ total: 0, data: [] }),
  registryAddress: () => {},
  refresh: () => Promise.resolve({ total: 0, data: [] }),
  reset: () => Promise.resolve({ total: 0, data: [] }),
};

const QueryListContext = createContext<IQueryListContext>(defaults);

export const useQueryListContext = () => {
  const ctx = useContext(QueryListContext);
  return ctx;
};

export const QueryListProvider = (
  props: React.PropsWithChildren<IQueryListContext>,
) => {
  const [address, setAddress] = useState({
    query: 'query',
    list: 'list',
  });

  const { children, service } = props;
  const form = useForm();
  const field = useField();

  const queryField = useMemo(() => {
    return field.query(address.query).take() as Field;
  }, [address.query, field]);
  const listField = useMemo(() => {
    return field.query(address.list).take() as ArrayField;
  }, [address.list, field]);

  const formRef = useRef(form);
  const fieldRef = useRef(field);

  useEffect(() => {
    formRef.current = form;
  }, [form]);

  useEffect(() => {
    fieldRef.current = field;
  }, [field]);

  const refresh = useCallback(() => {
    const page = formRef.current.query(address.list).get('data');
    const query = formRef.current.query(address.query).value();
    formRef.current
      .query(address.list)
      .take()
      ?.setState((s) => {
        s.componentProps = s.componentProps || {};
        s.componentProps.loading = true;
      });
    return service!({ ...page, ...query })
      .then((resp) => {
        formRef.current
          .query(address.list)
          .take()
          ?.setState((s) => {
            s.componentProps = s.componentProps || {};
            s.componentProps.loading = false;
            s.value = resp.data;
            s.data.total = resp.total;
          });
        return resp;
      })
      .catch((e) => {
        formRef.current
          .query(address.list)
          .take()
          ?.setState((s) => {
            s.componentProps = s.componentProps || {};
            s.componentProps.loading = false;
          });
        throw e;
      });
  }, [address, service]);

  const reset = useCallback(() => {
    formRef.current
      .query(address.list)
      .take()
      .setState((s) => {
        s.data.current = 1;
        s.data.pageSize = 10;
        s.data.selectedRows = [];
        s.data.selectedRowKeys = [];
      });
    return refresh();
  }, [address.list, refresh]);

  const registryAddress = useCallback((k: string, v: string) => {
    setAddress((old) => {
      if ((old as any)[k] === v) return old;
      return {
        ...old,
        [k]: v,
      };
    });
  }, []);

  return (
    <QueryListContext.Provider
      value={{
        ...defaults,
        form,
        query: queryField,
        list: listField,
        refresh,
        reset,
        registryAddress: registryAddress,
      }}
    >
      {children}
    </QueryListContext.Provider>
  );
};
export const QueryListConsume = QueryListContext.Consumer;
