import validateConfig from '../src/validateConfig';

describe('validateConfig', () => {
  it('throws when provide a wrong url', () => {
    expect(() => validateConfig('my', { list: { url: 1 } })).toThrow();
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
