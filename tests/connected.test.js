import { connected } from '../src';

import createStore from './__utils__/createStore';


describe('decorators.connected', () => {
  test('it should allow to path state to the thunk', () => {
    const initialState = {
      value: 'the root value',
    };

    const root = (state = initialState) => state;

    const { dispatch, getState } = createStore({ root });

    const thunk = jest.fn(
      () => () => {} // it is a void thunk
    );

    const newThunk = connected(x => x)(thunk);

    dispatch(newThunk());

    expect(
      thunk.mock.calls[0][0]
    ).toBe( // checking reference
      getState()
    );
  });
  
  test('it should allow to path several state branches to the thunk', () => {
    const root = (state = 'root value') => state;
    const branchA = (state = 2) => state;
    const branchB = (state = [1, 2, 3]) => state;

    const { dispatch } = createStore({ root, branchA, branchB });

    const thunk = jest.fn(
      () => () => {} // it is a void thunk
    );

    const newThunk = connected(
      ({ root, branchA, branchB }, ...args) => [
        root, branchA, branchB, ...args
      ]
    )(thunk);

    dispatch(newThunk());

    expect(
      thunk.mock.calls[0]
    ).toEqual([
      [ 'root value', 2, [1, 2, 3] ]
    ]);

    dispatch(newThunk('hi', 'there'));

    expect(
      thunk.mock.calls[1]
    ).toEqual([
      [ 'root value', 2, [1, 2, 3], 'hi', 'there' ]
    ]);
  });

  test('it should allow to path state branch to the regular action', () => {
    const initialState = {
      value: 'the root value',
    };

    const root = (state = initialState) => state;

    const { dispatch, getState } = createStore({ root });

    const action = jest.fn(
      payload => ({ type: 'MY_ACTION', payload })
    );

    const newThunk = connected(state => state.root)(action);

    dispatch(newThunk());

    expect(
      action.mock.calls[0][0]
    ).toBe( // checking reference
      initialState
    );

    expect(
      getState().allActions
    ).toEqual([
      { type: 'MY_ACTION', payload: { value: 'the root value' } }
    ]);
  });
  
});