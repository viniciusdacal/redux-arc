# redux-arc
React is a dependency free, 3kb lib to handle async request in redux.

## Why
Many applications are being developed with redux, and api calls are critical to this process. With the available alternatives (sagas, observables, etc...), you end up writing and repeating to much code.

**Say no more to write many files just to talk with your api.**
with redux-arc, you can turn a bunch of code in a few lines, take a look:

```js
import { createAsyncActions } from 'redux-arc';

const { creators, types } = createAsyncActions(
  {
    list: { url: 'path/to/resource', method: 'get' },
    read: { url: 'path/to/resource/:id', method: 'get' },
    create: { url: 'path/to/resource', method: 'post' },
  },
  { prefix: 'MY_RESOURCE_'}
);

// dispatch the actions using creators
dispatch(creators.list());

dispatch(creators.read({ id: '123' }));

dispatch(creators.create({ payload: { name: 'John Doe' } }));

// use types in your reducers:
types.LIST.REQUEST // MY_RESOURCE_LIST_REQUEST
types.LIST.RESPONSE // MY_RESOURCE_LIST_RESPONSE

```

# Getting started
```bash
yarn add redux-arc
```
or
```bash
npm i --save redux-arc
```

In your store config file, you must configure the redux middleware:

```js
import { createAsyncMiddleware } from 'redux-arc';

const asyncTask = store => done => (options) => {
  // options is an object containing url and payload. We can have more, we will see it further.
  // do your request and call done(err, response) when you are ready
  done(err, response);
  // if you like, return the respective value to create a chain. The value you return here, will be passed to whom dispatch the action
  return response;
};

const asyncMiddleware = createAsyncMiddleware(asyncTask);

