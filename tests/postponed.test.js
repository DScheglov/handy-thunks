import { createAction } from 'redux-actions';

import { postponed } from '../src';
import manage from './__utils__/managed';
import createStore from './__utils__/createStore';

describe('decorators.postponed', () => {
  test('it should create a new thunk', () => {
    const thunk = () => () => {};
    const newThunk = postponed()(thunk);

    expect(newThunk).toBeInstanceOf(Function);
    expect(newThunk()).toBeInstanceOf(Function);
  });

  test('it should dispatch last called thunk during the single EventLoop task', () => {
    expect.assertions(3);
    const action = createAction('ACTION');
    const managed = [];
    const dispatcher = args => dispatch => dispatch(action(...args));
    const getManaged = (...args) => {
      managed.push(manage(dispatcher(args)));
      return managed[managed.length - 1];
    };

    const thunk = jest.fn(getManaged);
    const newThunk = postponed()(thunk);

    const { dispatch, getState } = createStore();

    const firstPromise = dispatch(newThunk(1));

    dispatch(newThunk(2));
    dispatch(newThunk(3));

    setTimeout(() => {
      expect(managed).toHaveLength(1);
      managed[0].resolve();
    });

    return firstPromise.then(
      action => {
        expect(action).toEqual({ type: 'ACTION', payload: 3 });
        expect(
          getState().allActions
        ).toEqual([
          { type: 'ACTION', payload: 3 }
        ]);
      }
    );
  });
});