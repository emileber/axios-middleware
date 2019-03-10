import { reduceHandlers } from './utils';

/**
 * @property {Array} middlewares stack
 * @property {AxiosInstance} http
 * @property {Function} originalAdapter
 */
export default class HttpMiddlewareService {
  /**
   * @param {AxiosInstance} [axios]
   */
  constructor(axios) {
    this.middlewares = [];

    this._updateChain();
    this.setHttp(axios);
  }

  /**
   * @param {AxiosInstance} axios
   * @returns {HttpMiddlewareService}
   */
  setHttp(axios) {
    this.unsetHttp();

    if (axios) {
      this.http = axios;
      this.originalAdapter = axios.defaults.adapter;
      axios.defaults.adapter = config => this.adapter(config);
    }
    return this;
  }

  /**
   * @returns {HttpMiddlewareService}
   */
  unsetHttp() {
    if (this.http) {
      this.http.defaults.adapter = this.originalAdapter;
      this.http = null;
    }
    return this;
  }

  /**
   * @param {Object|HttpMiddleware} [middleware]
   * @returns {boolean} true if the middleware is already registered.
   */
  has(middleware) {
    return this.middlewares.indexOf(middleware) > -1;
  }

  /**
   * Adds a middleware or an array of middlewares to the stack.
   * @param {Object|HttpMiddleware|Array} [middlewares]
   * @returns {HttpMiddlewareService}
   */
  register(middlewares) {
    // eslint-disable-next-line no-param-reassign
    if (!Array.isArray(middlewares)) middlewares = [middlewares];

    // Test if middlewares are registered more than once.
    middlewares.forEach((middleware) => {
      if (!middleware) return;
      if (this.has(middleware)) {
        throw new Error('Middleware already registered');
      }
      this.middlewares.push(middleware);
      this._addMiddleware(middleware);
    });
    return this;
  }

  /**
   * Removes a middleware from the registered stack.
   * @param {Object|HttpMiddleware} [middleware]
   * @returns {HttpMiddlewareService}
   */
  unregister(middleware) {
    if (middleware) {
      const index = this.middlewares.indexOf(middleware);
      if (index > -1) {
        this.middlewares.splice(index, 1);
      }
      this._updateChain();
    }

    return this;
  }

  /**
   * Removes all the middleware from the stack.
   * @returns {HttpMiddlewareService}
   */
  reset() {
    this.middlewares.length = 0;
    this._updateChain();
    return this;
  }

  /**
   * @param config
   * @returns {Promise}
   */
  adapter(config) {
    const { request: requestHandlers, response } = this.chain;
    return reduceHandlers(requestHandlers, Promise.resolve(config))
      .then(
        (conf) => {
          if (!conf) {
            const err = Error('Request cancelled within a middleware');
            err.type = 'REQUEST_CANCELLED';
            return Promise.reject(err);
          }
          return reduceHandlers(
            response,
            this._onSync(this.originalAdapter.call(this.http, conf))
          );
        },
        err => reduceHandlers(response, Promise.reject(err))
      );
  }

  /**
   *
   * @param {Object} middleware
   * @private
   */
  _addMiddleware(middleware) {
    if (!this.chain) {
      this._updateChain();
      return;
    }

    this.chain.request.unshift([
      middleware.onRequest && (conf => conf && middleware.onRequest(conf)),
      middleware.onRequestError && (error => middleware.onRequestError(error)),
    ]);

    this.chain.response.push([
      middleware.onResponse && (response => middleware.onResponse(response)),
      middleware.onResponseError && (error => middleware.onResponseError(error)),
    ]);
  }

  /**
   * @private
   */
  _updateChain() {
    this.chain = {
      request: [],
      response: [],
    };
    this.middlewares.forEach(middleware => this._addMiddleware(middleware));
  }

  /**
   * @param {Promise} promise
   * @returns {Promise}
   * @private
   */
  _onSync(promise) {
    return this.middlewares.reduce(
      (acc, middleware) => (middleware.onSync ? middleware.onSync(acc) : acc),
      promise
    );
  }
}
