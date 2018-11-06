import { createAction } from 'redux-actions';
import { chained } from '../src';
import manage from './__utils__/managed';
import createStore from './__utils__/createStore';

describe('decorators.chained', () => {
  test('it should create a new thunk', () => {
    const thunk = () => () => {};
    const newThunk = chained()(thunk);
    expect(newThunk).toBeInstanceOf(Function);
    expect(newThunk()).toBeInstanceOf(Function);
  });

  test('it should chain dispatching thunk', () => {
    expect.assertions(5);
    const action = createAction('ACTION');
    const managed = [];
    const dispatcher = (...args) => dispatch => dispatch(action(...args));
    const getManaged = (...args) => {
      managed.push(manage(dispatcher(...args)));
      return managed[managed.length - 1];
    };

    const thunk = jest.fn(getManaged);
    const newThunk = chained()(thunk);

    const { dispatch, getState } = createStore();

    const promise = Promise.all([
      dispatch(newThunk(1)),
      dispatch(newThunk(2)),
    ]);

    setImmediate(() => {
      managed[0].resolve();
      expect(managed).toHaveLength(1);
      setImmediate(() => managed[1].resolve());
    });

    return promise.then(
      ([action1, action2]) => {
        expect(action1).toEqual({ type: 'ACTION', payload: 1 });
        expect(action2).toEqual({ type: 'ACTION', payload: 2 });
        expect(getState().allActions[0]).toBe(action1);
        expect(getState().allActions[1]).toBe(action2);
      }
    );
  });

  test('it should not prevent dispatching thunk if keys are different', () => {
    expect.assertions(4);
    const action = createAction('ACTION');
    const managed = [];
    const dispatcher = (...args) => dispatch => dispatch(action(...args));
    const getManaged = (...args) => {
      managed.push(manage(dispatcher(...args)));
      return managed[managed.length - 1];
    };

    const thunk = jest.fn(getManaged);
    const newThunk = chained(x => x)(thunk);

    const { dispatch, getState } = createStore();

    const promise = Promise.all([
      dispatch(newThunk(1)),
      dispatch(newThunk(2)),
    ]);

    setImmediate(() => {
      managed[0].resolve();
      managed[1].resolve();
    });

    return promise.then(
      ([action1, action2]) => {
        expect(action1).toEqual({ type: 'ACTION', payload: 1 });
        expect(action2).toEqual({ type: 'ACTION', payload: 2 });
        expect(getState().allActions[0]).toBe(action1);
        expect(getState().allActions[1]).toBe(action2);
      }
    );
  });
});