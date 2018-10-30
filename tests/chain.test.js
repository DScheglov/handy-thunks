import { createAction } from 'redux-actions';

import chain from '../src/chain';

import createAsyncThunk from './__utils__/createAsyncThunk';
import createStore from './__utils__/createStore';
import manage from './__utils__/managed';

describe('flow.chain', () => {
  test('should be possible to compose two thunks', () => {
    expect.assertions(7);

    const success1 = createAction('SUCCESS::1');
    const success2 = createAction('SUCCESS::2');
    const fail = createAction('FAIL');

    const fn1 = manage(x => x);
    const fn2 = manage(x => x);

    const thunk1 = jest.fn(createAsyncThunk(fn1, success1, fail));
    const thunk2 = jest.fn(createAsyncThunk(fn2, success2, fail));

    const newThunk = chain([thunk1, thunk2]);

    const { dispatch, getState } = createStore();

    // assertion 1: ensuring initial state
    expect(getState().allActions).toEqual([]);

    let promise = dispatch(newThunk('first'));

    // assertion 2: checking if dispatching newThunk returns a Promise
    expect(promise).toBeInstanceOf(Promise);

    promise = promise.then(
      () => {
        // assertion 6: both thunks should be called
        expect([
          thunk1.mock.calls,
          thunk2.mock.calls,
        ]).toEqual([ [['first']], [[{ type: 'SUCCESS::1', payload: 'first' }]] ]);


        // assertion 7: checking if both actions are dispatched
        expect(getState().allActions).toEqual([
          { type: 'SUCCESS::1', payload: 'first' },
          { type: 'SUCCESS::2', payload: { type: 'SUCCESS::1', payload: 'first' } },
        ]);
      }
    );
    
    // assertion 3: the first thunk should be called (in the current task), but the second shoud be not
    expect([
      thunk1.mock.calls,
      thunk2.mock.calls.length,
    ]).toEqual([ [['first']], 0]);

    setImmediate(
      () => {
        // assertion 4: state should not be changed
        expect(getState().allActions).toEqual([]);

        fn1.resolve();

        setImmediate(
          () => {
            // assertion 5: thunk1 should be processed
            expect(getState().allActions).toEqual([
              { type: 'SUCCESS::1', payload: 'first' },
            ]);

            fn2.resolve();
          });
      });

    return promise;
  });

  test('should be possible to compose thunks with regular actions', () => {
    expect.assertions(7);

    const success1 = createAction('SUCCESS::1');
    const success2 = createAction('SUCCESS::2');
    const action1 = createAction('ACTION::REGULAR::1');
    const action2 = createAction('ACTION::REGULAR::2');
    const fail = createAction('FAIL');

    const fn1 = manage(x => x);
    const fn2 = manage(x => x);

    const thunk1 = jest.fn(createAsyncThunk(fn1, success1, fail));
    const thunk2 = jest.fn(createAsyncThunk(fn2, success2, fail));

    const newThunk = chain([thunk1, action1, thunk2, action2]);

    const { dispatch, getState } = createStore();

    // assertion 1: ensuring initial state
    expect(getState().allActions).toEqual([]);

    let promise = dispatch(newThunk('first'));

    // assertion 2: checking if dispatching newThunk returns a Promise
    expect(promise).toBeInstanceOf(Promise);

    promise = promise.then(
      () => {
        // assertion 6: both thunks should be called
        expect([
          thunk1.mock.calls,
          thunk2.mock.calls,
        ]).toEqual([ [['first']], [
          [{ type: 'ACTION::REGULAR::1', payload: { type: 'SUCCESS::1', payload: 'first' } }]
        ] ]);

        // assertion 7: checking if both actions are dispatched
        expect(getState().allActions).toEqual([
          { type: 'SUCCESS::1', payload: 'first' },
          {
            type: 'ACTION::REGULAR::1', 
            payload: { type: 'SUCCESS::1', payload: 'first' } 
          },
          {
            type: 'SUCCESS::2',
            payload: {
              type: 'ACTION::REGULAR::1', 
              payload: { type: 'SUCCESS::1', payload: 'first' } 
            }
          },
          {
            type: 'ACTION::REGULAR::2',
            payload: {
              type: 'SUCCESS::2',
              payload: {
                type: 'ACTION::REGULAR::1',
                payload: { type: 'SUCCESS::1', payload: 'first' } 
              }
            } 
          },
        ]);
      }
    );
    
    // assertion 3: state should not be changed
    expect(getState().allActions).toEqual([]);

    // assertion 4: the first thunk should be called in the same task, but the second shoud be not
    expect([
      thunk1.mock.calls,
      thunk2.mock.calls.length,
    ]).toEqual([ [['first']], 0]);

    setImmediate(() => {
      fn1.resolve();

      setImmediate(() => {
        // assertion 5: thunk1 and frist regular action should be dispatched
        expect(getState().allActions).toEqual([
          { type: 'SUCCESS::1', payload: 'first' },
          { type: 'ACTION::REGULAR::1', payload: { type: 'SUCCESS::1', payload: 'first' } },
        ]);

        fn2.resolve();
      });
    });

    return promise;
  });

  test('should be possible to compose thunks with regular actions (starting with regular)', () => {
    expect.assertions(7);

    const success1 = createAction('SUCCESS::1');
    const success2 = createAction('SUCCESS::2');
    const action0 = createAction('ACTION::REGULAR::0');
    const action1 = createAction('ACTION::REGULAR::1');
    const action2 = createAction('ACTION::REGULAR::2');
    const fail = createAction('FAIL');

    const fn1 = manage(x => x);
    const fn2 = manage(x => x);

    const thunk1 = jest.fn(createAsyncThunk(fn1, success1, fail));
    const thunk2 = jest.fn(createAsyncThunk(fn2, success2, fail));

    const newThunk = chain([action0, thunk1, action1, thunk2, action2]);

    const { dispatch, getState } = createStore();

    // assertion 1: ensuring initial state
    expect(getState().allActions).toEqual([]);

    let promise = dispatch(newThunk('first'));

    // assertion 2: checking if dispatching newThunk returns a Promise
    expect(promise).toBeInstanceOf(Promise);

    promise = promise.then(
      () => {
        // assertion 6: both thunks should be called
        expect([
          thunk1.mock.calls,
          thunk2.mock.calls,
        ]).toEqual([
          [ [{ type: 'ACTION::REGULAR::0', payload: 'first' }] ],
          [ [{
            type: 'ACTION::REGULAR::1',
            payload: {
              type: 'SUCCESS::1',
              payload: { type: 'ACTION::REGULAR::0', payload: 'first' }
            }
          }] ]
        ]);

        // assertion 7: checking if both actions are dispatched
        expect(getState().allActions).toEqual([
          { type: 'ACTION::REGULAR::0', payload: 'first' },
          {
            type: 'SUCCESS::1',
            payload: { type: 'ACTION::REGULAR::0', payload: 'first' }
          },
          {
            type: 'ACTION::REGULAR::1',
            payload: {
              type: 'SUCCESS::1',
              payload: { type: 'ACTION::REGULAR::0', payload: 'first' }
            }
          },
          {
            type: 'SUCCESS::2',
            payload: {
              type: 'ACTION::REGULAR::1',
              payload: {
                type: 'SUCCESS::1',
                payload: { type: 'ACTION::REGULAR::0', payload: 'first' }
              }
            }
          },
          {
            type: 'ACTION::REGULAR::2',
            payload: {
              type: 'SUCCESS::2',
              payload: {
                type: 'ACTION::REGULAR::1',
                payload: {
                  type: 'SUCCESS::1',
                  payload: {
                    type: 'ACTION::REGULAR::0',
                    payload: 'first' 
                  }
                }
              }
            }
          }
        ]);
      }
    );

    // assertion 3: action0 should be dispatched in the same task
    expect(getState().allActions).toEqual([
      { type: 'ACTION::REGULAR::0', payload: 'first' },
    ]);

    setImmediate(() => {
      // assertion 4: the frist thunks should be called with the action0
      expect([
        thunk1.mock.calls,
        thunk2.mock.calls.length,
      ]).toEqual([
        [ [{ type: 'ACTION::REGULAR::0', payload: 'first' }] ],
        0
      ]);

      fn1.resolve();

      setImmediate(() => {
        // assertion 5: action0, thunk1 and action1 should be dispatched
        expect(getState().allActions).toEqual([
          { type: 'ACTION::REGULAR::0', payload: 'first' },
          {
            type: 'SUCCESS::1',
            payload: { type: 'ACTION::REGULAR::0', payload: 'first' }
          },
          {
            type: 'ACTION::REGULAR::1',
            payload: {
              type: 'SUCCESS::1',
              payload: { type: 'ACTION::REGULAR::0', payload: 'first' }
            }
          },
        ]);

        fn2.resolve();
      });
    });

    return promise;
  });
});