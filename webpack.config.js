const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const env = process.env.NODE_ENV;
const isProd = env === 'production';
const projectRoot = path.join(__dirname, './');

const config = {
    context: projectRoot,
    entry: {
        'axios-middleware': './src/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: `[name]${isProd ? '.min' : ''}.js`,
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
            '~': `${projectRoot}/test`,
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
            'process.env': env,
        }),
        // enable scope hoisting
        new webpack.optimize.ModuleConcatenationPlugin(),
    ],
};

if (isProd) {
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
