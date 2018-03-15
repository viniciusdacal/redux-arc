<img src="https://github.com/viniciusdacal/redux-arc/blob/master/arc-64.png?raw=true" height="64" />

Create scalable, no-boilerplate redux Apps!

Arc is an abstraction layer to help you reduce boilerplate on redux-apps and also, organize better your code. Additionally, it has utilities to handle async requests.

[![build status](https://img.shields.io/travis/viniciusdacal/redux-arc/master.svg?style=flat-square)](https://travis-ci.org/viniciusdacal/redux-arc) [![npm version](https://img.shields.io/npm/v/redux-arc.svg?style=flat-square)](https://www.npmjs.com/package/redux-arc)
[![Coverage Status](https://coveralls.io/repos/github/viniciusdacal/redux-arc/badge.svg?branch=master)](https://coveralls.io/github/viniciusdacal/redux-arc?branch=master)

## Why
Redux is awesome! But people often complain about how much boilerplate they have to write when using it. Part of this problem, is because they feel unproductive defining constants, action creators and big reducers, but also because they don't have a clear idea on how to organize their project, or even how to proper handle async requests. This project, intends to help on all that aspects!

We don't intend to recreate the wheel, instead, we tried to use what the community are used with, and build up some approaches together in order to clarify the things about the project architecture, code splitting and the things around actions.

## Action creators and types generated by a config

```js
  // actions.js
  import { createActions } from 'redux-arc';

  export { types, creators } = createActions('jedi', {
    add: null,
    reset: null
  });
```

## Create reducers reusing types and without switch cases:

```js
  import { createReducers } from 'redux-arc';
  import { types } from './actions';

  const INITIAL_STATE = [];

  const onAdd = (state, action) => [
    ...state,
    action.payload,
  ];

  const onReset = () => INITIAL_STATE;

  const HANDLERS = {
    [types.ADD]: onAdd,
    [types.onReset]: onReset,
  };

  export default createReducers(INITIAL_STATE, HANDLERS);
```

## Call the creators providing payload and meta

```js
  import { creators } from './actions';

  const payload = { name: 'Luke' };
  const meta = { foo: 'bar' };

  dispatch(creators.add(payload, meta));
  /*
  {
    type: 'JEDI_ADD',
    payload: { name: 'luke' },
    meta: { foo: 'bar' },
  }
  */

  dispatch(creators.reset());
  // { type: 'JEDI_RESET' }
```

## Create Async Actions

```js
  import { createActions } from 'redux-arc';

  export { types, creators } = createActions('jedi', {
    add: { url: '/api/jedi' method: 'post'},
  });

  dispatch(creators.add(payload, meta));

  types.ADD.REQUEST // JEDI_ADD_REQUEST
  types.ADD.RESPONSE // JEDI_ADD_RESPONSE
```
> createActions creates both, regular and **Async Actions**. Async types has **REQUEST** and **RESPONSE** type, respectively to when a request starts and when it finishes.


## Demo Project
Take a look at the demo project using Arc to build a Contacts CRUD: [github.com/redux-arc/redux-arc-demo](https://github.com/redux-arc/redux-arc-demo)

# Getting started

```bash
yarn add redux-arc
```

or

```bash
npm i --save redux-arc
```


To understand this docs, you should have a good understand of redux: what are Action creators, what are reducers, middlewares and also, what is a Flux Standard Action. So please, if you need a recap on those concepts, read the links bellow:

[Redux Docs](https://redux.js.org/)
[Flux Standard Action](https://github.com/acdlite/flux-standard-action)


# Action creators and Types
When you have to create a new action on redux, the first 2 steps you usually do is defining a **const** to you *action type* and then defining an *action creator*.

```js
const ADD_JEDI = 'ADD_JEDI';

const addJedi = (payload) => ({
  type: ADD_JEDI,
  payload,
});
```

The above code is fine, but the problem is, you have dozens or hundreds of action in an application, and you are always writing the same code. Also, if you are not strict on code review, you end up having situations where your action type has a name different from your action creator:

```js
const ADD_JEDI = 'ADD_JEDI';

const addJedi = (payload) => ({
  type: ADD_JEDI,
  payload,
});
```

Thinking in the above issues, Arc has a `createAction` function, that you use to define your actions and it generates the types and action creators automatically for you. Take a look:

```js
  import { createActions } from 'redux-arc';

  const { types, creators } = createActions('yourNamespace', {
    addJedi: null,
  });

  types.addJedi // YOUR_NAMESPACE_ADD_JEDI

  const payload = {
    master: 'Yoda',
    name: 'Luke',
  };

  creators.addJedi(payload);
  /*
  {
    type: 'YOUR_NAMESPACE_ADD_JEDI',
    payload: {
      master: 'Yoda',
      name: 'Luke',
    }
  }
  */
```

The `createActions` method, expects a namespace as its first argument, this will be uppercased and will serve as a prefix for the actions. As the second parameter, we need to provide a config object, which the key is the action name and the value is an object with default values for **payload** and **meta**, or `null` if you don't want to provide defaults. Then, it will return **creators** and **types**.

Both creators and types are objects, the first one contains the action creators for the actions you defined. As in the case above we defined an action addJedi, then we have a creator at `creators.addJedi`.

Creators accepts until three arguments:
 - payload: could be of any type. Will become the `action.payload`
 - meta: could be of any type. Will become the `action.meta`
 - error: boolean. Indicates if the action has an error or not. You can omit it if the action has no error.

> The api was designed following the flux-standard-action concepts. It can be strict about how your action should look like, but this will help you creating better actions. Also, now you can be sure that the first parameter you provide to the action creator, will become the action.payload.

The types is an object that contains strings. Its keys are the action names, but different from the creators, here they are uppercased:

```js
  types.ADD_JEDI
```

Also, when you do a console.log to see its content, you can see that we prefix the actions with the namespace you provided:

```js
  const { types } = createActions('yourNamespace', {
    addJedi: null,
  });

  types.ADD_JEDI // -> YOUR_NAMESPACE_ADD_JEDI

```

> We decided to have the namespace, to not stop you from having actions with the same name in different modules. Don't worry, you will be able to differ them easily when using redux-dev-tools, just remember to provide unique namespaces.

#Reducers

Beyond types and action creators, we also have reducers. There are a few ways to deal with them, some approaches use `switch case`, some others use multiple `IFs`. With most of them, you end up having a lot of code inside the same function, which makes maintenance and focusing hard. I know some approaches mention that you can split your code into small functions when it gets bigger, but why do not start from something that is easy to scale and also allow you to focus on each action separately?

Thinking about that, we created the function `createReducers`

## createReducers

This factory was created to work standalone, it doesn't require you to use any other feature from Arc. If you like, you can continue creating your actions and types as you always did. Take a look at the example below:

```js
  // vanillaActions.js
  export const ADD_TODO = 'ADD_TODO';
  export const RESET_TODOS = 'RESET_TODOS';

  export const addTodo = (title, completed) => ({
    type: ADD_TODO,
    payload: {
      title,
      completed,
    }
  });

  export const resetTodos = () => ({
    type: RESET_TODOS,
  });

```

Above we defined our type and action creator using pure JavaScript. Below, you can see how we could use it with **createReducers**:

```js
  import { createReducers } from 'redux-arc';
  import { ADD_TODO, RESET_TODOS } from './vanillaActions';

  const INITIAL_STATE = [];

  const onAddTodo = (state, action) => [
    ...state,
    { name: action.name, master: action.master },
  ];

  const onResetTodos = (state, action) => INITIAL_STATE;

  const HANDLERS = {
    [ADD_TODO]: onAddTodo
    [RESET_TODOS]: onResetTodos
  };

  export default createReducers(INITIAL_STATE, HANDLERS);
```

You must provide an `INITIAL_STATE` and a `HANDLERS` object, which the keys should be action types and the values should be reducers.


**Using createReducers with arc's types object**
As types generated from Arc is a simple JavaScript object, with strings, it fits perfectly with **createReducers**. Take a look below:

**actions.js**:

```js
  const { creators, types } = createActions('todo', {
    addTodo: null,
    resetTodos: null,
  });
```

**reducers.js**

```js
import { createReducers } from 'redux-arc'
import { types } from './actions';

const INITIAL_STATE = [];

const onAddTodo = (state, action) => [
  ...state,
  { name: action.name, master: action.master },
];

const onResetTodos = (state, action) => INITIAL_STATE;

const HANDLERS = {
  [types.ADD_TODO]: onAddTodo
  [types.RESET_TODOS]: onResetTodos
};

export default createReducers(INITIAL_STATE, HANDLERS);

```

As you can see, you can use **createReducers** either standalone or with types generated by Arc.

It helps you organize your logic and focus on how each action will affect the state;

Also, it runs some validations over the config you provided. For example: If you commit a typo when providing the action type, it will throw a friendly descriptive error for you.


# Async Actions

Originally, Arc was created to be an abstraction layer to handle async request in Redux. So, it has all you need about that. The api to generate async action creators and types is the same we use for regular actions, you only need to provide some additional params in the action config object. Take a look below:


```js
  import { createActions } from 'redux-arc';

  const { creators, types } = createActions('todo', {
    list:   { url: 'api/todo',     method: 'get'  },
    read:   { url: 'api/todo/:id', method: 'get'  },
    create: { url: 'api/todo',     method: 'post' },
    update: { url: 'api/todo/:id', method: 'put'  },
  });
```

Above are defined four actions: `list`, `read`, `create` and `update`.

Two params are required in an async action config, `url` and `method`.

 - **url**: You can define any url you want and it also accepts dynamic params, as you can see in the `read` action. We defined a dynamic param **id**, inserting `:id`.
 - **method**: Generally speaking, any http method your request lib supports. This will be used only by you in the **asyncMiddleware** that you will configure.

### Async Creators and Async Types
An async creator is very similar to a simple creator. It accepts **payload** and **meta** as arguments. They will further become the `action.payload` and `action.meta`, as in a regular creator. The difference here, is that the meta, should be an object, and its values will be also used to parse dynamic urls. Considering that, the creator **read** should be used like that:

```js
  const payload = null;
  const meta = { id: '123' };

  creators.read(payload, meta);
```

With the above code, the final url to our read request, would be `api/todo/123`.

The async types differ a little bit from the regular ones as well. First, as a api call has two moments (request and response), we need two different types to use inside our reducers. Considering that, Arc returns an object for each type, containing a `REQUEST` and a `RESPONSE` key with the respective types:

```js
  types.READ.REQUEST == 'TODO_READ_REQUEST';
  types.READ.RESPONSE == 'TODO_READ_RESPONSE';
```

### Async Middleware
Arc doesn't intend to be a request lib, so, you need to tell it how you want to make your requests, and you do that by configuring the asyncMiddleware.

It's quite simple, take a look below in an example using axios:

```js
import { createAsyncMiddleware } from 'redux-arc';
import axios from 'axios';

const asyncTask = store => done => (options) => {
  const { method, url, payload } = options;
  const params = method === 'get' ? { params: payload } : payload;

  return axios[method](url, params).then(
    response => done(null, response.data),
    error => done(error, null),
  );
};

// create the async middleware
const asyncMiddleware = createAsyncMiddleware(asyncTask);

// set it to the Store
const store = createStore(
  reducer,
  applyMiddleware(asyncMiddleware),
);
```

>In the above example, we are using axios, but you can use whatever you want to perform the request, just make sure you call done, passing error and response when the request has finished.

For more info about **asyncTask** and **createAsyncMiddleware**, read [Connecting Arc Into Redux](http://redux-arc.org/docs/basics/ConnectingArcIntoRedux.html)


## Async actions in Reducers

In reducers, you have to define two different handlers for each request definition, one to handle the state change when the request starts an another when it finishes.

Considering the following config:

```js
  import { createActions } from 'redux-arc';

  export const { creators, types } = createActions('todo', {
    list: { url: 'api/todo', method: 'get' },
  });
```

We would have a reducers like this:

```js
import { createReducers } from 'redux-arc'
import { types } from './actions';

const INITIAL_STATE = {
  listResult: [],
  listIsLoading: false,
  listError: null,
};

const onListRequest = (state, action) => ({
  ...state,
  listIsLoading: true,
  listError: INITIAL_STATE.listError,
});

const onListResponse = (state, action) => {
  if (action.error) {
    return {
      ...state,
      listIsLoading: INITIAL_STATE.listIsLoading,
      listError: action.payload,
    }
  }

  return {
    ...state,
    listIsLoading: INITIAL_STATE.listIsLoading,
    listResult: action.payload
  }
};

const onReset = state => INITIAL_STATE;

const HANDLERS = {
  [types.LIST.REQUEST]: onListRequest,
  [types.LIST.RESPONSE]: onListResponse,
  [types.RESET]: onReset,
};

export default createReducers(INITIAL_STATE, HANDLERS);
```


### Response action:
When the request is done, an action with the response will be dispatched. Considering the list example, the response action would look like this:

```js
{
  type: 'JEDI_LIST_RESPONSE', // types.LIST.RESPONSE,
  meta: {
    url: 'api/todo',
    method: 'get',
  },
  payload: [
    // resource list
  ],
}
```

### Error handling
The above example is a response with success. Accordingly to **FSA**, errors should be treated as a [**First class concept**](https://github.com/redux-utilities/flux-standard-action#errors-as-a-first-class-concept). In that case, when you got some error in an async request, the response action will come with the error property as `true` and the payload will be the actual error. Just like the example below:

```js
{
  type: 'JEDI_LIST_RESPONSE', // types.LIST.RESPONSE,
  meta: {
    url: 'api/todo',
    method: 'get',
  },
  payload: new Error('the request error'),
  error: true,
}
```


