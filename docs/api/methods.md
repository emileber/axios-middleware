# The middleware methods

These will be called at different step of a request lifecycle. Each method can return a promise which will be resolved or reject before continuing through the middleware stack.

?> **Any function is optional** and should be provided within a custom middleware only if needed.

## `onRequest(config)`

Receives the configuration object before the request is made. Useful to add headers, query parameters, validate data, etc.

!> It must return the received `config` even if no changes were made to it. It can also return a promise that should resolve with the config to use for the request.

## `onRequestError(error)`

No internet connection right now? You might end up in this function. Do what you need with the error.

You can return a promise, or throw another error to keep the middleware chain going.

!> Failing to return a rejecting promise or throw an error would mean that the error was dealt with and the chain would continue on a success path.

## `onSync(promise)`

The request is being made and its promise is being passed. Do what you want with it but be sure to **return a promise**, be it the one just received or a new one.

?> Useful to implement a sort of loading indication based on all the unresolved requests being made.

## `onResponse(response)`

Parsing the response can be done here. Say all responses from your API are returned nested within a `_data` property?

```javascript
onResponse(response) {
  return response._data;
}
```

!> The original `response` object, or _a new/modified one_, or a promise should be returned.

## `onResponseError(error)`

Not authenticated? Server problems? You might end up here. Do what you need with the error.

?> You can return a promise, which is useful when you want to retry failed requests.

!> Failing to return a rejecting promise or throw an error would mean that the error was dealt with and the chain would continue on a success path.
