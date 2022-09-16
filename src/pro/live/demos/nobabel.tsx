import { useLive } from 'fireformily';
import { Observer } from '@formily/react';
import React from 'react';

const App = () => {
  const data = useLive({ count: 1, input: '' });

  return (
    <Observer>
      {() => {
        return (
          <div>
            <input
              type="text"
              value={data.input}
              onChange={(e) => (data.input = e.target.value)}
            />

            <div>
              <div>{data.input}</div>
              <div>{data.count}</div>
              <div
                onClick={() => {
                  data.count++;
                  data.count++;
                  data.input = data.count.toString();
                }}
              >
                ADD
              </div>
            </div>
          </div>
        );
      }}
    </Observer>
  );
};

export default App;
