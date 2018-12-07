import { select } from '../src';

import createStore from './__utils__/createStore';


describe('creators.select', () => {
  test('it should allow create a thunk that selects data from store', () => {
    const initialState = {
      value: 'the root value',
    };

    const root = (state = initialState) => state;

    const { dispatch } = createStore({ root });

    const newThunk = select(
      (state, branch) => state[branch]
    );
    expect(
      dispatch(newThunk('root'))
    ).toBe(initialState);

  });
  

});