# Simplified syntax for middlewares

Instead of creating a class, you can use a simple object literal only implementing the [methods](api/methods.md) you need.

```javascript
service.register({
    onRequest(config) {
        // handle the request
    }
});
```
