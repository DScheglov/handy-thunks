import { arg } from '../src/args';

describe('helpers.arg', () => {
  test('it should return a function', () => {
    const arg0 = arg(0);
    expect(arg0).toBeInstanceOf(Function);
  });

  test('arg(0) should create a function that returns the first argument', () => {
    const $1 = Symbol();
    const $2 = Symbol();
    const $3 = Symbol();
    expect(arg(0)($1, $2, $3)).toBe($1);
  });

  test('arg(1) should create a function that returns the second argument', () => {
    const $1 = Symbol();
    const $2 = Symbol();
    const $3 = Symbol();
    expect(arg(1)($1, $2, $3)).toBe($2);
  });

  test('arg(2) should create a function that returns the third argument', () => {
    const $1 = Symbol();
    const $2 = Symbol();
    const $3 = Symbol();
    expect(arg(2)($1, $2, $3)).toBe($3);
  });
});