import { createAction } from 'redux-actions';
import { loading } from '../src';

import createStore from './__utils__/createStore';
import manage from './__utils__/managed';

describe('decorators.loading', () => {
  test('it should create a new thunk', () => {
    const start = createAction('START');
    const end = createAction('END');
    const thunk = () => () => {};

    const newThunk = loading(start, end)()(thunk);

    expect(newThunk).toBeInstanceOf(Function);
    expect(newThunk()).toBeInstanceOf(Function);
  });

  test('it should dispatch start and end actions if thunk succeeded', () => {
    expect.assertions(2);
    const start = createAction('START');
    const end = createAction('END');
    const action = createAction('ACTION');
    const managed = manage(
      dispatch => dispatch(action())
    );
    const thunk = () => managed;

    const newThunk = loading(start, end)()(thunk);
    const { dispatch, getState } = createStore();

    const promise = dispatch(newThunk());

    expect(
      getState().allActions
    ).toEqual([
      { type: 'START' },
    ]);

    setImmediate(
      managed.resolve
    );

    return promise.then(
      () => {
        expect(
          getState().allActions
        ).toEqual([
          { type: 'START' },
          { type: 'ACTION' },
          { type: 'END' },
        ]);
      }
    );
  });

  test('it should not dispatch start if it is not specified', () => {
    expect.assertions(2);
    const start = 'START';
    const end = createAction('END');
    const action = createAction('ACTION');
    const managed = manage(
      dispatch => dispatch(action())
    );
    const thunk = () => managed;

    const newThunk = loading(start, end)()(thunk);
    const { dispatch, getState } = createStore();

    const promise = dispatch(newThunk());

    expect(
      getState().allActions
    ).toEqual([]);

    setImmediate(
      managed.resolve
    );

    return promise.then(
      () => {
        expect(
          getState().allActions
        ).toEqual([
          { type: 'ACTION' },
          { type: 'END' },
        ]);
      }
    );
  });

  test('it should dispatch end if it is not specified', () => {
    expect.assertions(2);
    const start = createAction('START');
    const end = undefined;
    const action = createAction('ACTION');
    const managed = manage(
      dispatch => dispatch(action())
    );
    const thunk = () => managed;

    const newThunk = loading(start, end)()(thunk);
    const { dispatch, getState } = createStore();

    const promise = dispatch(newThunk());

    expect(
      getState().allActions
    ).toEqual([
      { type: 'START' },
    ]);

    setImmediate(
      managed.resolve
    );

    return promise.then(
      () => {
        expect(
          getState().allActions
        ).toEqual([
          { type: 'START' },
          { type: 'ACTION' },
        ]);
      }
    );
  });

  test('it should dispatch start and end actions if thunk failed', () => {
    expect.assertions(4);
    const start = createAction('START');
    const end = createAction('END');
    const action = createAction('ACTION');
    const managed = manage(
      dispatch => dispatch(action())
    );
    const thunk = () => managed;

    const newThunk = loading(start, end)()(thunk);
    const { dispatch, getState } = createStore();

    const promise = dispatch(newThunk());

    expect(
      getState().allActions
    ).toEqual([
      { type: 'START' },
    ]);

    setImmediate(
      () => {
        managed.reject({ result: new Error('Some Error') });
      }
    );

    return promise.catch(
      err => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe('Some Error');
        expect(getState().allActions).toEqual([
          { type: 'START' },
          { type: 'END' },
        ]);
      }
    );
  });
});