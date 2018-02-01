# Utilities

Beyond async requests, arc also has some utilities to work with redux.
Our current utilities are

## Action creator
the action creator works similar to our createApiActions, you basically define a namespace and a config and it will return creators and types, take a look at the example:

```js
    import { createActions } from 'redux-arc';

    export const { creators, types } = createActions = ('namespace', [
        'reset',
        'clone',
        'newJedi',
    ]);

    /*
    ** types = {
    **   RESET: 'NAMESPACE_RESET',
    **   CLONE: 'NAMESPACE_CLONE',
    **   NEW_JEDI: 'NAMESPACE_NEW_JEDI',
    ** };
    **
    ** creators = {
    **   reset: function() {},
    **   clone: function() {},
    **   newJedi: function() {},
    ** }
    */
```

Then, you can use the creators as below:

```js
    creators.reset();
    // { type: 'NAMESPACE_RESET' }
    creators.clone({ payload, error: true, ...meta });
    // { type: 'NAMESPACE_CLEAR', error, meta }
    creators.newJedi({ payload: 'Luke', father : 'Anakin', master: 'Yoda' })
    /*
    ** {
    **   type: 'NAMESPACE_NEW_JEDI',
    **   payload: 'Luke',
    **   meta: {
    **     father: 'Vader',
    **     master: 'Yoda',
    **   }
    ** }
    */
```

When you call the creator, if you don't pass any argument, it will return an empty action, with only its type.

As its only argument, the creator accepts an object, which you can pass a `payload`, a boolean `error` and anything else, which will become the action's `meta` afterwards.

> The uppercase conversion respects the same rules we have on createApiActions:

```
  # my -> MY
  # myAction -> MY_ACTION
```

If you like, instead of just defining the action name in the config, you can also provide default values for your final action. To do that, instead of providing a string, you define an object containing `action`, which should be the action name and any default value you want:

```js
  export const { creators, types } = createActions = ('namespace', [
      'reset',
      'clone',
      { name: 'newJedi', master: 'Yoda', payload: 'New Jedi'},
  ]);

  creators.newJedi();
  /*
  ** {
  **   type: 'NAMESPACE_NEW_JEDI',
  **   payload: 'New Jedi',
  **   meta: { master: 'Yoda'}
  ** }
  */
```


## Reducers creator
We also have a function to help you create and organize your reducers, based on your action types. Take a look at the following example:

```js
  import { createReducers } from 'redux-arc';
  import { types } from './actions';

  const INITIAL_STATE = {
    jedis: [],
  };

  const newJedi = (state = INITIAL_STATE, action) => ({
    ...state,
    jedis: [
      ...state.jedis,
      {
        name: action.payload,
        master: action.meta.master,
        father: action.meta.father
      },
    ],
  });

  const reset = () => INITIAL_STATE;

  const HANDLERS = {
    [types.NEW_JEDI]: newJedi,
    [types.RESET]: reset,
  };

  const reducer = createReducers(INITIAL_STATE, HANDLERS);

```

Basically, you define a reducer for each action type, then you create a, object HANDLERS, with the keys being the action types and the values being the respective reducers.

This approach allow you to split and organize better your state manipulation logic.


# Merging different types and creators
If you are familiar with createApiAction, you may wondering how you will handle when you have to define both, async and simple actions, if both of factories returns the objects creators and types.
To handle that, we create the function mergeTypesAndCreators, which will return the different types in a single object `types` and will do the same with creators. Take a look at the example below:

```js
  import {
    mergeTypesAndCreators,
    createActions,
    createApiActions,
  } from 'redux-arc';

  const apiTypesAndCreators = createApiActions('namespace', {
    read: { url: '/read:id', method: 'get' },
  });

  const typesAndCreators = createActions('namespace', [
    'reset',
    'clone',
    'newJedi',
  ]);

  export const { types, creators } = mergeTypesAndCreators(
    apiTypesAndCreators,
    typesAndCreators,
  );
```



