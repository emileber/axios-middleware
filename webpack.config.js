const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const projectRoot = path.join(__dirname, '..');

const config = {
    context: projectRoot,
    output: {
        library: 'AxiosMiddleware',
        libraryTarget: 'umd',
        libraryExport: 'default',
        umdNamedDefine: true,
    },
    externals: {
        axios: 'axios',
    },
    resolve: {
        extensions: ['.js', '.json'],
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
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': process.env.NODE_ENV,
        }),
        // enable scope hoisting
        new webpack.optimize.ModuleConcatenationPlugin(),
    ],
};

if (process.env.NODE_ENV === 'production') {
    config.plugins.push(
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    warnings: false,
                },
            },
            parallel: true,
        }),
    );
}

module.exports = config;
