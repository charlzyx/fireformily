import React from 'react';
import { useLive } from 'fireformily';
// 下面这行其实不用写, 就是 dumi 在 build demo 的时候没有把自定义的 babel 插件用上, 写这里就为了demo 能 run 起来
import { Observer as FormilyObserverWrapper } from '@formily/react';
// 下面这行其实不用写, 就是 dumi 在 build demo 的时候没有把自定义的 babel 插件用上, 写这里就为了demo 能 run 起来
const onlyfordoc = FormilyObserverWrapper;

const TodoList = () => {
  const $todos = useLive<{ title: string; done: boolean }[]>([]);
// 下面这行其实不用写, 就是 dumi 在 build demo 的时候没有把自定义的 babel 插件用上, 写这里就为了demo 能 run 起来
  console.log('onlyfordoc', onlyfordoc)

  const getCount = () =>
    `${$todos.filter((x) => x.done).length}/${$todos.length}`;

  return (
    <div live>
      <h1>
        土豆丝 {getCount()}{' '}
        {$todos.length > 0 && $todos.every((x) => x.done) ? '🎉' : ''}
      </h1>

      <div>
        {$todos.map((item, idx) => {
          return (
            <div
              style={{
                width: '400px',
                display: 'flex',
                justifyContent: 'space-between',
                padding: 8,
              }}
              key={idx}
            >
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => {
                  item.done = !item.done;
                }}
              />
              <input
                value={item.title}
                type="text"
                onInput={(e) => {
                  item.title = (e.target as any).value;
                }}
              />
              <div
                onClick={() => {
                  $todos.splice(idx, 1);
                }}
              >
                丢到垃圾桶里面
              </div>
            </div>
          );
        })}
      </div>
      <div
        onClick={() => {
          $todos.push({ title: '', done: false });
        }}
      >
        点我!切一条新的土豆丝
      </div>
    </div>
  );
};

export default TodoList;
