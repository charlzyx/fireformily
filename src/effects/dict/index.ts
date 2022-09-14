import { Form, onFieldMount } from '@formily/core';
import { observable } from '@formily/reactive';
import { convertListToDict, convertToDictList } from './helper';
import { TDictShape } from '../../shared';

export type TDictLoaderFactory = (
  converter: typeof convertToDictList,
) => Promise<ReturnType<typeof convertToDictList>>;

export const memo: {
  [namespace: string]: TDictShape;
} = observable({});

export const dict = memo;

const loaders: {
  [namespace: string]: () => Promise<TDictShape>;
} = {};

const pendings: {
  [namespace: string]: Promise<TDictShape> | undefined;
} = {};

/**
 *
@example
const boolLoader = (conver) => () => {
  return Promise.resolve([
    { name: '是', code: 1, color: 'success' },
    { name: '否', code: 0, color: 'error' },
  ]).then(data => convert(data, 'name', 'code'));
};
registerLoader('bool', boolLoader);

 */

export const registerLoader = (
  name: string,
  loaderFactory: TDictLoaderFactory,
) => {
  loaders[name] = () => {
    return loaderFactory(convertToDictList).then((list) => {
      const dict = convertListToDict(list);
      memo[name] = dict;
      return memo[name];
    });
  };
};

export const dictEffects = (form: Form) => {
  onFieldMount('*', (field) => {
    const maybe = field.data?.dict;
    if (!maybe) return;
    const noCache = field.data.dictNoCache;

    if (!memo[maybe] && !loaders[maybe]) {
      throw new Error(`词典 ${maybe} 的加载器不存在!`, maybe);
    }

    if (noCache !== true && memo[maybe]) {
      field.setState((s) => {
        s.dataSource = memo[maybe].options;
        if (s.componentProps) {
          s.componentProps.options = s.dataSource;
        }
      });
    } else if (maybe && loaders[maybe]) {
      field.setState((s) => {
        s.loading = true;
      });

      const task = pendings[maybe] || loaders[maybe]();

      pendings[maybe] = task
        .then((dict) => {
          field.setState((s) => {
            s.dataSource = dict.options;
            if (s.componentProps) {
              s.componentProps.options = s.dataSource;
            }
            s.loading = false;
          });
          return dict;
        })
        .catch((e) => {
          field.setState((s) => {
            s.loading = false;
          });
          throw e;
        });
    }
  });
};
