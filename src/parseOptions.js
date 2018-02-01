export default function parseOptions(opt, modifier) {
  const options = opt || {};
  return typeof modifier === 'function'
    ? modifier(options)
    : options;
};
