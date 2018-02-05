# HttpMiddleware

?> This class is optional if you opt to use the short syntax.

The base implementation to inherit when creating your custom implementation. **Any function is optional** and should be provided within a custom middleware only if needed.

## `constructor`

The constructor isn't used in the default middleware, leaving it totally available to the child classes. Very useful to pass any relevant services your middleware might need, like [the `i18n` service in our example](examples/locale-middleware.md).

## `onRequest(config)`

Receives the configuration objects before the request is made. Useful to add headers, query parameters, validate data, etc.

!> It must return the received `config` even if no changes were made to it.

## `onRequestError(error)`

No internet connection right now? You might end up in this function. Do what you need with the error.

## `onResponse(response)`

Parsing the response can be done here. Say all responses from your API are returned nested within a `_data` property?

```javascript
onResponse(response) {
    return response._data;
}
```

!> The original `response` object or _a new one_ should be returned.

## `onResponseError(error)`

Not authenticated? Server problems? You might end up here. Do what you need with the error.
