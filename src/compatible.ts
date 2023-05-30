import { useField, useExpressionScope as useFormilyExpScope } from '@formily/react';

export const useExpressionScope = (): {
  $record: any;
  $lookup: any;
  $records: any[];
  $index: number;
  [k: `$${string}`]: any;
} => {
  const field = useField();
  const scope = useFormilyExpScope();
  // https://github.com/alibaba/formily/releases/tag/v2.2.19
  //  >= 2.2.19
  const fireformilyScope = scope.$record || scope.$query || scope.$pos;
  return !fireformilyScope
    ? {
        $record: field.record,
        $lookup: field.records,
        $records: field.records,
        $index: field.index,
      }
    : scope;
};
