import {
  globalPolices,
  register,
  reset,
  getActionPolices,
} from '../src/polices';

beforeEach(() => {
  reset();
});

describe('reset', () => {
  it('should reset the globalPolices', () => {
    const police = store => done => (action, error, response) => done(action, error, response);
    police.applyPoint = 'beforeRequest';
    register('mypolice', police);

    expect(globalPolices.mypolice).not.toBe(undefined);
    reset();
    expect(globalPolices.mypolice).toBe(undefined);
  });
})

describe('register', () => {
  it('should register a police into global polices', () => {
    const police = store => done => (action, error, response) => done(action, error, response);
    police.applyPoint = 'beforeRequest';
    register('mypolice', police);

    expect(globalPolices.mypolice).toBe(police);
  });

  it('should throw when try to register a police more than once', () => {
    const police = store => done => (action, error, response) => done(action, error, response);
    police.applyPoint = 'beforeRequest';
    register('mypolice', police);

    expect(() => register('mypolice', police)).toThrow();
  });

  it('should validate a police', () => {
    // police without applyPoint
    const police = store => done => (action, error, response) => done(action, error, response);
    expect(() => register('mypolice', police)).toThrow();
    reset();
    //invalid applyPoing
    police.applyPoint = 'beforeReques';
    expect(() => register('mypolice', police)).toThrow();
  });
});

describe('getActionPolices', () => {
  test('should get the police runner for the given police array', (done) => {
    const police = store => done => (action, error, response) => {
      done({ ...action, myPoliceWasHere: true }, error, response);
    };
    police.applyPoint = 'beforeRequest';
    register('mypolice', police);

    const myAction = { type: 'REQUEST' };
    const runner = getActionPolices(['mypolice']);
    const callback = (action) => {
      expect(action.myPoliceWasHere).toBe(true);
      done();
    };
    const result = runner('beforeRequest')({})(callback)(myAction, null, null);
  });

  test('should run even without polices registered', (done) => {
    const myAction = { type: 'REQUEST' }
    const runner = getActionPolices(undefined);
    const callback = (action) => {
      expect(action).toBe(myAction);
      done();
    };
    const result = runner('beforeRequest')({})(callback)(myAction, null, null);
  });
});






