import { useLive } from 'fireformily';
import React from 'react';
// 下面这行其实不用写, 就是 dumi 在 build demo 的时候没有把自定义的 babel 插件用上, 写这里就为了demo 能 run 起来
import { Observer as FormilyObserverWrapper } from '@formily/react';
// 下面这行其实不用写, 就是 dumi 在 build demo 的时候没有把自定义的 babel 插件用上, 写这里就为了demo 能 run 起来
const onlyfordoc = FormilyObserverWrapper;

const App = () => {
  const data = useLive({ count: 1, input: '' });
  // 下面这行其实不用写, 就是 dumi 在 build demo 的时候没有把自定义的 babel 插件用上, 写这里就为了demo 能 run 起来
  console.log('onlyfordoc', onlyfordoc)

  return (
    <div live>
      <input
        type="text"
        value={data.input}
        onChange={(e) => (data.input = e.target.value)}
      />

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
