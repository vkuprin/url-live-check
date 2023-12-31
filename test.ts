import { urlLiveCheck } from './index';

const website = 'https://vkuprin.com';
const notExistingWebsite = 'https://vkuprin.com/does-not-exist';


describe('urlLiveCheck', () => {
    test('returns true when website is reachable using HEAD method', async () => {
        const exists = await urlLiveCheck(website, { method: 'HEAD' });
        expect(exists).toBeTruthy();
    });

    test('returns false when website is not reachable', async () => {
        const notExists = await urlLiveCheck('https://asdfasfasfdasf.com', { method: 'GET', checkContent: true },);
        console.log(notExists);
        expect(notExists).toBeFalsy();
    });

    test('handles custom headers correctly', async () => {
        const customHeaders = {
            'X-Custom-Header': 'TestValue',
        };
        const exists = await urlLiveCheck(website, { customHeaders });
        expect(exists).toBeTruthy();
    });

    test('returns true when website is reachable using GET method', async () => {
        const exists = await urlLiveCheck(website, { method: 'GET' });
        expect(exists).toBeTruthy();
    });

    test('returns true when ignoreNetworkErrors is true and fetch fails', async () => {
        const exists = await urlLiveCheck(notExistingWebsite, { ignoreNetworkErrors: true });
        expect(exists).toBeTruthy();
    });

    test('handles range headers correctly', async () => {
        const exists = await urlLiveCheck(website, { range: 'bytes=0-100' });
        expect(exists).toBeTruthy();
    });

    test('handles custom userAgent correctly', async () => {
        const customUserAgent = 'MyCustomAgent/1.0';
        const exists = await urlLiveCheck(website, { userAgent: customUserAgent });
        expect(exists).toBeTruthy();
    });

    test('reports status correctly when option is set', async () => {
        const exists = await urlLiveCheck(website, { reportStatus: true });
        expect(exists).toBeTruthy();
    });

    test('records response time when option is set', async () => {
        const exists = await urlLiveCheck(website, { responseTime: true });
        expect(exists).toBeTruthy();
    });
});
