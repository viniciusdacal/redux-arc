export const globalPolices = {};


export const onCallApply = jest.fn((applyPoint) => store => done =>
  (action, error, response) => done(action, error, response));

const get = policeNames => onCallApply;

export const getActionPolices = jest.fn((polices) => {
  if (Array.isArray(polices)) {
    return get(polices);
  }
  return get([]);
});

export default {
  onCallApply,
  globalPolices,
  getActionPolices,
};
