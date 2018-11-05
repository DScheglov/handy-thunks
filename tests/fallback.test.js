import { createAction } from 'redux-actions';
import fallback from '../src/fallback';
import idX from '../src/helpers/idX';
import manage from './__utils__/managed';
import createStore from './__utils__/createStore';

describe('decorators.fallback', () => {
  test('should create a thunk', () => {
    const action = createAction('ACTION');
    const fail = createAction('FAIL');
    const thunk = jest.fn(
      (...args) => dispatch => dispatch(action(...args))
    );
    
    const newThunk = fallback(fail)(thunk);
    expect(newThunk).toBeInstanceOf(Function);
    expect(newThunk()).toBeInstanceOf(Function);

    const { dispatch, getState } = createStore();

    dispatch(newThunk());

    expect(
      thunk.mock.calls[0]
    ).toEqual([]);

    expect(getState().allActions).toEqual([
      { type: 'ACTION' }
    ]);
  });

  test('it should call fallback if thunk failed', () => {
    expect.assertions(2);
    const fail = createAction('FAIL');
    const thunk = () => () => undefined['field'];

    const newThunk = fallback(fail)(thunk);
    
    const { dispatch, getState } = createStore();
    const promise = dispatch(newThunk());

    return promise.then(
      err => {
        expect(err).toMatchObject({ type: 'FAIL' });
        expect(getState().allActions[0]).toMatchObject({ type: 'FAIL' });
      }
    );
  });
});