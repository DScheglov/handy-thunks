import { ensureRejected } from '../src/helpers/promises';

describe('helperes.ensureRejected', () => {
  test('it should return the same promise if promise passed', () => {
    const p = Promise.reject();
    expect(
      ensureRejected(p)
    ).toBe(p);

    return p.catch(
      () => {}
    );
  });

  test('it should return a new promise if a not-promise passed', () => {
    expect.assertions(2);
    const promise = ensureRejected('string');
    expect(promise).toBeInstanceOf(Promise);

    const catcher = err => {
      expect(err).toBe('string');
    };
    return promise.catch(catcher);
  });
});