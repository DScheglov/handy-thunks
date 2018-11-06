# `loading(start, end)(...loadingArgs)(thunk)`

```js
loading(start: Action|Thunk, end: Action|Thunk)(...laodingArgs: any[])(thunk: Thunk|Action): Thunk;
```

Creates a new **thunk** that dispatches `startAction` before calling original **thunk** and `endAction` after the promise returned by original **thunk** resolves or rejects. 

<iframe src="https://codesandbox.io/embed/r1ll280r5p?autoresize=1&hidenavigation=1&module=%2Fsrc%2Findex.js" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>