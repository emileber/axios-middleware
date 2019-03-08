# Middleware `Service` class

This is the heart of this plugin module. It works by leveraging axios' adapter to call the middleware stack at each relevant steps of a request lifecycle.

## `constructor(axios)`

You can pass an optional axios instance (the global one, or a local instance) on which to register the middlewares. If you don't pass an axios instance right away, you can use the `setHttp` method later on.

Even if no axios instance was passed, you can still register middlewares.

## `setHttp(axios)`

Sets or replaces the axios instance on which to intercept the requests and responses.

## `unsetHttp()`

Removes the registered interceptors on the axios instance, if any were set.

!> Be aware that changing the default adapter after the middleware service was initialized, then calling `unsetHttp` or `setHttp` will set the default adapter back in the axios instance. Any adapter used after could be lost.

## `has(middleware)`

Returns `true` if the passed `middleware` instance is within the stack.

## `register(middlewares)`

Adds a middleware instance or an array of middlewares to the stack.

You can pass a class instance or a simple object implementing only the functions you need (see the [simplified syntax](simplified-syntax.md)).

!> Throws an error if a middleware instance is already within the stack.

## `unregister(middleware)`

Removes a middleware instance from the stack.

## `reset()`

Empty the middleware stack.

## `adapter(config)`

The adapter function that replaces the default axios adapter. It calls the default implementation and passes the resulting promise to the middleware stack's `onSync` method.
