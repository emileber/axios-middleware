export default class HttpMiddlewareService {
    constructor(axios) {
        this.middlewares = [];

        this.setHttp(axios);
    }

    /**
     *
     * @param {Axios} axios
     */
    setHttp(axios) {
        this.unsetHttp();

        this.http = axios;

        const interceptors = axios.interceptors;

        this._requestInterceptor = interceptors.request.use(
            config => this._onRequest(config),
            error => this._handleRequestError(error),
        );
        this._responseInterceptor = interceptors.response.use(
            response => this._onResponse(response),
            error => this._handleResponseError(error),
        );
        return this;
    }

    unsetHttp() {
        const http = this.http;
        if (this.http) {
            const interceptors = http.interceptors;
            interceptors.request.eject(this._requestInterceptor);
            interceptors.response.eject(this._responseInterceptor);
        }
    }

    /**
     * @param {HttpMiddleware} middleware
     * @returns {boolean} true if the middleware is already registered.
     */
    has(middleware) {
        return this.middlewares.indexOf(middleware) > -1;
    }

    /**
     * Add a middleware or an array of middlewares to the stack.
     * @param {HttpMiddleware|Array} middlewares
     */
    register(middlewares) {
        // eslint-disable-next-line no-param-reassign
        if (!Array.isArray(middlewares)) middlewares = [middlewares];

        // Test if middlewares are registered more than once.
        middlewares.forEach((middleware) => {
            if (this.has(middleware)) {
                throw new Error('Middleware already registered');
            }
            this.middlewares.push(middleware);
        });
    }

    /**
     * Remove a middleware from the registered stack.
     * @param {HttpMiddleware} middleware
     */
    unregister(middleware) {
        const index = this.middlewares.indexOf(middleware);
        if (index > -1) {
            this.middlewares.splice(index, 1);
        }
    }

    reset() {
        this.middlewares.length = 0;
    }

    _onRequest(config) {
        return this.middlewares.reduce(
            (acc, middleware) => middleware.onRequest(acc),
            config);
    }

    _handleRequestError(error) {
        this.middlewares.forEach(middleware => middleware.handleRequestError(error));
        return Promise.reject(error);
    }

    _onResponse(response) {
        return this.middlewares.reduce(
            (acc, middleware) => middleware.onResponse(acc),
            response);
    }

    _handleResponseError(error) {
        this.middlewares.forEach(middleware => middleware.handleResponseError(error));
        return Promise.reject(error);
    }
}
