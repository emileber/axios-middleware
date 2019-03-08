/* eslint-disable no-use-before-define, prefer-template, consistent-return */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const uglify = require('uglify-js');
const rollup = require('rollup');
const configs = require('./configs');

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

build(Object.keys(configs).map(key => configs[key]));

function build(builds) {
  let built = 0;
  const total = builds.length;
  const next = () => {
    buildEntry(builds[built]).then(() => {
      built++;
      if (built < total) {
        next();
      }
    }).catch(logError);
  };

  next();
}

function buildEntry({ input, output }) {
  const isProd = /min\.js$/.test(output.file);
  return rollup.rollup(input)
    .then(bundle => bundle.generate(output))
    .then(({ code }) => {
      if (isProd) {
        const minified = (output.banner ? output.banner + '\n' : '') + uglify.minify(code, {
          output: { ascii_only: true },
        }).code;
        return write(output.file, minified, true);
      }
      return write(output.file, code);
    });
}

function write(dest, code, zip) {
  return new Promise((resolve, reject) => {
    function report(extra) {
      logError(blue(path.relative(process.cwd(), dest)) + ' ' + getSize(code) + (extra || ''));
      resolve();
    }

    fs.writeFile(dest, code, (err) => {
      if (err) return reject(err);
      if (zip) {
        zlib.gzip(code, (error, zipped) => {
          if (error) return reject(error);
          report(' (gzipped: ' + getSize(zipped) + ')');
        });
      } else {
        report();
      }
    });
  });
}

function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb';
}

function logError(e) {
  // eslint-disable-next-line no-console
  console.log(e);
}

function blue(str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m';
}
