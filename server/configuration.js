const nconf = require('nconf');
const yaml = require('js-yaml');

const confPath = process.env.READER_CONF;

if (!confPath) {
  throw new Error("Path to configuration file must be defined in en READER_CONF");
} else {
  nconf.file({
    file: confPath,
    format: {
      parse: (obj, options) => yaml.safeLoad(obj),
      stringify: (obj, options) => yaml.safeDump(obj),
    }
  });
}

export default nconf;
