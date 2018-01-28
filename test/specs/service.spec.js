import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import MiddlewareService from '@/service';
import Middleware from '@/middleware';
import MiddlewareMock from '~/mocks/MiddlewareMock';

const http = axios.create();
const mock = new MockAdapter(http);

describe('Middleware service', () => {
    const service = new MiddlewareService(http);

    afterEach(() => {
        mock.reset();
        service.reset();
    });

    afterAll(() => {
        mock.restore();
    });

    it('throws when adding the same middleware instance', () => {
        const middleware = new Middleware();

        service.register(middleware);

        expect(() => service.register(middleware)).toThrow();
    });

    it('runs the middleware in order', () => {
        expect.assertions(4);

        const request = { method: 'get', param: { test: 2 } };
        const response = { test: 3 };

        const middleware = {
            one: new MiddlewareMock(),
            two: new MiddlewareMock(),
        };

        service.register([
            middleware.one,
            middleware.two,
        ]);

        mock.onAny().reply(200, response);

        return http(request).then(() => {
            const oneMocks = middleware.one.mocks;
            const twoMocks = middleware.two.mocks;

            expect(oneMocks.onRequest).toHaveBeenCalled();
            expect(twoMocks.onRequest).toHaveBeenCalled();

            expect(oneMocks.onResponse).toHaveBeenCalled();
            expect(twoMocks.onResponse).toHaveBeenCalled();
        });
    });
});
