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
      const target = this.getNodeAtPos(pos);
      if (!target) return;

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
    },
    copy(pos: NodePos, neo?: T) {
      const node = this.getNodeAtPos(pos);
      const copyed = neo ?? copy(node as any);
      const parentPos = pos.slice(0, pos.length - 1);
      const parent = this.getNodeAtPos(parentPos);
      if (!parent || !node) return;

      const copyTo = pos[pos.length - 1] + 1;

      take(parent).children?.splice(copyTo, 0, copyed);
      // dirty = 'copy';
      update();
    },
    remove(pos: NodePos) {
      const parentPos = pos.slice(0, pos.length - 1);
      const toRemoveIndex = pos[pos.length - 1];
      if (toRemoveIndex == null) return;
      const parent = this.getNodeAtPos(parentPos);
      if (!parent) return;
      take(parent).children?.splice(toRemoveIndex, 1);
      // dirty = 'remove';
      update();
    },
    move(before: NodePos, after: NodePos) {
      if (JSON.stringify(before) === JSON.stringify(after)) return;

      const sameLevel =
        before.length === after.length &&
        before.slice(0, before.length - 1).join('_') ===
          after.slice(0, after.length - 1).join('_');

      if (sameLevel) {
        const parent = this.getNodeAtPos(before.slice(0, before.length - 1));
        const formIdx = before[before.length - 1];
        const toIdx = after[after.length - 1];
        // const fixToIndex = toIdx < formIdx ? toIdx + 1 : toIdx;
        const pick = take(parent).children?.splice(formIdx, 1)[0];
        take(parent).children?.splice(toIdx, 0, pick);
      } else {

        const fromParent = this.getNodeAtPos(before.slice(0, before.length - 1));
        const pick = take(fromParent).children?.splice?.(before[before.length - 1], 1)[0];
        console.log('move before pick', pick);

        if (!pick) return;

        const toParent = this.getNodeAtPos(after.slice(0, after.length - 1));
        take(toParent).children?.splice?.(after[after.length - 1], 0, pick!);
      }
      // dirty = 'move';
      update();
    },
  };

  return helper;
};
