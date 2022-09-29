import { nanoid } from 'nanoid';
import { takeTake } from '../../shared';
import { batch } from '@formily/reactive';

type FieldNames = {
  title: string;
  key: string;
  children: string;
};

export type NodePos = number[];

const uniqueClone = (o: any, key: string) => {
  return JSON.parse(
    JSON.stringify(o, (k, v) => {
      if (k === key) {
        return `__CLONE_${nanoid()}`;
      }
      return v;
    }),
  );
};

const mapping = (
  parent: any,
  take: ReturnType<typeof takeTake>,
  parentPos = [] as number[],
  parentMap?: any,
) => {
  const map = parentMap || {};
  take(parent).children?.forEach((node, index) => {
    const myPos = [...parentPos, index];
    map[take(node).key as any] = {
      parentKey: take(parent).key,
      index,
      pos: myPos,
    };
    if (take(node).children) {
      mapping(node, take, myPos, map);
    }
  });
  return map;
};

export const getHelper = <T extends object>(
  refs: {
    root: T;
  },
  fieldNames: FieldNames,
  clone?: <N extends T>(node: N) => N,
) => {
  const take = takeTake(fieldNames);
  const copy = clone ?? ((o) => uniqueClone(o, fieldNames.key));

  const cache = {
    pos: {} as any,
    mapper: {} as any,
  };

  const freshCache = () => {
    console.log('computed start');
    let start = performance.now();
    cache.mapper = mapping(refs.root, take);

    cache.pos = Object.keys(cache.mapper).reduce((p, nk) => {
      const npos = cache.mapper[nk].pos;
      p[nk] = npos;
      // p[npos.join('_')] = nk;
      return p;
    }, cache.pos);

    let end = performance.now();
    console.log('computed end', end - start);
  };
  // 触发一下observer
  const update = () => {
    freshCache();
    take(refs.root).children = [...take(refs.root).children!];
  };

  freshCache();

  const helper = {
    get dataSource() {
      const ds = take(refs.root).children;
      return ds;
    },
    take(x: any) {
      return take(x);
    },
    getPos(n: T) {
      if (n === refs.root) return [];
      const key = take(n).key;
      if (!key) return null;

      if (cache.pos[key!]) {
        return cache.pos[key];
      } else {
        freshCache();
        return cache.pos[key];
      }
    },
    posToParents(pos: NodePos) {
      let parent = refs.root;
      return pos.reduce((list, at) => {
        const current = take(parent).children?.[at];
        list.push(current);
        parent = current;
        return list;
      }, [] as any[]);
    },
    posToPath(pos: NodePos): string | undefined {
      if (!pos) return undefined;
      const path = pos.reduce((p, item) => {
        return p
          ? `${p}.${fieldNames.children}.${item}`
          : `${fieldNames.children}.${item}`;
      }, '');
      return path;
    },
    getNodeAtPos(pos: NodePos | null) {
      if (pos === null) return null;
      const target = pos.reduce((parent, at) => {
        return take(parent).children?.[at];
      }, refs.root);
      return target;
    },
    append(
      pos: NodePos,
      method: 'push' | 'unshift' | 'replace' = 'push',
      ...nodes: T[]
    ) {
      const target = this.getNodeAtPos(pos);
      if (!target) return;

      batch(() => {
        if (!take(target).children || method === 'replace') {
          take(target).children = nodes;
        } else {
          if (method === 'push') {
            take(target).children?.push(...nodes);
          } else {
            take(target).children?.unshift(...nodes);
          }
        }
        // dirty = 'append';
        update();
      });
    },
    copy(pos: NodePos, neo?: T) {
      const node = this.getNodeAtPos(pos);
      const copyed = neo ?? copy(node as any);
      const parentPos = pos.slice(0, pos.length - 1);
      const parent = this.getNodeAtPos(parentPos);
      if (!parent || !node) return;
      batch(() => {
        const copyTo = pos[pos.length - 1] + 1;

        take(parent).children?.splice(copyTo, 0, copyed);
        // dirty = 'copy';
        update();
      });
    },
    remove(pos: NodePos) {
      const parentPos = pos.slice(0, pos.length - 1);
      const toRemoveIndex = pos[pos.length - 1];
      if (toRemoveIndex == null) return;
      const parent = this.getNodeAtPos(parentPos);
      if (!parent) return;
      batch(() => {
        take(parent).children?.splice(toRemoveIndex, 1);
        // dirty = 'remove';
        update();
      });
    },
    move(before: NodePos, after: NodePos) {
      if (JSON.stringify(before) === JSON.stringify(after)) return;

      const sameLevel =
        before.length === after.length &&
        before.slice(0, before.length - 1).join('_') ===
          after.slice(0, after.length - 1).join('_');

      batch(() => {
        if (sameLevel) {
          const parent = this.getNodeAtPos(before.slice(0, before.length - 1));
          const formIdx = before[before.length - 1];
          const toIdx = after[after.length - 1];
          // const fixToIndex = toIdx < formIdx ? toIdx + 1 : toIdx;
          const pick = take(parent).children?.splice(formIdx, 1)[0];
          take(parent).children?.splice(toIdx, 0, pick);
        } else {
          const fromParent = this.getNodeAtPos(
            before.slice(0, before.length - 1),
          );
          const pick = take(fromParent).children?.splice?.(
            before[before.length - 1],
            1,
          )[0];
          console.log('move before pick', pick);

          if (!pick) return;

          const toParent = this.getNodeAtPos(after.slice(0, after.length - 1));
          take(toParent).children?.splice?.(after[after.length - 1], 0, pick!);
        }
        // dirty = 'move';
        update();
      });
    },
  };

  return helper;
};
