export default function parseUrl(url, params) {
  return url.replace(/(:)([A-Za-z][A-Za-z0-9]*)/g, (match, $1, $2) => {
    const paramType  = typeof params[$2];
    if (paramType !== 'string' && paramType !== 'number') {
      throw new Error(`Param ${$2} from url ${url}, not found in params object`);
    }
    return params[$2];
  });
}
