# HttpMiddlewareService

This is the heart of this plugin module. It works by leveraging axios interceptors to call its middleware queue.

## `constructor(axios)`

You can pass an optional axios instance (the global one, or a local instance) on which to register the middlewares. If you don't pass an axios instance right away, you can use the `setHttp` method later on.

Even if no axios instance was passed, you can still register middlewares.

## `setHttp(axios)`

Sets or replaces the axios instance on which to intercept the requests and responses.

## `unsetHttp()`

Removes the registered interceptors on the axios instance, if any were set.

## `has(middleware)`

Returns `true` is the passed `middleware` instance is within the queue.

## `register(middlewares)`

Adds a middleware instance or an array of middlewares to the queue.

You can pass an `HttpMiddleware` instance or a simple object implementing only the functions you need (see the [simplified syntax](simplified-syntax.md)).

!> Throws an error if a middleware instance is already within the queue.

## `unregister(middleware)`

Removes a middleware instance from the queue.

## `reset()`

Empty the middleware queue.
