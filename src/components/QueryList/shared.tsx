import type { ArrayField, ObjectField } from '@formily/core';
import useUrlState from '@ahooksjs/use-url-state';
import { useExpressionScope, ExpressionScope, useForm } from '@formily/react';
import { autorun, observable, batch } from '@formily/reactive';
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
    extra?: {
      action: 'filter' | 'sort' | 'paginate';
      currentDataSource?: Record[];
    };
    scope?: {
      $record?: object;
      $index?: number;
      $records?: object[];
      $lookup?: object;
    };
  }) => Promise<{
    list: Record[];
    total: number;
  }>;
  /** 首次自动刷新 */
  autoload?: boolean;
  /** filter 是否是远程 */
  filterRemote?: boolean;
  /** sort 是否是远程 */
  sortRemote?: boolean;
  /** size 大小 */
  size: 'default' | 'middle' | 'small';
  /** 是否将查询参数同步到url上 */
  syncUrl?: boolean;
  /** 分页大小, 默认 10 */
  pageSize?: number;
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
  /** 父级作用域 */
  _scope?: {
    $record?: any;
    $index?: number;
    $records?: any[];
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

export type QueryListProviderProps = Pick<
    IQueryListContext,
    | 'service'
    | 'pageSize'
    | 'syncUrl'
    | 'autoload'
    | 'filterRemote'
    | 'sortRemote'
    | 'size'
  >

export const QueryListProvider = React.memo(
  (props: React.PropsWithChildren<QueryListProviderProps>) => {
    const form = useForm();
    const memo = useRef({});
    const [urlState, setUrlState] = useUrlState();
    const syncUrlDone = useRef(false);
    const scope = useExpressionScope();

    const autoloaded = useRef(false);

    const methods = useRef({
      service: props.service,
    });


    const _service: IQueryListContext['service'] = useCallback(
      (params: any) => {
        const { service } = methods.current;
        memo.current = params;
        // console.log('at service props.syncUrl', props.syncUrl);
        if (props.syncUrl) {
          const {
            pagination: { pageSize, current },
            params: query,
          } = params || { pagination: {} };

          setUrlState((pre) => {
            const empty = { ...pre };
            Object.keys(empty).forEach((key) => {
              empty[key] = undefined;
            });
            return { ...empty, ...query, pageSize, current };
          });
        }
        $value.current._loading = true;
        return service!({ ...params, scope })
          .then(({ list, total }) => {
            const tableAddress = $value.current._address!.table;
            const tableField = form.query(tableAddress!).take() as ObjectField;
            if (!tableAddress) return { list: [], total: 0 };
            tableField.setState((s) => {
              batch(() => {
                s.value = list;
                s.data = s.data || {};
                s.data.pagination = s.data.pagination || {};
                s.data.pagination.total = total;
              });
            });
            return { list, total };
          })
          .finally(() => {
            $value.current._loading = false;
          });
      },
      [form, props.syncUrl, scope, setUrlState],
    );

    const _trigger: IQueryListContext['_trigger'] = useCallback(() => {
      const queryAddress = $value.current._address!.query;
      const queryField = form.query(queryAddress!).take() as ObjectField;
      const tableAddress = $value.current._address!.table;
      const tableField = form.query(tableAddress!).take() as ArrayField;
      // console.log('_address', $value.current._address, {
      //   queryField,
      //   tableField,
      // });
      return _service!({
        params: queryField?.value,
        ...(tableField?.data as any),
      });
    }, [_service, form]);

    const _refresh: IQueryListContext['_refresh'] = useCallback(() => {
      const params = memo.current;
      return _service!(params);
    }, [_service]);

    const _reset: IQueryListContext['_reset'] = useCallback(() => {
      const tableField = $value?.current?._address?.table;
      if (tableField) {
        form
          .query(tableField)
          .take()
          ?.setState((s) => {
            batch(() => {
              s.data = s.data || {};
              s.data.pagination = s.data.pagination || {};
              s.data.pagination.current = 1;
            });
          });
      }

      // do reset
      return _trigger!();
    }, [_trigger, form]);


    const $value = useRef<IQueryListContext>(
      observable({
        ...props,
        service: props.service ? _service : undefined,
        syncUrl: props.syncUrl,
        pageSize: props.pageSize,
        _refresh: props.service ? _refresh : undefined,
        _reset: props.service ? _reset : undefined,
        _trigger: props.service ? _trigger : undefined,
        _address: {
          query: '',
          table: '',
        },
        _scope: scope,
        _cofnig: {
          _size: props.size ?? 'default',
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
      if (!props.syncUrl) return;
      if (syncUrlDone.current) return;
      const { _address } = $value.current;
      const { pageSize, current, ...params } = urlState || {};

      if (pageSize && _address?.table) {
        form
          .query(_address.table)
          .take()
          ?.setState((s) => {
            batch(() => {
              s.data = s.data || {};
              s.data.pagination = s.data.pagination || {};
              s.data.pagination.pageSize = Number(urlState.pageSize);
              s.data.pagination.current = Number(urlState.current);
            });
          });
      }
      if (params && Object.keys(params).length > 0 && _address?.query) {
        form
          .query(_address.query)
          .take()
          ?.setState((s) => {
            s.value = { ...s.value, ...params };
          });
      }
      if (_address?.table) {
        setTimeout(() => {
          syncUrlDone.current = true;
        }, 0);
      }
    }, [form, props.syncUrl, urlState]);

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
      if ($val.syncUrl !== props.syncUrl) {
        $val.syncUrl = props.syncUrl;
      }
    }, [props.autoload, props.filterRemote, props.sortRemote, props.syncUrl]);

    return (
      <QueryListContext.Provider value={$value.current}>
        <ExpressionScope
          value={{
            get $query() {
              const queryAddress = $value.current._address?.query;
              return queryAddress
                ? (form.query(queryAddress).take() as ObjectField).value
                : null;
            },
            get $list() {
              const tableAdress = $value.current._address?.table;
              return tableAdress
                ? (form.query(tableAdress).take() as ArrayField).value
                : null;
            },
          }}
        >
          {props.children}
        </ExpressionScope>
      </QueryListContext.Provider>
    );
  },
);

export const useQueryList$ = () => {
  const ctx = useContext(QueryListContext);
  return ctx;
};
