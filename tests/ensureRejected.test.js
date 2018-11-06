import { ensureRejected } from '../src/helpers/promises';

describe('helperes.ensureRejected', () => {
  test('it should return the same promise if promise passed', () => {
    const p = Promise.reject();
    expect(
      ensureRejected(p)
    ).toBe(p);
  });

  test('it should return a new promise if a not-promise passed', () => {
    expect(
      ensureRejected('string')
    ).toBeInstanceOf(Promise);
  });
});