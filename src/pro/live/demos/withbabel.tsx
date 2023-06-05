import { useLive } from 'fireformily-v5';
import React from 'react';

const App = () => {
  const data = useLive({ count: 1, input: '' });
  return (
    <div live>
      <input type="text" value={data.input} onChange={(e) => (data.input = e.target.value)} />

      <div live>
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
};

export default App;
