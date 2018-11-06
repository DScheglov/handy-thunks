import { createAction } from 'redux-actions';
import { lazy } from '../src';

import manage from './__utils__/managed';
import createStore from './__utils__/createStore';

describe('decorators.lazy', () => {
  test('it should create a new thunk', () => {
    const thunk = () => () => {};
    const newThunk = lazy(thunk);
    expect(newThunk).toBeInstanceOf(Function);
    expect(newThunk()).toBeInstanceOf(Function);
  });

  test('it should dispatch start and end actions if thunk failed', () => {
    expect.assertions(1);
    const action = createAction('ACTION');
    const managed = manage(
      dispatch => dispatch(action())
    );
    const thunk = () => managed;

    const newThunk = lazy(thunk);
    const { dispatch, getState } = createStore();

    const promise = dispatch(newThunk());

    setImmediate(() => {
      managed.resolve();
    });

    return promise.then(
      () => {
        expect(getState().allActions).toEqual([]);
      }
    );
  });
});