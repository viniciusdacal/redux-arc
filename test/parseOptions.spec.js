import parseOptions from '../src/parseOptions';

describe('parseOptions', () => {
  it('should return a parsed url accordingly to modifier method', () => {
    const modifier = options => ({ a: '1' });
    expect(parseOptions({}, modifier).a).toBe('1')

  });
  it('should return the same object option if there is no modifier', () => {
    const option = { b: 'TESTE' };
    expect(parseOptions(option)).toBe(option);
  })
});
