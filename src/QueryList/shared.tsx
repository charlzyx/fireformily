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

const noop = () => {};
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
  /** 首次自动刷新 */
  autoload?: boolean;
  /** filter 是否是远程 */
  filterRemote?: boolean;
  /** sort 是否是远程 */
  sortRemote?: boolean;
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
  /** 内部配置 */
  _cofnig: {
    /** 内部使用: size 大小 */
    _size: 'default' | 'middle' | 'small';
    /** 内部使用: column 可见性选项列表 */
    _columns: { label: string; key: React.Key }[];
    /** 内部使用: 需要隐藏的columns */
    _showColumns: React.Key[];
    /** 内部使用: 选中列 */
    _selectedRows: Record[];
    /** 内部使用: 选中列keys */
    _selectedRowKeys: React.Key[];
    /** 内部使用: 清理选中 */
    _selectClear?: () => void;
    /** 内部使用: 反向选择 */
    _selectReverse?: () => void;
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
    'service' | 'syncUrlParams' | 'autoload' | 'filterRemote' | 'sortRemote'
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
      // console.log('_address', $value.current._address, {
      //   queryField,
      //   tableField,
      // });
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
        _cofnig: {
          _size: 'default',
          _columns: [],
          _showColumns: [],
          _selectedRows: [],
          _selectedRowKeys: [],
          _selectClear: noop,
          _selectReverse: noop,
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
      if ($val.filterRemote !== props.filterRemote) {
        $val.filterRemote = props.filterRemote;
      }
      if ($val.sortRemote !== props.sortRemote) {
        $val.sortRemote = props.sortRemote;
      }
    }, [props.autoload, props.filterRemote, props.sortRemote]);

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
