/**
 * @property {Array} middlewares stack
 * @property {AxiosInstance} http
 * @property {Function} originalAdapter
 * @property {Number} _requestInterceptor
 * @property {Number} _responseInterceptor
 */
export default class HttpMiddlewareService {
    constructor(axios) {
        this.middlewares = [];

        this.setHttp(axios);
    }

    /**
     * @param {AxiosInstance} axios
     * @returns {HttpMiddlewareService}
     */
    setHttp(axios) {
        this.unsetHttp();

        if (axios) {
            const interceptors = axios.interceptors;

            this.http = axios;
            this.originalAdapter = axios.defaults.adapter;
            axios.defaults.adapter = config => this.adapter(config);

            this._requestInterceptor = interceptors.request.use(
                config => this._onRequest(config),
                error => this._onRequestError(error)
            );
            this._responseInterceptor = interceptors.response.use(
                response => this._onResponse(response),
                error => this._onResponseError(error)
            );
        }
        return this;
    }

    /**
     * @returns {HttpMiddlewareService}
     */
    unsetHttp() {
        if (this.http) {
            const interceptors = this.http.interceptors;
            interceptors.request.eject(this._requestInterceptor);
            interceptors.response.eject(this._responseInterceptor);

            this.http.defaults.adapter = this.originalAdapter;

            this.http = null;
        }
        return this;
    }

    /**
     * @param {HttpMiddleware} middleware
     * @returns {boolean} true if the middleware is already registered.
     */
    has(middleware) {
        return this.middlewares.indexOf(middleware) > -1;
    }

    /**
     * Adds a middleware or an array of middlewares to the stack.
     * @param {HttpMiddleware|Array} middlewares
     * @returns {HttpMiddlewareService}
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
        return this;
    }

    /**
     * Removes a middleware from the registered stack.
     * @param {HttpMiddleware} middleware
     * @returns {HttpMiddlewareService}
     */
    unregister(middleware) {
        const index = this.middlewares.indexOf(middleware);
        if (index > -1) {
            this.middlewares.splice(index, 1);
        }
        return this;
    }

    /**
     * Removes all the middleware from the stack.
     * @returns {HttpMiddlewareService}
     */
    reset() {
        this.middlewares.length = 0;
        return this;
    }

    /**
     * @param config
     * @returns {Promise}
     */
    adapter(config) {
        return this._onSync(this.originalAdapter.call(this.http, config));
    }

    /**
     * @param promise
     * @returns {Promise}
     * @private
     */
    _onSync(promise) {
        return this.middlewares.reduce(
            (acc, middleware) => (middleware.onSync ? middleware.onSync(acc) : acc),
            promise
        );
    }

    /**
     * @param {Object} config
     * @returns {Object}
     * @private
     */
    _onRequest(config) {
        return this.middlewares.reduce(
            (acc, middleware) => (middleware.onRequest ? middleware.onRequest(acc) : acc),
            config
        );
    }

    /**
     * @param {Object} error
     * @returns {Promise<never>}
     * @private
     */
    _onRequestError(error) {
        this.middlewares.forEach(middleware => middleware.onRequestError &&
            middleware.onRequestError(error));
        return Promise.reject(error);
    }

    /**
     * @param {Object} response
     * @returns {*|Object}
     * @private
     */
    _onResponse(response) {
        return this.middlewares.reduceRight(
            (acc, middleware) => (middleware.onResponse ? middleware.onResponse(acc) : acc),
            response
        );
    }

    /**
     * @param {Object} error
     * @returns {Promise<never>}
     * @private
     */
    _onResponseError(error) {
        for (let i = this.middlewares.length; i--;) {
            const middleware = this.middlewares[i];
            if (middleware.onResponseError) middleware.onResponseError(error);
        }
        return Promise.reject(error);
    }
}
