# Unauthorized requests retry middleware

In a case where we'd like to retry a request if not authenticated, we could return a promise in the `onResponseError` method.

```javascript
export default class AuthMiddleware {
  constructor(auth, http) {
    this.auth = auth;
    this.http = http;
  }

  onResponseError(err) {
    if (err.response.status === 401 && err.config && !err.config.hasRetriedRequest) {
      return this.auth()
        // Retrying the request now that we're authenticated.
        .then((token) => this.http({
          ...err.config,
          hasRetriedRequest: true,
          headers: {
            ...err.config.headers,
            Authorization: `Bearer ${token}`
          }
        }))
        .catch((error) => {
          console.log('Refresh login error: ', error);
          throw error;
        });
    }
    throw err;
  }
}
```
