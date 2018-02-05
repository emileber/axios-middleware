# axios-middleware

[![Build Status](https://travis-ci.org/emileber/axios-middleware.svg?branch=master)](https://travis-ci.org/emileber/axios-middleware)
[![Dependency Status](https://beta.gemnasium.com/badges/github.com/emileber/axios-middleware.svg)](https://beta.gemnasium.com/projects/github.com/emileber/axios-middleware)
[![npm version](https://badge.fury.io/js/axios-middleware.svg)](https://www.npmjs.com/package/axios-middleware)

Simple [axios](https://github.com/axios/axios) HTTP middleware service.

Explore [**the documentation**](https://emileber.github.io/axios-middleware/).

## Installation

```
npm install --save axios-middleware
```

## How to use

### Create your middleware

Here's a simple example of a locale middleware who sets a language header on each AJAX request.

```javascript
import { HttpMiddleware } from 'axios-middleware';

export default class LocaleMiddleware extends HttpMiddleware {
    constructor(i18n) {
        super();
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

### Use the middleware service

Simplest use-case:

```javascript
import axios from 'axios';
import { HttpMiddlewareService } from 'axios-middleware';
import i18n from './i18n';
import { LocaleMiddleware, OtherMiddleware } from './middlewares';

// Create a new service instance
const service = new HttpMiddlewareService(axios);

// Then register your middleware instances.
service.register([
    new LocaleMiddleware(i18n),
    new OtherMiddleware()
]);

// We're good to go!
```

A common use-case would be to expose an instance of the service which consumes an _axios_ instance configured for an API. It's then possible to register middlewares for this API at different stages of the initialization process of an application.

