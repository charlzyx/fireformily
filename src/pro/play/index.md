---
group:
  title: DEV PLAY 演练场
  order: 9999
---

# useLatest

diff  ref, memo, deps -> useLatest

```tsx
import React, { useCallback, useRef, useEffect, useMemo, useState } from 'react'
import { useLatest } from 'ahooks';

import { Button } from 'antd'

const Inner = (props) => {
  const count = useRef(0);
  const refs = useRef({
    fn: props.fn
  });

  const llrefs = useLatest({
    fn: props.fn
  })

  const oh = useRef(llrefs);


  const memo = useMemo(() => {
    return props.fn;
  }, []);

  const watch = useMemo(() => {
    return props.fn;
  }, [props.fn]);

  // 巧了， useLatest 内部就是这样实现的
  // refs.current.fn = props.fn;


  return <div style={{border: "1px solid gold" }}>
    <div>{count.current++}</div>
    <div>OHHH::: {oh.current === llrefs ?'YES':'NO'}</div>
    <div onClick={() => props.fn()}>click props </div>
    <div>llrefs vs props : {llrefs.current.fn === props.fn ? "YES" :"NO"}</div>
    <div onClick={() => llrefs.current.fn()}>click resfs </div>
    <div>refs vs props : {refs.current.fn === props.fn ? "YES" :"NO"}</div>
    <div onClick={() => refs.current.fn()}>click resfs </div>
    <div>memo vs props : {props.fn === memo ? "YES": "NO"}</div>
    <div onClick={() => memo()}>click watch </div>
    <div>watch vs props : {props.fn === watch ? "YES": "NO"}</div>
    <div onClick={() => watch()}>click watch </div>
  </div>
}

const App = () => {
  const [ count, setCount ] = useState(0);
  const ok = useCallback(() => {
    console.log('app count ', count)
  }, [])
  return <div>
    <div onClick={() => setCount(count+1)}>ADD {count}</div>
    <Inner fn={() => {
      console.log('app count ', count)
    }}></Inner>
  </div>
}

export default App;

```
