import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Service } from '../../dist/axios-middleware.common';
import MiddlewareMock from '../mocks/MiddlewareMock';

const http = axios.create();
const mock = new MockAdapter(http);

describe('Middleware service', () => {
  const service = new Service(http);

  afterEach(() => {
    mock.reset();
    service.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('runs the middlewares in order', () => {
    expect.assertions(1);

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

    service.register([
      getMiddleware(1),
      getMiddleware(2),
    ]);

    mock.onAny().reply(config => [200, config.param]);

    return http(request).then((response) => {
      expect(response.data.test).toBe('-req2--req1--resp1--resp2-');
    });
  });

  it('can catch current request promise', () => {
    expect.assertions(1);
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

    service.register([
      getMiddleware(1),
      getMiddleware(2),
    ]);

    mock.onAny().reply(config => [200, config.param]);

    return http(request).then((response) => {
      expect(response.data.test).toBe('-req2--req1--resp1--resp2-');
    });
  });
});
