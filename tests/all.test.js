import { createAction } from 'redux-actions';

import all from '../src/all';

import createAsyncThunk from './__utils__/createAsyncThunk';
import createStore from './__utils__/createStore';
import manage from './__utils__/managed';


describe('flow.all', () => {
  test('should be possible to compose two thunks', () => {
    expect.assertions(7);

    const success1 = createAction('SUCCESS::1');
    const success2 = createAction('SUCCESS::2');
    const fail = createAction('FAIL');

    const fn1 = manage(x => x);
    const fn2 = manage(x => x);

    const thunk1 = jest.fn(
      createAsyncThunk(fn1, success1, fail)
    );
    const thunk2 = jest.fn(
      createAsyncThunk(fn2, success2, fail)
    );

    const newThunk = all([thunk1, thunk2]);

    const { dispatch, getState } = createStore();

    // assertion 1: ensuring initial state
    expect(getState().allActions).toEqual([]);

    let promise = dispatch(newThunk('first'));

    // assertion 2: checking if dispatching newThunk returns a Promise
    expect(promise).toBeInstanceOf(Promise);

    promise = promise.then(
      () => {
        // assertion 7: checking if both actions are dispatched
        expect(getState().allActions).toEqual([
          { type: 'SUCCESS::1', payload: 'first' },
          { type: 'SUCCESS::2', payload: 'second' },
        ]);
      }
    );
    
    // assertion 3: both thunks should be called
    expect([
      thunk1.mock.calls,
      thunk2.mock.calls,
    ]).toEqual([ [['first']], [['first']] ]);

    // assertion 4: state should not be changed
    expect(getState().allActions).toEqual([]);

    fn1.resolve();

    // assertion 5: state should not be changed
    expect(getState().allActions).toEqual([]);

    fn2.resolve({ result: 'second' });

    // assertion 6: state should not be changed
    expect(getState().allActions).toEqual([]);

    return promise;
  });

  test('should be possible to compose two regular actions', () => {
    expect.assertions(4);

    const action1 = createAction('ACTION::1');
    const action2 = createAction('ACTION::2');

    const newThunk = all([action1, action2]);

    const { dispatch, getState } = createStore();

    // assertion 1: ensuring initial state
    expect(getState().allActions).toEqual([]);

    let promise = dispatch(newThunk('first'));

    // assertion 2: checking if dispatching newThunk returns a Promise
    expect(promise).toBeInstanceOf(Promise);

    promise = promise.then(
      () => {
        // assertion 4: checking if both actions are dispatched
        expect(getState().allActions).toEqual([
          { type: 'ACTION::1', payload: 'first' },
          { type: 'ACTION::2', payload: 'first' },
        ]);
      }
    );
    
    // assertion 3: state should be already changed due all actions are sync
    expect(getState().allActions).toEqual([
      { type: 'ACTION::1', payload: 'first' },
      { type: 'ACTION::2', payload: 'first' },
    ]);

    return promise;
  });

  test('should be possible to compose thunks and regular actions', () => {
    expect.assertions(6);

    const success1 = createAction('SUCCESS::1');
    const success2 = createAction('SUCCESS::2');
    const regularAction = createAction('ACTION::REGULAR');
    const fail = createAction('FAIL');

    const fn1 = manage(x => x);
    const fn2 = manage(x => x);

    const thunk1 = createAsyncThunk(fn1, success1, fail);
    const thunk2 = createAsyncThunk(fn2, success2, fail);

    const newThunk = all([thunk1, thunk2, regularAction]);

    const { dispatch, getState } = createStore();

    // assertion 1: ensuring initial state
    expect(getState().allActions).toEqual([]);

    let promise = dispatch(newThunk('first'));

    // assertion 2: checking if dispatching newThunk returns a Promise
    expect(promise).toBeInstanceOf(Promise);

    promise = promise.then(
      () => {
        // assertion 6: checking if both actions are dispatched
        expect(getState().allActions).toEqual([
          { type: 'ACTION::REGULAR', payload: 'first' },
          { type: 'SUCCESS::1', payload: 'first' },
          { type: 'SUCCESS::2', payload: 'second' },
        ]);
      }
    );
    
    // assertion 3: the regular action should be already dispatched
    expect(getState().allActions).toEqual([
      { type: 'ACTION::REGULAR', payload: 'first' }
    ]);

    fn1.resolve();

    // assertion 4: the regular action should be already dispatched
    expect(getState().allActions).toEqual([
      { type: 'ACTION::REGULAR', payload: 'first' }
    ]);

    fn2.resolve({ result: 'second' });

    // assertion 5: the regular action should be already dispatched
    expect(getState().allActions).toEqual([
      { type: 'ACTION::REGULAR', payload: 'first' }
    ]);

    return promise;
  });
});