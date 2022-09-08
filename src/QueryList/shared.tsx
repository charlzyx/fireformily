import { ObjectField } from '@formily/core';
import { useForm } from '@formily/react';
import { autorun, observable } from '@formily/reactive';
import qs from 'qs';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';

export interface IQueryListContext<
  Record extends any = any,
  Params extends any = any,
> {
  /** 查询请求, Promise */
  service?: (params: {
    pagination?: {
      current: number;
      pageSize: number;
    };
    sorter?: {};
    filters?: {};
    params?: Params;
    currentDataSource?: Record[];
  }) => Promise<{
    list: Record[];
    total: number;
  }>;
  /** 是否将查询参数同步到 url search 上 */
  syncUrlParams?: boolean;
  /** 页码开始下标, 默认 0 */
  pageStart?: number;
  /** 首次自动刷新 */
  autoload?: boolean;
  /** 是否正在刷新 */
  _loading?: boolean;
  /** 内部使用: 发起请求, Promise */
  _trigger?: () => Promise<{ list: Record[]; total: number }>;
  /** 内部使用: 刷新请求, Promise */
  _refresh?: () => Promise<{ list: Record[]; total: number }>;
  /** 内部使用: 重置, Promise */
  _reset?: () => Promise<{ list: Record[]; total: number }>;
  /** 内部使用: 字段注册路径信息 (for formily) */
  _address?: {
    query: string;
    table: string;
  };
}

const QueryListContext = createContext<IQueryListContext | null>(null);

const syncUrlSearch = (params: Record<string, any> = {}) => {
  const { search } = window.location;
  const pre = qs.parse(search);
  window.location.search = qs.stringify({ ...pre, ...params });
};

export interface QueryListProviderProps
  extends Pick<
    IQueryListContext,
    'service' | 'syncUrlParams' | 'autoload' | 'pageStart'
  > {}

export const QueryListProvider = React.memo(
  (props: React.PropsWithChildren<QueryListProviderProps>) => {
    const form = useForm();
    const memo = useRef({});

    const autoloaded = useRef(false);

    const methods = useRef({
      service: props.service,
    });

    const _service: IQueryListContext['service'] = useCallback(
      (params: any) => {
        const { service } = methods.current;
        memo.current = params;
        if (props.syncUrlParams) {
          syncUrlSearch(params);
        }
        $value.current._loading = true;
        return service!(params)
          .then(({ list, total }) => {
            const tableAddress = $value.current._address!.table;
            const tableField = form.query(tableAddress!).take() as ObjectField;
            tableField.setState((s) => {
              s.value = list;
              s.data = s.data || {};
              s.data.pagination = s.data.pagination || {};
              s.data.pagination.total = total;
            });
            return { list, total };
          })
          .finally(() => {
            $value.current._loading = false;
          });
      },
      [form, props.syncUrlParams],
    );

    const _trigger: IQueryListContext['_trigger'] = useCallback(() => {
      const queryAddress = $value.current._address!.query;
      const queryField = form.query(queryAddress!).take() as ObjectField;
      const tableAddress = $value.current._address!.table;
      const tableField = form.query(tableAddress!).take() as ObjectField;
      console.log('_address', $value.current._address, {
        queryField,
        tableField,
      });
      return _service!({
        query: queryField?.value,
        ...(tableField?.data as any),
      });
    }, [_service, form]);

    const _refresh: IQueryListContext['_refresh'] = useCallback(() => {
      const params = memo.current;
      return _service!(params);
    }, [_service]);

    const _reset: IQueryListContext['_reset'] = useCallback(() => {
      const params = memo.current;
      // do reset
      return _service!(params);
    }, [_service]);

    const $value = useRef<IQueryListContext>(
      observable({
        ...props,
        service: props.service ? _service : undefined,
        _refresh: props.service ? _refresh : undefined,
        _reset: props.service ? _reset : undefined,
        _trigger: props.service ? _trigger : undefined,
        _address: {
          query: '',
          table: '',
        },
      }),
    );

    useEffect(() => {
      if (!methods.current.service) return;
      const disposer = autorun(() => {
        const tableAddress = $value.current._address?.table;
        if (
          autoloaded.current === false &&
          tableAddress &&
          $value.current.autoload !== false
        ) {
          setTimeout(() => {
            _trigger();
            autoloaded.current = true;
          });
        }
      });

      return () => {
        disposer();
      };
    }, [_trigger]);

    useEffect(() => {
      const $val = $value.current;
      if ($val.autoload !== props.autoload) {
        $val.autoload = props.autoload;
      }
      if (props.pageStart && $val.pageStart !== props.pageStart) {
        $val.pageStart = props.pageStart;
      }
    }, [props.autoload, props.pageStart]);

    return (
      <QueryListContext.Provider value={$value.current}>
        {props.children}
      </QueryListContext.Provider>
    );
  },
);

export const useQueryList$ = () => {
  const ctx = useContext(QueryListContext);
  return ctx;
};
