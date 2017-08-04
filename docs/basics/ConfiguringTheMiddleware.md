# Configuring the Middleware

The first step to start using Arc, is creating the AsyncMiddleware and setting it to the store.


```js
import { createAsyncMiddleware } from 'redux-arc';

const asyncTask = store => done => (options) => {
  // options = { url, method, payload }
  done(err, response);
  return response;
};

const asyncMiddleware = createAsyncMiddleware(asyncTask);

// set it to the Store
const store = createStore(
  reducer,
  applyMiddleware(asyncMiddleware),
);
```

### asyncTask
Notice we defined a function called `asyncTask` on the first lines of the above example, that's because we let you perform the request. When the time comes, the middleware will call `asyncTask` passing the respective params, and `asyncTask` should call `done` when it finishes the request, providing an error and a response. What you are going to use in your requests (fetch, promises, libs etc..), is up to you! Only make sure you call `done` in the proper time.

Pay attention to the `options` argument. The `asyncTask` should rely on this to perform the request. The `options` will be an object that contains `url`, `payload` and `method`.

### createAsyncMiddleware
This function will wait for `asyncTask` as its first param and will return the actual middleware for redux. Then, you get this middleware and apply it to the store. Rather to set `asyncMiddleware` as the first middleware in the config, it will avoid traffic unnecessarily  actions through the whole redux flow.

And that's it, your middleware is configured in the store. Let's jump strait forward to the request definitions.

