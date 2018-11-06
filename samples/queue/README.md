# `queue(arrayOfThunks)`

```js
queue(...thunks: Array<Action|Thunk>): Thunk
```

Creates a new **thunk** that runs base thunks one by one with arguments of new thunk