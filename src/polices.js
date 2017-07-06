import { compose } from 'redux';

/**
* This is a police manager, which is used to register,
* get and run polices over actions and responses
*
* A police is a middleware, and it should follow the signature bellow
* store => done => (action, error, response) => done(action, error, response);
* A police must have a applyPoint property. The available apply points are:
* 'beforeRequest', 'onResponse'
*/

const applyPoints = ['beforeRequest', 'onResponse'];

export const globalPolices = {};

export const reset = () => {
  Object.keys(globalPolices).forEach((key) => {
    delete globalPolices[key];
  });
};

export const register = (name, police) => {
  if (globalPolices[name]) {
    throw new Error(`Called register with police: ${name} more than once`);
  }

  if (applyPoints.indexOf(police.applyPoint) < 0) {
    const invalid = `Invalid applyPoint: ${police.applyPoint}, provided with police: ${name}.`;
    const available = `The apply points available are: ${applyPoints.join(', ')}`;
    throw new Error(`${invalid} ${available}`);
  }
  Object.assign(globalPolices, { [name]: police })
};

const get = policeNames => (applyPoint) => {
  const polices = policeNames
    .map(name => globalPolices[name])
    .filter(police => police.applyPoint === applyPoint);

  return store => done => {
    const chain = polices.map(police => police(store));
    return compose(...chain)(done);
  };
};

export const getActionPolices = (polices) => {
  if (Array.isArray(polices)) {
    const policeNames = Object.keys(globalPolices).filter(key => polices.indexOf(key) >= 0);
    return get(policeNames);
  }
  return get([]);
};

export default {
  globalPolices,
  register,
  getActionPolices,
  reset,
};
