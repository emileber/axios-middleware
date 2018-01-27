const path = require('path');
const webpack = require('webpack');
const projectRoot = path.join(__dirname, '..');

const config = {
    output: {
        library: 'AxiosMiddleware',
        libraryTarget: 'umd'
    },
    externals: {
        axios: 'axios'
    },
    resolve: {
        alias: {
            '@': `${projectRoot}/src`,
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [`${projectRoot}/src`],
            },
        ]
    },
    plugins: []
};

if (process.env.NODE_ENV === 'production') {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        })
    );
}

module.exports = config;
