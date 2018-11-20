import parseUrl from '../src/parseUrl';


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

  it('should ignore the begning of a absolute url', () => {
    expect(() => parseUrl('https://ds.devel.goben.rocks/api:8080', {})).not.toThrow();

    expect(parseUrl('https://ds.devel.goben.rocks/api:8080', {}))
      .toBe('https://ds.devel.goben.rocks/api:8080');
  });
});
