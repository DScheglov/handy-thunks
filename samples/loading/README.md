# `loading(start, end)(...loadingArgs)(thunk)`

```js
loading(start: Action|Thunk, end: Action|Thunk)(...laodingArgs: mixed[])(thunk: Thunk|Action): Thunk;
```

Creates a new **thunk** that dispatches `startAction` before calling original **thunk** and `endAction` after the promise returned by original **thunk** resolves or rejects. 