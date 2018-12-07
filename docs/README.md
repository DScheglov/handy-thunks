# Table of Contents

- [README](../README.md)
- [Glossary](glossary.md)

## [Thunk Creators](creators/README.md)

- [createThunk(actionCreators, selectors)(thunk)](creators/createThunk.md)
- [select(selector)](creators/select.md)
- [voidThunk](creators/voidThunk.md)

## [Flow Compositors](compositors/README.md)

- [all(...thunks)](compositors/all) 
- [queue(...thunks)](compositors/queue)
- [chain(...thunks)](compositors/chain)

## [Thunk Decorators](decorators/README.md)

- [connected(selector)(thunk)](decorators/connected) 
- [loading(startAction, endAction)(...loadingArgs)(thunk)](decorators/loading)
- [fallback(fallbackThunk)(thunk)](decorators/fallback)
- [followedBy(nextThunk)(thunk)](decorators/followed-by)
- [cleanUp(cleaningThunk)(thunk)](decorators/clean-up)
- [onlyIf(predicate)(thunk)](decorators/only-if)
- [chained(keySelector)(thunk)](decorators/chained)
- [single(keySelector)(thunk)](decorators/single) 
- [postponed(delay, keySelector)(thunk)](decorators/postponed)
- [lazy(thunk)](decorators/lazy)

