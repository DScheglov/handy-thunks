# `loading(start, end)(...loadingArgs)(thunk)`

```js
loading(start: Action|Thunk, end: Action|Thunk)(...laodingArgs: any[])(thunk: Thunk|Action): Thunk;
```

Creates a new **thunk** that dispatches `startAction` before calling original **thunk** and `endAction` after the promise returned by original **thunk** resolves or rejects. 

[![Edit Loading Sample](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/r1ll280r5p?autoresize=1&hidenavigation=1&module=%2Fsrc%2Findex.js)