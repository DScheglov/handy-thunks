import { createAction } from 'redux-actions';
import { followedBy } from '../src';
import createStore from './__utils__/createStore';


describe('decorators.followedBy', () => {
  test('should create a thunk', () => {
    const action = createAction('ACTION');
    const success = createAction('SUCCESS');
    const thunk = jest.fn(
      (...args) => dispatch => dispatch(action(...args))
    );
    
    const newThunk = followedBy(success)(thunk);
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

  test('it should not call followedBy if thunk failed', () => {
    expect.assertions(3);
    const success = jest.fn(createAction('followedBy'));
    const thunk = () => () => undefined['field'];

    const newThunk = followedBy(success)(thunk);
    
    const { dispatch, getState } = createStore();
    const promise = dispatch(newThunk());

    return promise.catch(
      err => {
        expect(err).toBeInstanceOf(TypeError);
        expect(success.mock.calls).toEqual([]);
        expect(getState().allActions).toEqual([]);
      }
    );
  });

  test('it should call followedBy if thunk succeeded', () => {
    expect.assertions(2);
    const success = createAction('SUCCESS');
    const action = createAction('ACTION');
    const thunk = payload => dispatch => dispatch(
      action(payload)
    );

    const newThunk = followedBy(success)(thunk);
    
    const { dispatch, getState } = createStore();
    const promise = dispatch(newThunk());

    return promise.then(
      action => {
        expect(action).toEqual({ type: 'SUCCESS', payload: { type: 'ACTION' } });
        expect(getState().allActions).toEqual([
          { type: 'ACTION' },
          { type: 'SUCCESS', payload: { type: 'ACTION' } },
        ]);
      }
    );
  });
});