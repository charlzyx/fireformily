import jsonp from 'fetch-jsonp';
import qs from 'qs';

export const suggest = (params: object & { kw: string }) => {
  console.log('search params', params);
  const str = qs.stringify({
    code: 'utf-8',
    q: params.kw,
  });
  return jsonp(`https://suggest.taobao.com/sug?${str}`)
    .then((response: any) => response.json())
    .then((d: any) => {
      const { result } = d;
      const data: { label: string; value: string }[] = result.map((item: any) => {
        return {
          value: item[0] as string,
          label: item[0] as string,
        };
      });
      return data;
    });
};
