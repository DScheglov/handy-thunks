import { voidThunk } from '../src';

describe('creators.voidThunk', () => {
  test('it should create a new thunk', () => {
    expect(voidThunk).toBeInstanceOf(Function);
    expect(voidThunk()).toBeInstanceOf(Function);
  });
});