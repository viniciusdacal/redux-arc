import { compose } from 'redux';

/**
* This is a policy manager, which is used to register,
* get and run policies over actions and responses
*
* A policy is a middleware, and it should follow the signature bellow
* store => done => (action, error, response) => done(action, error, response);
* A policy must have a applyPoint property. The available apply points are:
* 'beforeRequest', 'onResponse'
*/

const applyPoints = ['beforeRequest', 'onResponse'];

export const globalPolicies = {};

export const reset = () => {
  Object.keys(globalPolicies).forEach((key) => {
    delete globalPolicies[key];
  });
};

export const register = (name, policy) => {
  if (globalPolicies[name]) {
    throw new Error(`Called register with policy: ${name} more than once`);
  }

  if (applyPoints.indexOf(policy.applyPoint) < 0) {
    const invalid = `Invalid applyPoint: ${policy.applyPoint}, provided with policy: ${name}.`;
    const available = `The apply points available are: ${applyPoints.join(', ')}`;
    throw new Error(`${invalid} ${available}`);
  }
  Object.assign(globalPolicies, { [name]: policy })
};

const get = policyNames => (applyPoint) => {
  const policies = policyNames
    .map(name => globalPolicies[name])
    .filter(policy => policy.applyPoint === applyPoint);

  return store => done => {
    const chain = policies.map(policy => policy(store));
    return compose(...chain)(done);
  };
};

export const getActionPolicies = (policies) => {
  if (Array.isArray(policies)) {
    const policyNames = Object.keys(globalPolicies).filter(key => policies.indexOf(key) >= 0);
    return get(policyNames);
  }
  return get([]);
};

export default {
  globalPolicies,
  register,
  getActionPolicies,
  reset,
};
