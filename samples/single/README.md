# `single(keySelector)(thunk)`

```js
type KeySelector: (...args: Array<*>) => string|number|boolean;

single(keySelector?: KeySelector)(thunk: Action|Thunk): Thunk;
```

Creates a new **thunk** that prevents dispatching an original thunk if while promise returned by the previous call is pending. 

`keySelector` allows to separate calls with different promise chains.