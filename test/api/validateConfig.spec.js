import validateConfig from '../../src/api/validateConfig';

describe('validateConfig', () => {
  it('throws when not provide an url', () => {
    expect(() => validateConfig('my', { list: { method: 'get' } })).toThrow();
  });

  it('throws when provide payload as a url param', () => {
    expect(() => validateConfig('my', { list: { url: 'path/:payload', method: 'get' } })).toThrow();
  });

  it('throws when not provide a method', () => {
    expect(() => validateConfig('my', { list: { url: 'path/:id' } })).toThrow();
  });

  it('throws when modifier is not a function', () => {
    expect(() =>
      validateConfig('my', { list: { url: 'path/:id', method: 'save', modifier: {} } })
    ).toThrow();
  });

  it('throws when namespace is not a string', () => {
    expect(() =>
      validateConfig(1, {
        list: { url: 'path/:id', method: 'save', modifier: '' }
      })
    ).toThrow();
  });

  it('should not throw when provide a valid config', () => {
    expect(() =>
      validateConfig('my', { list: { url: 'path/:id', method: 'save', modifier: () => {} } })
    ).not.toThrow();
  });
});
