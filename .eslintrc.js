// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,

    parserOptions: {
        parser: 'babel-eslint',
        sourceType: 'module',
    },
    env: {
        browser: true,
    },
    extends: [
        'airbnb-base',
    ],

    // check if imports actually resolve
    settings: {
        'import/resolver': {
            webpack: {
                config: 'webpack.config.js',
            },
        },
    },
    // add your custom rules here
    rules: {
        'no-duplicate-imports': 'error',
        // risk only exist with semi-colon auto insertion. Not our case.
        'no-plusplus': 'off',
        'no-underscore-dangle': ['error', {
            'allowAfterSuper': true,
            'allowAfterThis': true,
        }],
        'class-methods-use-this': 'off',
        'indent': ['error', 4, {
            SwitchCase: 1,
        }],
        // don't require .js extension when importing
        'import/extensions': ['error', 'always', { js: 'never' }],
        // allow optionalDependencies
        'import/no-extraneous-dependencies': ['error', {
            optionalDependencies: ['test/unit/index.js'],
        }],
        'import/prefer-default-export': 'off',
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    },
};
