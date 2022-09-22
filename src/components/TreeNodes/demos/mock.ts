import { OptionData, PopActions } from 'fireformily';
import { raw } from '@formily/reactive';
export const remote =
  'https://unpkg.com/china-location@2.1.0/dist/location.json';
export const flat = (
  json: Record<
    string,
    {
      name: string;
      code: string;
      children?: {
        name: string;
        code: string;
        children?: { name: string; code: string }[];
      }[];
      cities: Record<
        string,
        {
          name: string;
          code: string;
          children?: {
            name: string;
            code: string;
          }[];
          districts: Record<string, string>;
        }
      >;
    }
  >,
) => {
  const flatten: { parent?: string; code: string; name: string }[] = [];

  const MAX = 4;
  const tree = Object.values(json).map((province, idx) => {
    if (idx > MAX) return;
    flatten.push({ code: province.code, name: province.name });
    province.children = Object.values(province.cities).map((city) => {
      // 拍平的结构要求 parentId 不能重复, 这个数据里面直辖市是一样的, 搞一下
      const cityCode =
        city.code === province.code ? `${city.code}00` : city.code;

      flatten.push({
        code: cityCode,
        name: city.name,
        parent: province.code,
      });
      city.children = Object.entries(city.districts).map(([code, name]) => {
        const distCode =
          code === cityCode || code == province.code ? `${code}0000` : code;
        flatten.push({ code: distCode, name, parent: cityCode });
        return { code, name } as any;
      });
      return city;
    });
    return province;
  });
  return { flatten, tree };
};

export const getById = (parent?: React.Key) => {
  return fetch(remote)
    .then((res) => res.json())
    .then((origin) => flat(origin))
    .then(({ flatten }) => {
      return flatten.filter((x) => x.parent === parent);
    });
};

export const loadAll = () => {
  return fetch(remote)
    .then((res) => res.json())
    .then((origin) => flat(origin))
    .then(({ tree }) => {
      const current = tree?.map((item: any) => ({
        label: item.name,
        value: item.code,
        isLeaf: false,
        children: item.children?.map((child: any) => {
          return {
            label: child.name,
            value: child.code,
            isLeaf: false,
            children: child.children.map((godson: any) => {
              return {
                label: godson.name,
                value: godson.code,
                isLeaf: true,
              };
            }),
          };
        }),
      }));
      // console.log('current', current);
      return current;
    });
};

export const loadData = (options: OptionData[]) => {
  // unshift root id
  const keys = [undefined, ...options.map((x) => x.value)];
  const last = options[options.length - 1];
  // 没有label 或者 __init 标签表明是初始值, 就全部加载
  const shouldLoadAll = Boolean(
    options.find((x) => x.label === undefined || x.__init),
  );
  if (shouldLoadAll) {
    return Promise.all(keys.map(getById)).then((optionsList) => {
      const ret = optionsList.reduceRight((children: any, opts: any, idx) => {
        if (!children) {
          return opts.map((item: any) => ({
            value: item.code,
            label: item.name,
            isLeaf: true,
          }));
        } else {
          return opts.map((item: any) => {
            const isMyChild = item.code === keys[idx + 1];
            return {
              value: item.code,
              label: item.name,
              isLeaf: false,
              children: isMyChild ? children : undefined,
            };
          });
        }
      }, null);
      return ret;
    });
  } else {
    // 否则是单独加载
    return getById(last?.value).then((opts) =>
      opts.map((item) => {
        return {
          value: item.code,
          label: item.name,
          // 需要给出叶子条件, 这里我们是省市区3级, 所以keys长度是3的时候就到最后一级别了
          isLeaf: keys.length === 3,
        };
      }),
    );
  }
};
type TActions = React.ComponentProps<typeof PopActions>['actions'];

const log = (label: string, x: any) => {
  console.log('LABEL:', label);
  try {
    console.group(JSON.parse(JSON.stringify(x)));
  } catch (error) {
    console.log('stringify error, origin: ', x);
  }
  console.groupEnd();
};

export const actions: {
  [name: string]: TActions;
} = {
  update: {
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
};
