# Locale middleware

Here's a simple example of a locale middleware who sets a language header on each AJAX request.

```javascript
export default class LocaleMiddleware {
    constructor(i18n) {
        this.i18n = i18n;
    }
    
    onRequest(config) {
        config.headers = {
            locale: this.i18n.lang,
            ...config.headers
        };
        return config;
    }
}
```
