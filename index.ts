import fetch from 'cross-fetch';

export interface UrlLiveCheckOptions {
    method?: string;
    validateSSL?: boolean;
    range?: string;
    customHeaders?: Record<string, string>;
    allowAuth?: boolean;
    userAgent?: string;
    responseTime?: boolean;
    reportStatus?: boolean;
    ignoreNetworkErrors?: boolean;
    checkContent?: boolean;
}

const defaultOptions: UrlLiveCheckOptions = {
    method: 'HEAD',
    validateSSL: false,
    range: 'bytes=0-1',
    userAgent: 'Mozilla/5.0 (url-live-check)',
    reportStatus: false,
    ignoreNetworkErrors: false,
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

    if (response.type === 'error' || response.status === 0) {
        return false;
    }

    if (!options.validateSSL && response.url.startsWith('https:')) {
        console.warn('SSL validation is disabled, which is insecure.');
    }

    if (options.checkContent) {
        try {
            const text = await response.text(); // get the response body
            return text.length > 0;
        } catch (e) {
            console.error('Error while reading response text:', e);
            return false;
        }
    }

    console.log(response);

    return response.status >= 200 && response.status < 300;

};


export const urlLiveCheck = async (url: string, options: UrlLiveCheckOptions = {}): Promise<boolean> => {
    const opts: UrlLiveCheckOptions = { ...defaultOptions, ...options };
    const headers = setupHeaders(opts);

    let response: Response;
    try {
        response = await fetch(url, {
            method: opts.method,
            headers: headers,
        });
    } catch (error) {

        if (opts.ignoreNetworkErrors) {
            console.warn('Network error ignored:', error);
            return true;
        }

        console.error('Error while fetching:', error);

        if (error instanceof Error && error.name === 'AbortError') {
            console.error('Request was aborted due to timeout:', error.message);
        }

        return false;
    }

    return checkResponseStatus(response, opts);
};

