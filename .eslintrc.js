module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'airbnb-base',
    ],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    rules: {
    // Indent with 4 spaces
        indent: ['error', 4],
        'linebreak-style': ['error', 'windows'],
        'no-plusplus': 'off',
        'class-methods-use-this': 'off',
        'no-param-reassign': 'off',
    },
};
