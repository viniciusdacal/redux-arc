# Connecting Arc into Redux

The first step to start using Arc, is create the AsyncMiddleware and set it to the store.


```js
import { createStore, applyMiddleware } from 'redux';
import { createAsyncMiddleware } from 'redux-arc';

const asyncTask = store => done => (options) => {
  const { url, method, payload, ...meta } = options;

  /* do your request and call done with the respective error and response
     when the request is finished */
  done(err, response))
};

const asyncMiddleware = createAsyncMiddleware(asyncTask);

// set it to the Store
const store = createStore(
  reducer,
  applyMiddleware(asyncMiddleware),
);
```

### asyncTask
Notice we defined a function named `asyncTask` on the first lines of the above example, that's because we let you perform the request. When the time comes, the middleware will call `asyncTask` passing the respective params, `asyncTask` should do the request and should call `done` when the request is finished, providing an error and a response. What you are going to use to perform your requests (fetch, promises, libs etc..), is up to you! Only make sure you call `done` in the proper time.

Pay attention to the `options` argument. The `asyncTask` should rely on this to perform the request. The `options` will be an object that contains `url`, `payload` and `method`.

### createAsyncMiddleware
This function waits as its first argument, the function `asyncTask`, and will return the actual middleware for redux. Then, you get the middleware and apply it to the store. Rather to set `asyncMiddleware` as the first middleware in the config, it will avoid traffic unnecessary  actions through the whole redux flow.

And that's it, your middleware is configured in the store. Let's jump strait forward to the request definitions.

