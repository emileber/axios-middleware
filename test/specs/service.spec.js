import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { HttpMiddlewareService, HttpMiddleware } from '../../dist/axios-middleware.common';
import MiddlewareMock from '../mocks/MiddlewareMock';

const http = axios.create();
const mock = new MockAdapter(http);

describe('Middleware service', () => {
    const service = new HttpMiddlewareService(http);

    afterEach(() => {
        mock.reset();
        service.reset();
    });

    afterAll(() => {
        mock.restore();
    });

    it('throws when adding the same middleware instance', () => {
        const middleware = new HttpMiddleware();

        service.register(middleware);

        expect(() => service.register(middleware)).toThrow();
    });

    it('works with both middleware syntaxes', () => {
        const middleware = new MiddlewareMock();
        const simplifiedSyntax = {
            onRequest: jest.fn(config => config),
        };

        service.register([
            middleware,
            simplifiedSyntax,
        ]);

        // eslint-disable-next-line no-underscore-dangle
        service._onRequest();

        expect(middleware.onRequest).toHaveBeenCalled();
        expect(simplifiedSyntax.onRequest).toHaveBeenCalled();
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
            expect(response.data.test).toBe('-req1--req2--resp2--resp1-');
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
});
