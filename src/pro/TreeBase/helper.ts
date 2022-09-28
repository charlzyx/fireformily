import { nanoid } from 'nanoid';
import { takeTake } from '../../shared';

type FieldNames = {
  title: string;
  key: string;
  children: string;
};

export type NodePos = number[];

const mapping = <T extends object>(
  parent: T,
  take: ReturnType<typeof takeTake>,
  parentMap?: Map<
    React.Key,
    {
      node: T;
      index: number;
      parentKey: React.Key;
    }
  >,
) => {
  const map = parentMap || new Map();
  if (!Array.isArray(take(parent).children)) return map;

  take(parent).children?.forEach((child: any, index) => {
    map.set(take(child).key, {
      node: child,
      parentKey: take(parent).key,
      index,
    });
    if (take(child).children) {
      mapping(child, take, map);
    }
  });
  return map;
};

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

export const getHelper = <T extends object>(
  refs: {
    root: T;
  },
  fieldNames: FieldNames,
  clone?: <N extends T>(node: N) => N,
) => {
  const take = takeTake(fieldNames);
  const copy = clone ?? ((o) => uniqueClone(o, fieldNames.key));
  // 触发一下observer
  const update = () => {
    take(refs.root).children = [...take(refs.root).children!];
  };

  const helper = {
    get dataSource() {
      return take(refs.root).children;
    },
    take(x: any) {
      return take(x);
    },
    mapping() {
      return mapping(refs.root, take);
    },
    getPos(n: T) {
      const key = take(n).key;
      const mapper = this.mapping();
      if (key) {
        const pos: number[] = [];
        let current = mapper.get(key);

        while (current) {
          pos.push(current.index);
          current = mapper.get(current.parentKey);
        }
        pos.reverse();
        return pos;
      } else {
        return null;
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
    posToPath(pos: NodePos) {
      const path = pos.reduce((p, item) => {
        return p
          ? `${p}.${fieldNames.children}.${item}`
          : `${fieldNames.children}.${item}`;
      }, '');
      return path;
    },
    getNodeAtPos(pos: NodePos) {
      return pos.reduce((parent, at) => {
        return take(parent).children?.[at];
      }, refs.root);
    },
    append(
      pos: NodePos,
      method: 'push' | 'unshift' | 'replace' = 'push',
      ...nodes: T[]
    ) {
      pos.reduce((parent, at, index) => {
        const isLast = index === pos.length - 1;
        const cur = take(parent).children?.[at];
        if (isLast) {
          if (!take(cur).children || method === 'replace') {
            take(cur).children = nodes;
          } else {
            if (method === 'push') {
              take(cur).children?.push(...nodes);
            } else {
              take(cur).children?.unshift(...nodes);
            }
          }
        }
        return cur;
      }, refs.root);
      // dirty = 'append';
      update();
      return refs.root;
    },
    copy(pos: NodePos, neo?: T) {
      const node = this.getNodeAtPos(pos);
      const copyed = neo ?? copy(node as any);
      const parentPos = pos.slice(0, pos.length - 1);
      const copyTo = pos[pos.length - 1] + 1;
      parentPos.reduce((parent, at, index) => {
        const isLast = index === parentPos.length - 1;
        const cur = take(parent).children?.[at];
        if (isLast) {
          take(cur).children?.splice(copyTo, 0, copyed);
        }
        return cur;
      }, refs.root);
      // dirty = 'copy';
      update();
      return refs.root;
    },
    remove(pos: NodePos) {
      const parentPos = pos.slice(0, pos.length - 1);
      const toRemoveIndex = pos[pos.length - 1];
      if (toRemoveIndex == null) return;
      parentPos.reduce((parent, at, index) => {
        const isLast = index === parentPos.length - 1;
        const cur = take(parent).children?.[at];
        if (isLast) {
          take(cur).children?.splice(toRemoveIndex, 1);
        }
        return cur;
      }, refs.root);
      // dirty = 'remove';
      update();
      return refs.root;
    },
    move(before: NodePos, after: NodePos) {
      if (JSON.stringify(before) === JSON.stringify(after)) return refs.root;

      const sameLevel =
        before.length === after.length &&
        before.slice(0, before.length - 1).join('_') ===
          after.slice(0, after.length - 1).join('_');

      if (sameLevel) {
        before.reduce((target: any, at: number, index: number) => {
          const isLast = index === before.length - 1;
          const cur = take(target).children?.[at];

          if (isLast) {
            const formIdx = before[before.length - 1];
            const toIdx = after[after.length - 1];
            const fixToIndex = toIdx > formIdx ? toIdx + 1 : toIdx;
            const pick = take(target).children?.splice(formIdx, 1)[0];
            take(target).children?.splice(fixToIndex, 0, pick);
          }
          return cur;
        }, refs.root);
      } else {
        let pick = null as any;

        before.reduce((target: any, at: number, index: number): any => {
          const isLast = index === before.length - 1;
          const cur = take(target).children?.[at];
          if (isLast) {
            pick = take(target).children?.splice(at, 1)[0];
          }
          return cur;
        }, refs.root);
        if (!pick) return;

        after.reduce((target: any, at: number, index: number) => {
          const isLast = index === after.length - 1;
          const cur = take(target).children?.[at];
          if (isLast) {
            take(target).children?.splice(at, 0, pick!);
          }
          return cur;
        }, refs.root);
      }
      // dirty = 'move';
      update();
      return refs.root;
    },
  };

  return helper;
};
