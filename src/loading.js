import { compose } from 'redux';
import { ensureAsync } from './helpers/promises';


const loading = (start, end) => (...loadingArgs) => thunk => (
  (...args) => dispatch => {
    if (typeof start === 'function') {
      dispatch(
        start(...loadingArgs)
      );
    }

    const asyncThunk = ensureAsync(
      compose(dispatch, thunk)
    );

    const promise = asyncThunk(...args);

    if (typeof end === 'function') {
      promise.finally(
        () => dispatch(end(...loadingArgs))
      );
    }
    
    return promise;
  }
);

export default loading;
