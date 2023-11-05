import fetch from 'cross-fetch';

export interface UrlLiveCheckOptions {
    method?: string;
    timeout?: number;
    validateSSL?: boolean;
    range?: string;
    customHeaders?: Record<string, string>;
    allowAuth?: boolean;
    userAgent?: string;
    responseTime?: boolean;
    reportStatus?: boolean;
    ignoreNetworkErrors?: boolean;
}

const defaultOptions: UrlLiveCheckOptions = {
    method: 'HEAD',
    timeout: 5000,
    validateSSL: true,
    range: 'bytes=0-1',
    userAgent: 'Mozilla/5.0 (url-live-check)',
    reportStatus: false,
    ignoreNetworkErrors: false,
};

const createAbortSignal = (timeout: number): [AbortController, NodeJS.Timeout] => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    return [controller, timeoutId];
};

const setupHeaders = (options: UrlLiveCheckOptions): Headers => {
    const headers = new Headers(options.customHeaders);

    if (options.range) {
        headers.set('Range', options.range);
    }

    if (options.userAgent) {
        headers.set('User-Agent', options.userAgent);
    }

    return headers;
};

const checkResponseStatus = async (response: Response, options: UrlLiveCheckOptions): Promise<boolean> => {
    if (options.responseTime) {
        const responseTime = response.headers.get('X-Response-Time');
        if (responseTime) {
            console.log('Response time:', responseTime, 'ms');
        }
    }

    if (!options.validateSSL && response.url.startsWith('https:')) {
        console.warn('SSL validation is disabled, which is insecure.');
    }

    // Return true only if the response.ok is true (status 200-299).
    return response.ok;
};

export const urlLiveCheck = async (url: string, options: UrlLiveCheckOptions = {}): Promise<undefined | boolean> => {
    const opts: UrlLiveCheckOptions = { ...defaultOptions, ...options };
    const [controller, timeoutId] = createAbortSignal(opts.timeout!);
    const headers = setupHeaders(opts);

    try {
        const response = await fetch(url, {
            method: opts.method,
            headers: headers,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);
        return await checkResponseStatus(response, opts);
    } catch (error) {
        clearTimeout(timeoutId);
        console.error('Error while fetching:', error);

        if (error instanceof Error && error.name === 'AbortError') {
            console.error('Request timed out:', error.message);
        }

        return opts.ignoreNetworkErrors;
    }
};
