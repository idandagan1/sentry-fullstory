import { EventHint } from '@sentry/types';

/**
 * Split the URL into different parts
 * taken from https://stackoverflow.com/questions/736513/how-do-i-parse-a-url-into-hostname-and-path-in-javascript
 * @param {string} url
 */
const splitUrlIntoParts = (url: string) => {
  const reURLInformation = new RegExp(
    [
      '^(https?:)//', // protocol
      '(([^:/?#]*)(?::([0-9]+))?)', // host (hostname and port)
      '(/{0,1}[^?#]*)', // pathname
      '(\\?[^#]*|)', // search
      '(#.*|)$' // hash
    ].join('')
  );
  return url.match(reURLInformation);
};

/**
 * Get the project ID from a Sentry DSN
 * @param {string} dsn
 */
export const getProjectIdFromSentryDsn = (dsn: string) => {
  const search = splitUrlIntoParts(dsn)[5];
  return search.replace('/', '');
};

const isError = (exception: string | Error): exception is Error => {
  return (exception as Error).message !== undefined;
};

/**
 * Get the message and name properties from the original exception
 * @param {EventHint} hint
 */
export const getOriginalExceptionProperties = (hint: EventHint) => {
  if (isError(hint.originalException)) {
    const originalException = hint.originalException as Error;
    const { name, message } = originalException;
    return { name, message };
  }

  return {};
};
