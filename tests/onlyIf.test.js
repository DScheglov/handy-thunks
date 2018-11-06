import { createAction } from 'redux-actions';
import { onlyIf } from '../src';
import idX from '../src/helpers/idX';
import createStore from './__utils__/createStore';

describe('decorators.onlyIf', () => {
  test('it should create a new thunk', () => {
    const thunk = () => () => {};
    const newThunk = onlyIf(idX)(thunk);

    expect(newThunk).toBeInstanceOf(Function);
    expect(newThunk()).toBeInstanceOf(Function);
  });

  test('it should dispatch a thunk if predicate returns true', () => {
    const action = createAction('ACTION');
    const predicate = (...args) => args.length === 1; // isSingleArgPassed
    const thunk = jest.fn(
      (...args) => dispatch => dispatch(
        action(...args)
      )
    );
    const newThunk = onlyIf(predicate)(thunk);
    
    const { dispatch, getState } = createStore();

    dispatch(newThunk('single argument'));

    expect(thunk.mock.calls[0]).toEqual(['single argument']);
    expect(
      getState().allActions
    ).toEqual([
      { type: 'ACTION', payload: 'single argument' },
    ]);
  });

  test('it should not dispatch a thunk if predicate returns false', () => {
    const action = createAction('ACTION');
    const predicate = (...args) => args.length === 1; // isSingleArgPassed
    const thunk = jest.fn(
      (...args) => dispatch => dispatch(
        action(...args)
      )
    );
    const newThunk = onlyIf(predicate)(thunk);
    
    const { dispatch, getState } = createStore();

    dispatch(newThunk());

    expect(thunk.mock.calls).toEqual([]);
    expect(
      getState().allActions
    ).toEqual([]);
  });
});