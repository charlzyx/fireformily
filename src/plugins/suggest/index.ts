import { Form, onFieldMount } from '@formily/core';
import { convertToOptionList } from '../dict/helper';

type TSuggestParmas = object & { kw: string };

export type TSuggestionFactory = (
  params: TSuggestParmas,
  converter: typeof convertToOptionList,
) => Promise<ReturnType<typeof convertToOptionList>>;

const loaders: {
  [namespace: string]: (
    params: TSuggestParmas,
  ) => Promise<ReturnType<typeof convertToOptionList>>;
} = {};

/**
 *
@example
const boolLoader = (params, convert) => () => {
  return Promise.resolve([
    { name: '是', code: 1, color: 'success' },
    { name: '否', code: 0, color: 'error' },
  ]).then(data => convert(data, 'name', 'code'));
};
registerDictLoader('bool', boolLoader);

 */

export const registerSuggestion = (
  name: string,
  suggestFactory: TSuggestionFactory,
) => {
  loaders[name] = (params: TSuggestParmas) => {
    return suggestFactory(params, convertToOptionList);
  };
};

export const suggestEffects = (form: Form) => {
  onFieldMount('*', (field) => {
    const maybe = field.data?.suggest;
    if (!maybe) return;

    if (!loaders[maybe]) {
      throw new Error(`Suggestion ${maybe} 的加载器不存在!`, maybe);
    }

    const props = field.componentProps;
    if (!props.fetcher) {
      field.setComponentProps({ ...props, fetcher: loaders[maybe] });
    }
  });
};
