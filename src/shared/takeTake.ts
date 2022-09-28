export const takeTake =
  (names: { title: string; key: string; children: string }) =>
  <T extends any>(o: T) => {
    return {
      get key(): React.Key | undefined {
        return o ? (o as any)[names.key] : o;
      },
      set key(neo: any) {
        if (typeof o !== 'object') return;
        (o as any)[names.key] = neo;
      },
      get title(): string | undefined {
        return o ? (o as any)[names.title] : o;
      },
      set title(neo: any) {
        if (typeof o !== 'object') return;
        (o as any)[names.title] = neo;
      },
      get children(): undefined | any[] {
        return o ? (o as any)[names.children] : o;
      },
      set children(neo: any) {
        if (typeof o !== 'object') return;
        (o as any)[names.children] = neo;
      },
    };
  };
