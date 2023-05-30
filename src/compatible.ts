import { useField, useExpressionScope as useFormilyExpScope } from '@formily/react';

export const useExpressionScope = (): {
  $record: any;
  $lookup: any;
  $records: any[];
  $index: number;
} => {
  const field = useField();
  const scope = useFormilyExpScope();
  // https://github.com/alibaba/formily/releases/tag/v2.2.19
  //  >= 2.2.19
  return field.record && !scope.$record
    ? {
        $record: field.record,
        $lookup: field.records,
        $records: field.records,
        $index: field.index,
      }
    : scope;
};
