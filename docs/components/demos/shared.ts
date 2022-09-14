import qs from 'qs';
import moment from 'moment';
import { registerLoader } from 'fireformily';

// Example of a random customer generator
import { faker } from '@faker-js/faker';
faker.setLocale('zh_CN');

export const service = ({
  params,
  pagination,
  sorter,
  filters,
  extra,
}: any) => {
  console.log(
    'search sevice args ',
    JSON.stringify({ params, pagination, sorter, filters, extra }, null, 2),
  );
  const {
    start = moment().toDate(),
    end = moment().add(1, 'year').toDate(),
    classify,
    status,
    domain,
  } = params || {};
  const { current, pageSize } = pagination;

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
        console.log('search response ', { list, total });
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
  console.log(
    'on sort args ',
    JSON.stringify({ oldIndex, neoIndex, array, scope }, null, 2),
  );
  return Promise.resolve();
};

export const actions = {
  batch: {
    load: (record?: any, index?: number, lookup?: any) => {
      console.log(
        'batch load args',
        JSON.stringify({ record, index, lookup }, null, 2),
      );
      return Promise.resolve(record);
    },
    cancel: (record?: any, index?: number, lookup?: any) => {
      console.log(
        'batch cancel args',
        JSON.stringify({ record, index, lookup }, null, 2),
      );
    },
    submit: (data: any, record?: any, index?: number, lookup?: any) => {
      console.log(
        'batch submit args',
        JSON.stringify({ data, record, index, lookup }, null, 2),
      );
      return Promise.resolve();
    },
  },
  add: {
    load: (record?: any, index?: number, lookup?: any) => {
      console.log(
        'add load args',
        JSON.stringify({ record, index, lookup }, null, 2),
      );
      return Promise.resolve(record);
    },
    cancel: (record?: any, index?: number, lookup?: any) => {
      console.log(
        'add cancel args',
        JSON.stringify({ record, index, lookup }, null, 2),
      );
    },
    submit: (data: any, record?: any, index?: number, lookup?: any) => {
      console.log(
        'add submit args',
        JSON.stringify({ data, record, index, lookup }, null, 2),
      );
      return Promise.resolve();
    },
  },
  remove: {
    load: (record?: any, index?: number, lookup?: any) => {
      console.log(
        'remove load args',
        JSON.stringify({ record, index, lookup }, null, 2),
      );
      return Promise.resolve(record);
    },
    cancel: (record?: any, index?: number, lookup?: any) => {
      console.log(
        'remove cancel args',
        JSON.stringify({ record, index, lookup }, null, 2),
      );
    },
    submit: (data: any, record?: any, index?: number, lookup?: any) => {
      console.log(
        'remove submit args',
        JSON.stringify({ data, record, index, lookup }, null, 2),
      );
      return Promise.resolve();
    },
  },
  update: {
    load: (record?: any, index?: number, lookup?: any) => {
      console.log(
        'update load args',
        JSON.stringify({ record, index, lookup }, null, 2),
      );
      return Promise.resolve(record);
    },
    cancel: (record?: any, index?: number, lookup?: any) => {
      console.log(
        'update cancel args',
        JSON.stringify({ record, index, lookup }, null, 2),
      );
    },
    submit: (data: any, record?: any, index?: number, lookup?: any) => {
      console.log(
        'update submit args',
        JSON.stringify({ data, record, index, lookup }, null, 2),
      );
      return Promise.resolve();
    },
  },
};

export const loaders = {
  bool: () => {
    registerLoader('bool', (convert) => {
      return Promise.resolve([
        { label: '是', value: 1, color: 'success' },
        { label: '否', value: 0, color: 'error' },
      ]).then((list) => {
        return convert(list);
      });
    });
  },
  status: () => {
    registerLoader('status', (convert) => {
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
    registerLoader('classify', (convert) => {
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
