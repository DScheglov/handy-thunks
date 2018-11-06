import { createAction } from 'redux-actions';
import { cleanUp } from '../src';
import createStore from './__utils__/createStore';


describe('decorators.cleanUp', () => {
  test('should create a thunk', () => {
    const action = createAction('ACTION');
    const fail = createAction('FAIL');
    const thunk = jest.fn(
      (...args) => dispatch => dispatch(action(...args))
    );
    
    const newThunk = cleanUp(fail)(thunk);
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

  test('it should call cleanUp if thunk failed', () => {
    expect.assertions(2);
    const clean = createAction('CLEANUP');
    const thunk = () => () => undefined['field'];

    const newThunk = cleanUp(clean)(thunk);
    
    const { dispatch, getState } = createStore();
    const promise = dispatch(newThunk());

    return promise.catch(
      err => {
        expect(err).toBeInstanceOf(TypeError);
        expect(getState().allActions[0]).toMatchObject({ type: 'CLEANUP' });
      }
    );
  });

  test('it should call cleanUp if thunk succeeded', () => {
    expect.assertions(2);
    const clean = createAction('CLEANUP');
    const action = createAction('ACTION');
    const thunk = payload => dispatch => dispatch(
      action(payload)
    );

    const newThunk = cleanUp(clean)(thunk);
    
    const { dispatch, getState } = createStore();
    const promise = dispatch(newThunk());

    return promise.then(
      action => {
        expect(action).toEqual({ type: 'ACTION' });
        expect(getState().allActions).toEqual([
          { type: 'ACTION' },
          { type: 'CLEANUP' },
        ]);
      }
    );
  });
});