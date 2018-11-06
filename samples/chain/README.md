# `chain(...thunks)`

```js
chain(...thunks: Array<Thunk|Action>): Thunk
```

Creates a new **thunk** that runs base thunks one by one and passes the result of previous **thunk** to the next one.