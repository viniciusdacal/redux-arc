import parseUrl from '../../src/api/parseUrl';


describe('parseUrl', () => {
  it('should ignore url without params', () => {
    expect(parseUrl('regular/endpoint')).toBe('regular/endpoint');
  });

  it('should throw if param isnt present', () => {
    expect(() => parseUrl('endpoint/:myparam', {})).toThrow(
      'Param myparam from url endpoint/:myparam, not found in params object'
    );
  });

  it('should parse params', () => {
    expect(parseUrl('endpoint/:myparam', { myparam: 'hey-ho'})).toBe('endpoint/hey-ho');
  });
});
