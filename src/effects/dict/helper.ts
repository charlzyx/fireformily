import { colors, ColorsKey, PickArrayItem, TDictShape } from '../../shared';

export type TDictItem = Omit<PickArrayItem<TDictShape['options']>, 'key'>;

const getColorByIdx = (idx: number) =>
  colors[(idx % colors.length) as keyof typeof colors];

export const listToDict = (list: TDictItem[] = []): TDictShape => {
  const ret = {
    emap: list.reduce((ret: any, cur: any) => {
      ret[cur.value] = cur.label;
      ret[cur.label] = cur.value;
      return ret;
    }, {}),
    colors: list.reduce((ret: any, cur: any, idx) => {
      const color = cur.color || getColorByIdx(idx);
      ret[cur.value] = color;
      ret[cur.label] = color;
      return ret;
    }, {}),
    options: list.map((x, idx) => ({
      ...x,
      key: x.value,
      color: x.color || (getColorByIdx(idx) as ColorsKey),
    })),
  };
  return ret;
};

export const convertToDictList = <Row extends Object>(
  list: Row[],
  labelName: keyof Row = 'label' as any,
  valueName: keyof Row = 'value' as any,
) => {
  return list.map((x: any) => {
    return {
      key: x[valueName as string],
      label: x[labelName as string],
      value: x[valueName as string],
      color: x.color,
    };
  });
};

export const convertListToDict = <Row extends Object>(
  list: Row[],
  labelName: keyof Row = 'label' as any,
  valueName: keyof Row = 'value' as any,
) => {
  return listToDict(
    list.map((x: any) => {
      return {
        key: x[valueName as string],
        label: x[labelName as string],
        value: x[valueName as string],
        color: x.color,
      };
    }),
  );
};
