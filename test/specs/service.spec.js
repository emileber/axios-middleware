import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Service } from '../../dist/axios-middleware.common';
import MiddlewareMock from '../mocks/MiddlewareMock';

const http = axios.create();
const mock = new MockAdapter(http);

describe('Middleware service', () => {
  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('works with the global axios instance', () => {
    const axiosAdapter = axios.defaults.adapter;
    const globalService = new Service(axios);

    expect(axios.defaults.adapter).not.toBe(axiosAdapter);
    expect(axios.defaults.adapter).toBeInstanceOf(Function);

    globalService.unsetHttp();

    expect(axios.defaults.adapter).toBe(axiosAdapter);
  });

  it('throws when adding the same middleware instance', () => {
    const service = new Service(http);
    const middleware = {};

    service.register(middleware);

    expect(() => service.register(middleware)).toThrow();
  });

  it('works with both middleware syntaxes', () => {
    expect.assertions(2);
    const service = new Service(http);
    const middleware = new MiddlewareMock();
    const simplifiedSyntax = {
      onRequest: jest.fn((config) => config),
    };

    service.register([middleware, simplifiedSyntax]);

    service.adapter().then(() => {
      expect(middleware.onRequest).toHaveBeenCalled();
      expect(simplifiedSyntax.onRequest).toHaveBeenCalled();
    });
  });

  it('runs the middlewares in order', () => {
    expect.assertions(1);

    const service = new Service(http);

    const request = { method: 'get', param: { test: '' } };

    function getMiddleware(index) {
      return {
        onRequest(config) {
          config.param.test += `-req${index}-`;
          return config;
        },
        onResponse(resp) {
          resp.data.test += `-resp${index}-`;
          return resp;
        },
      };
    }

    service.register([getMiddleware(1), getMiddleware(2)]);

    mock.onAny().reply((config) => [200, config.param]);

    return http(request).then((response) => {
      expect(response.data.test).toBe('-req2--req1--resp1--resp2-');
    });
  });

  it('can catch current request promise', () => {
    expect.assertions(1);

    const service = new Service(http);
    service.register({
      onSync(promise) {
        expect(promise).toBeInstanceOf(Promise);
        return promise;
      },
    });
    mock.onAny().reply(200);
    return http();
  });

  it('can return a promise for async config and response handling', () => {
    expect.assertions(1);

    const request = { method: 'get', param: { test: '' } };

    function getMiddleware(index) {
      return {
        onRequest(config) {
          return new Promise((resolve) => {
            setTimeout(() => {
              config.param.test += `-req${index}-`;
              resolve(config);
            }, 0);
          });
        },
        onResponse(resp) {
          return new Promise((resolve) => {
            setTimeout(() => {
              resp.data.test += `-resp${index}-`;
              resolve(resp);
            }, 0);
          });
        },
      };
    }

    const service = new Service(http);

    service.register([getMiddleware(1), getMiddleware(2)]);

    mock.onAny().reply((config) => [200, config.param]);

    return http(request).then((response) => {
      expect(response.data.test).toBe('-req2--req1--resp1--resp2-');
    });
  });
});
