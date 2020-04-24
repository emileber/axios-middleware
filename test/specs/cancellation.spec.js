import { Service } from '../../dist/axios-middleware.common';
import MiddlewareMock from '../mocks/MiddlewareMock';

describe('onRequest cancellation', () => {
  it('can reject a request', () => {
    const service = new Service();
    service.originalAdapter = jest.fn(conf => Promise.resolve(conf));

    const middleware1 = new MiddlewareMock('middleware1');
    const middleware2 = new MiddlewareMock('middleware2');

    middleware1.onRequest.mockImplementation(() => Promise.reject());

    service.register([
      middleware2,
      middleware1,
    ]);

    return service.adapter('test').catch(() => {
      expect(middleware1.onRequest).toBeCalledTimes(1);
      expect(middleware2.onRequest).not.toBeCalled();

      expect(middleware1.onRequestError).not.toBeCalled();
      expect(middleware2.onRequestError).toBeCalledTimes(1);

      expect(middleware1.onSync).not.toBeCalled();
      expect(middleware2.onSync).not.toBeCalled();

      expect(middleware2.onResponse).not.toBeCalled();
      expect(middleware1.onResponse).not.toBeCalled();

      expect(middleware2.onResponseError).toBeCalledTimes(1);
      expect(middleware1.onResponseError).toBeCalledTimes(1);
    });
  });

  it('can cancel a request by returning false', () => {
    const service = new Service();
    service.originalAdapter = jest.fn(conf => Promise.resolve(conf));

    const middleware1 = new MiddlewareMock(1);
    const middleware2 = new MiddlewareMock(2);

    middleware1.onRequest.mockImplementation(() => false);

    service.register([
      middleware2,
      middleware1,
    ]);

    return service.adapter('test').catch(() => {
      expect(middleware1.onRequest).toBeCalledTimes(1);
      expect(middleware2.onRequest).not.toBeCalled();

      expect(middleware1.onRequestError).not.toBeCalled();
      expect(middleware2.onRequestError).not.toBeCalled();

      expect(middleware1.onSync).not.toBeCalled();
      expect(middleware2.onSync).not.toBeCalled();

      expect(middleware2.onResponse).not.toBeCalled();
      expect(middleware1.onResponse).not.toBeCalled();

      expect(middleware2.onResponseError).not.toBeCalled();
      expect(middleware1.onResponseError).not.toBeCalled();
    });
  });
});
