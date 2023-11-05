# url-live-check

> Verify the existence of a website or URL

This Node.js module checks if a given website is up and accessible. It is designed to work both in Node.js and the browser (with a bundler)

## Install

```sh
npm install url-live-check
```

```sh
yarn add url-live-check
```

```sh
pnpm add url-live-check
```

## Usage

```js
import { urlLiveCheck, UrlLiveCheckOptions } from 'url-live-check';

(async () => {
  const options: UrlLiveCheckOptions = {
    method: 'GET', // Optional: Specify HTTP method ('HEAD' or 'GET'), default is 'HEAD'
    timeout: 7000, // Optional: Timeout in milliseconds, default is 5000
    validateSSL: true, // Optional: Validate SSL certificate, default is true
    // Other options...
  };

  const websiteExists = await urlLiveCheck('https://example.com', options);
  console.log(websiteExists); //=> true or false
})();
```

## API

### urlLiveCheck(url, [options])

Returns a `Promise` that resolves to `true` if the website is accessible, or `false` otherwise.

#### url

Type: `string`

The URL of the website to check.

#### options

Type: `object`

The `UrlLiveCheckOptions` object, with all the options you can specify:

- `method`: HTTP method to use (`HEAD` or `GET`). Default is `'HEAD'`.
- `timeout`: Timeout in milliseconds. Default is `5000`.
- `validateSSL`: Whether to validate SSL certificates. Default is `true`.
- `range`: Range of bytes to fetch. Default is `'bytes=0-1'`.
- `customHeaders`: Custom headers to include in the request.
- `allowAuth`: Whether to allow authorization. Default is `false`.
- `userAgent`: User-Agent header to set for the request. Default is `'Mozilla/5.0 (url-live-check)'`.
- `responseTime`: Whether to log the response time. Default is `false`.
- `reportStatus`: Whether to log the response status. Default is `false`.
- `ignoreNetworkErrors`: Return `true` on network errors. Default is `false`.
