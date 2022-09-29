export const stringify = (o: any): string => {
  const seens = new WeakMap();
  const serialize = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(serialize);
    } else if (typeof obj === 'function') {
      return `f ${obj.displayName || obj.name}(){ }`;
    } else if (typeof obj === 'object') {
      if (seens.get(obj)) return '#CircularReference';
      if (!obj) return obj;
      if ('$$typeof' in obj && '_owner' in obj) {
        seens.set(obj, true);
        return '#ReactNode';
      } else if (obj.toJS) {
        seens.set(obj, true);
        return obj.toJS();
      } else if (obj.toJSON) {
        seens.set(obj, true);
        return obj.toJSON();
      } else {
        seens.set(obj, true);
        const result = {};
        for (let key in obj) {
          (result as any)[key] = serialize(obj[key]);
        }
        seens.set(obj, false);
        return result;
      }
    }
    return obj;
  };
  return JSON.stringify(serialize(o), null, 2);
};
