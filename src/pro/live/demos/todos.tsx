import React from 'react';
import { useLive } from 'fireformily';

const TodoList = () => {
  const $todos = useLive<{ title: string; done: boolean }[]>([]);

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
