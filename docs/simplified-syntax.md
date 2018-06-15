# Simplified syntax for middlewares

Instead of creating a class from the [`HttpMiddleware`](api/HttpMiddleware.md) base class, you can use a simple object literal only implementing the functions you need.

```javascript
service.register({
    onRequest(config) {
        // handle the request
    }
});
```
