import { createAction } from 'redux-actions';

import createStore from './__utils__/createStore';
import createThunk from '../src/createThunk';
import createAsyncThunk from './__utils__/createAsyncThunk';
import manage from './__utils__/managed';
import idX from '../src/idX';

describe('creators.createThunk', () => {
  test('it should create a thunk with getState and dispatch', () => {
    const store = createStore();
    const newThunk = createThunk()(
      (dispatch, getState) => {
        expect(getState).toBe(store.getState);
        dispatch({ type: 'ACTION' });
        expect(
          getState().allActions
        ).toEqual([
          { type: 'ACTION' }
        ]);
      }
    );

    expect(newThunk).toBeInstanceOf(Function);
    expect(newThunk()).toBeInstanceOf(Function);

    store.dispatch(
      newThunk()
    );
  });

  test('it should create a thunk with getState if selectors is not an array, object or function', () => {
    const store = createStore();
    const newThunk = createThunk(undefined, 'hello')(
      (dispatch, getState) => {
        expect(getState).toBe(store.getState);
        dispatch({ type: 'ACTION' });
        expect(
          getState().allActions
        ).toEqual([
          { type: 'ACTION' }
        ]);
      }
    );

    expect(newThunk).toBeInstanceOf(Function);
    expect(newThunk()).toBeInstanceOf(Function);

    store.dispatch(
      newThunk()
    );
  });

  test('it should possible to create a thunk from function with bound actions', () => {
    const action1 = createAction('ACTION::1');
    const action2 = createAction('ACTION::2');
    const thunk = value => dispatch => [
      action2(value),
      action1(value),
    ].forEach(dispatch);

    const { dispatch, getState } = createStore();
    
    const newThunk = createThunk({ action1, action2, thunk })(
      ({ action1, action2, thunk }, getState) => {
        action1(getState().allActions.length);
        action2(getState().allActions.length);
        thunk({ value: getState().allActions.length });
      }
    );

    expect(newThunk).toBeInstanceOf(Function);

    const action = newThunk();

    expect(action).toBeInstanceOf(Function);

    dispatch(action);

    expect(
      getState().allActions
    ).toEqual([
      { type: 'ACTION::1', payload: 0 },
      { type: 'ACTION::2', payload: 1 },
      { type: 'ACTION::2', payload: { value: 2 } },
      { type: 'ACTION::1', payload: { value: 2 } },
    ]);
  });

  test('it should be possible to create a thunk with selectors bound to getState and bound actions', () => {
    const store = createStore();
    const selectors = {
      getActions: state => state.allActions,
      getActionByIndex: (state, index) => state.allActions[index],
    };
    
    const actions = {
      action1: createAction('ACTION::1'),
      action2: createAction('ACTION::2'),
    };

    const newThunk = createThunk(actions, selectors)(
      ({ action1, action2 }, { getActions, getActionByIndex }, index) => {
        action1(1);
        action2(2);
        expect(
          getActions()
        ).toEqual([
          { type: 'ACTION::1', payload: 1 },
          { type: 'ACTION::2', payload: 2 },
        ]);
        expect(
          getActionByIndex(index)
        ).toBe(
          getActions()[index]
        );
      }
    );

    store.dispatch(
      newThunk(1)
    );
  });

  test('it should be possible to create a thunk with array of selectors bound to getState and bound actions', () => {
    const store = createStore();
    const selectors = [
      state => state.allActions,
      (state, index) => state.allActions[index],
    ];
    
    const actions = {
      action1: createAction('ACTION::1'),
      action2: createAction('ACTION::2'),
    };

    const newThunk = createThunk(actions, selectors)(
      ({ action1, action2 }, [getActions, getActionByIndex], index) => {
        action1(1);
        action2(2);
        expect(
          getActions()
        ).toEqual([
          { type: 'ACTION::1', payload: 1 },
          { type: 'ACTION::2', payload: 2 },
        ]);
        expect(
          getActionByIndex(index)
        ).toBe(
          getActions()[index]
        );
      }
    );

    store.dispatch(
      newThunk(1)
    );
  });

  test('it should allow to work with async functions', () => {
    expect.assertions(3);
    const store = createStore();
    const selectors = [
      state => state.allActions,
      (state, index) => state.allActions[index],
    ];

    const api = manage(idX);
      
    const actions = {
      action1: createAction('ACTION::1'),
      action2: createAction('ACTION::2'),
      thunk1: createAsyncThunk(
        api,
        createAction('ACTION::SUCCESS'),
        createAction('ACTION::FAIL')
      )
    };
  
    const newThunk = createThunk(actions, selectors)(
      async ({ action1, action2, thunk1 }, [getActions, getActionByIndex], index) => {
        const res = await thunk1('async thunk call');

        // assertion 1: checking the expected result of async thunk
        expect(res).toEqual(
          { type: 'ACTION::SUCCESS', payload: 'async thunk call' }
        );
        action1(1);
        action2(2);

        // assertion 2: three actions should be dispatched and accessible through selectors
        expect(
          getActions()
        ).toEqual([
          { type: 'ACTION::SUCCESS', payload: 'async thunk call' },
          { type: 'ACTION::1', payload: 1 },
          { type: 'ACTION::2', payload: 2 },
        ]);

        // assertion 3: the `index`-th action should be returned
        expect(
          getActionByIndex(index)
        ).toBe(
          getActions()[index]
        );
      }
    );
  
    const promise = store.dispatch(newThunk(1));

    setImmediate(api.resolve);
    return promise;
  });
});