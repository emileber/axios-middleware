const path = require('path');
const buble = require('rollup-plugin-buble');
const replace = require('rollup-plugin-replace');
const pkg = require('../package.json');

const version = process.env.VERSION || pkg.version;
const name = 'axios-middleware';
const banner = `/**
 * ${name} v${version}
 * (c) ${new Date().getFullYear()} Émile Bergeron
 * @license MIT
 */`;

const resolve = _path => path.resolve(__dirname, '../', _path);

const configs = {
  umdDev: {
    input: resolve('src/index.js'),
    file: resolve(`dist/${name}.js`),
    format: 'umd',
    env: 'development',
  },
  umdProd: {
    input: resolve('src/index.js'),
    file: resolve(`dist/${name}.min.js`),
    format: 'umd',
    env: 'production',
  },
  commonjs: {
    input: resolve('src/index.js'),
    file: resolve(`dist/${name}.common.js`),
    format: 'cjs',
  },
  esm: {
    input: resolve('src/index.esm.js'),
    file: resolve(`dist/${name}.esm.js`),
    format: 'es',
  },
};

function genConfig(opts) {
  const config = {
    input: {
      input: opts.input,
      plugins: [
        replace({
          __VERSION__: version,
        }),
        buble(),
      ],
    },
    output: {
      banner,
      file: opts.file,
      format: opts.format,
      name: 'AxiosMiddleware',
    },
  };

  if (opts.env) {
    config.input.plugins.unshift(replace({
      'process.env.NODE_ENV': JSON.stringify(opts.env),
    }));
  }

  return config;
}

function mapValues(obj, fn) {
  const res = {};
  Object.keys(obj).forEach((key) => {
    res[key] = fn(obj[key], key);
  });
  return res;
}

module.exports = mapValues(configs, genConfig);
