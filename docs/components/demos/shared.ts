import moment from 'moment';
import { registerDictLoader, PopActions } from 'fireformily';

import { faker } from '@faker-js/faker';

import React from 'react';

type TActions = React.ComponentProps<typeof PopActions>['actions'];

faker.setLocale('zh_CN');

const log = (label: string, x: any) => {
  console.log('LABEL:', label);
  try {
    console.group(JSON.parse(JSON.stringify(x)));
  } catch (error) {
    console.log('stringify error, origin: ', x);
  }
  console.groupEnd();
};

export const service = ({
  params,
  pagination,
  sorter,
  filters,
  extra,
}: any) => {
  log('search sevice args ', { params, pagination, sorter, filters, extra });

  const {
    start = moment().toDate(),
    end = moment().add(1, 'year').toDate(),
    classify,
    status,
    domain,
  } = params || {};
  const { current, pageSize } = pagination || {};

  return Promise.resolve().then(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const total = 45;
        const list = Array.from({
          length: current * pageSize > total ? total % pageSize : pageSize,
        }).map((_, idx) => {
          return {
            id: current * pageSize + idx,
            status: status ?? +faker.random.numeric(1) % 5,
            domain: `${
              domain ? `${domain}.` : ''
            }${faker.internet.domainName()}`,
            subdomains: Array.from(
              new Set(
                Array.from({
                  length: Math.floor(Math.random() * 3),
                }).map(() => faker.internet.domainName()),
              ),
            ).map((item) => {
              return {
                owner: faker.company.name(),
                domain: item,
              };
            }),
            classify:
              classify ??
              Array.from(
                new Set(
                  Array.from({ length: Math.floor(Math.random() * 3) }).map(
                    () => +faker.random.numeric(1) % 5,
                  ),
                ),
              ),
            date: moment(faker.date.between(start, end)).format('YYYY-MM-DD'),
            img: faker.image.avatar(),
            desc: faker.lorem.paragraph(),
          };
        });
        log('search response ', { list, total });

        resolve({
          list,
          total,
        });
      }, 456);
    });
  });
};

export const onSort = (
  oldIndex: number,
  neoIndex: number,
  array: any[],
  scope: any,
) => {
  log('on sort args ', { oldIndex, neoIndex, array, scope });

  return Promise.resolve();
};

export const actions: {
  [k: string]: TActions;
} = {
  batch: {
    load: (scope) => {
      log('batch load args', scope);
      return Promise.resolve(scope.$record);
    },
    cancel: (scope) => {
      log('batch cancel args', scope);
    },
    submit: (data, scope) => {
      log('batch submit args', { data, scope });

      return Promise.resolve();
    },
  },
  add: {
    load: (scope) => {
      log('add load args', scope);
      return Promise.resolve(scope.$record);
    },
    cancel: (scope) => {
      log('add cancel args', scope);
    },
    submit: (data, scope) => {
      log('add submit args', { data, scope });

      return Promise.resolve();
    },
  },
  update: {
    load: (scope) => {
      log('update load args', scope);
      return Promise.resolve(scope.$record);
    },
    cancel: (scope) => {
      log('update cancel args', scope);
    },
    submit: (data, scope) => {
      log('update submit args', { data, scope });
      return Promise.resolve();
    },
  },
  remove: {
    load: (scope) => {
      log('remove load args', scope);
      return Promise.resolve(scope.$record);
    },
    cancel: (scope) => {
      log('remove cancel args', scope);
    },
    submit: (data, scope) => {
      log('remove submit args', { data, scope });
      return Promise.resolve();
    },
  },
};

export const loaders = {
  bool: () => {
    registerDictLoader('bool', (convert) => {
      return Promise.resolve([
        { label: '是', value: 1, color: 'success' },
        { label: '否', value: 0, color: 'error' },
      ]).then((list) => {
        return convert(list);
      });
    });
  },
  status: () => {
    registerDictLoader('status', (convert) => {
      return Promise.resolve([
        { label: '已上线', value: 0, color: 'success' },
        { label: '运行中', value: 1, color: 'processing' },
        { label: '关闭', value: 2, color: 'default' },
        { label: '已宕机', value: 3, color: 'error' },
        { label: '已超载', value: 4, color: 'warning' },
      ]).then((list) => {
        return convert(list);
      });
    });
  },
  classify: () => {
    registerDictLoader('classify', (convert) => {
      return Promise.resolve([
        { label: '文艺', value: 0 },
        { label: '喜剧', value: 1 },
        { label: '爱情', value: 2 },
        { label: '动画', value: 3 },
        { label: '悬疑', value: 4 },
        { label: '科幻', value: 5 },
      ]).then((list) => {
        return convert(list);
      });
    });
  },
};
