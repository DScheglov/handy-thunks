import { ensureAsyncCompose } from './helpers/promises';


const loading = (start, end) => (...loadingArgs) => thunk => (
  (...args) => dispatch => {
    if (typeof start === 'function') {
      dispatch(
        start(...loadingArgs)
      );
    }

    const asyncThunk = ensureAsyncCompose(dispatch, thunk);

    const promise = asyncThunk(...args);

    if (typeof end === 'function') {
      // Prventing promise leaks by returning new promise
      return promise.finally(
        () => dispatch(end(...loadingArgs))
      );
    }
    
    return promise;
  }
);

export default loading;
