/* eslint-disable no-shadow */
import { RecursionField, useFieldSchema } from '@formily/react';
import React from 'react';
import { isAdditionComponent } from '../shared';

export const useAddition = () => {
  const schema = useFieldSchema();
  return schema.reduceProperties((addition, schema, key) => {
    if (isAdditionComponent(schema)) {
      return <RecursionField schema={schema} name={key} />;
    }
    return addition;
  }, null);
};
