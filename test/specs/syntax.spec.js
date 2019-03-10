// import axios from 'axios';
// import MockAdapter from 'axios-mock-adapter';
import { Service } from '../../dist/axios-middleware.common';
import MiddlewareMock from '../mocks/MiddlewareMock';

describe('Middleware syntax', () => {
  it('throws when adding the same middleware instance', () => {
    const service = new Service();
    const middleware = {};

    service.register(middleware);

    expect(() => service.register(middleware)).toThrow();
  });

  it('works with both middleware syntaxes', () => {
    expect.assertions(2);
    const service = new Service();
    service.originalAdapter = jest.fn(conf => Promise.resolve(conf));

    const middleware = new MiddlewareMock();
    const simplifiedSyntax = {
      onRequest: jest.fn(config => config),
    };

    service.register([
      middleware,
      simplifiedSyntax,
    ]);

    return service.adapter({}).then(() => {
      expect(middleware.onRequest).toHaveBeenCalled();
      expect(simplifiedSyntax.onRequest).toHaveBeenCalled();
    });
  });
});
