/* eslint-disable no-shadow */
import { RecursionField, useFieldSchema } from '@formily/react';
import React from 'react';
import { isToolbarComponent } from '../shared';

export const useToolbar = () => {
  const schema = useFieldSchema();
  const maybe = schema.reduceProperties((toolbar, schema, key) => {
    if (toolbar) return toolbar;
    if (isToolbarComponent(schema)) {
      return <RecursionField schema={schema} name={key} />;
    } else {
      return toolbar;
    }
  }, null);
  return maybe;
};
