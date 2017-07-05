# Hamal
Hamal is a dependency free, 3kb lib to handle async requests in redux.

## Why
Many applications are built with redux, and api calls are critical to this. With the available alternatives (sagas, observables, etc...), you end up writing and repeating to much code.
With a declarative way, you can write less code and make it easier to understand and maintain. All of it leads you to have less bugs and have a better code base.

**Say no more to having a bunch of files just to talk with your api.**
with hamal, you can turn a lot of files in a few lines, take a look:

```js
import { createAsyncActions } from 'redux-hamal';

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
yarn add redux-hamal
```
or
```bash
npm i --save redux-hamal
```

In your store config file, you must configure the middleware:

```js
import { createAsyncMiddleware } from 'redux-hamal';

const asyncTask = store => done => (options) => {
  // options is an object containing url and payload. We can have more, we will see it further.
  // do your request and call done(err, response) when you are ready
  done(err, response);
  // if you like, return the respective value to create a chain. The value you return here, will be passed to whom dispatch the action
  return response;
};
// create the async middleware
const asyncMiddleware = createAsyncMiddleware(asyncTask);
// set it to the Store
const store = createStore(
  reducer,
  applyMiddleware(asyncMiddleware),
);
```

> We leave you perform the request. This way, you can use any request lib you like.

And now, you can use `createAsyncActions` to define your action creators and types.

```js
import { createAsyncActions } from 'redux-hamal';

const { creators, types } = createAsyncActions(
  {
    list: { url: 'path/to/resource', method: 'get' },
    read: { url: 'path/to/resource/:id', method: 'get' },
    create: { url: 'path/to/resource', method: 'post' },
    update: { url: 'path/to/resource/:id', method: 'put' },
  },
  { prefix: 'MY_RESOURCE_'}
);
```

## Action Creators
`creators` is just an object that contains your action creators (`list`, `read`, `create`, `update`).

you can execute any of them passing an object, which can contain a `payload`, used in the request, and any other value, that will be used to parse the url params that you declare, and will be forwarded to `asyncTask`

```js
dispatch(creators.read({ id: '123'}));
```

The above code, would dispatch an action like this:
```js
{
  type: ['MY_RESOURCE_LIST_REQUEST', 'MY_RESOURCE_LIST_RESPONSE'],
  meta: {
    url: 'path/to/resource/123',
    method: 'get',
    id: '123',
  },
}
```

> If you don't like using asyncActionCreator, you can always create and dispatch an object as the above, it will work out of the box.

Our middleware will intercept that action, and will dispatch actions
`MY_RESOURCE_LIST_REQUEST` and `MY_RESOURCE_LIST_RESPONSE` in the respective time.

To perform the request, the middleware uses the function you provide (`asyncTask`). It will execute the asyncTask passing `store => done => options`,
  - store: if you like, you can access the state through the `store.getState()`
  - done: the function you must call with the `err` and `response`:  `done(err, response)` when the request finishes
  - options: the object containing information regarding to the request, as the example bellow:

```js
{
  url: 'path/to/resource/123',
  method: 'get',
  payload: {},
}
```

> If you provide extra params in the actionCreator call, all of them will be under the options object.

## Types
When you call `createAsyncActions`, you also receive types. Types is just an object that contains all your action types, including request and response.

Basically, what we do, is converting to uppercase the name you gave for your action creators. So, if you provide a name like `list`, you will have
`types.LIST`, which is and object containing `REQUEST` and `RESPONSE`
so, in your reducers, you could use `types.LIST.REQUEST` to check for an action type. The respective type, has a value like this:
`MY_RESOURCE_LIST_REQUEST`. Remember we provided a prefix option (`MY_RESOURCE_`)? This helps you avoid conflicts across the application.

# Polices
We know there are sometimes when you need perform operations changing a request or response. For those cases, you can use polices.

A police is basically another middleware, as the follow example:

```js
const police store => done => (action, error, response) =>
  done(action, error, response);
```

A police must have an applyPoint attribute, so:

```js
police.applyPoint = 'beforeRequest' // (beforeRequest, onResponse)
```

You can imagine, in the cases your police has an applyPoint 'beforeRequest', you would only have access to  `action` object, unless another police create and error or response in the `beforeRequest` chain

To use a police, you do as the follow;

```js
import { createAsyncActions, polices } from 'redux-hamal';

const { creators, types } = createAsyncActions(
  {
    update: {
      url: 'path/to/resource/:id',
      method: 'put',
      polices: ['omitId'],
    },
  },
  { prefix: 'MY_RESOURCE_'}
);

function omitId(options) {
  return store => done => (action, ...params) => {
    const { id, ...restAction } = action;
    return done(restAction, ...params);
  }
}
omitId.applyPoint = 'beforeRequest';

polices.register('omitId', omitId)

```

> Usually, for 'beforeRequest' you would change only the action, and for `onResponse`, you would change only the response. But feel free to change the action inside 'onResponse' cycle if that makes sense.

If you need, you can provide polices when you are calling the action creator, just like this:

```js
dispatch(creators.read({ id: '123', polices: ['omitId'] }))
```



### License
MIT
