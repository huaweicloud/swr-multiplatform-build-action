module.exports = {
    extends: [
        '@cloud/eslint-config-cbc/typescript',
    ],
    globals: {
    },
    rules: {
        // 由于ts语法variable?.func()写法，导致误报no-unused-expressions，故关闭此规则
        'no-unused-expressions': 'off',

        // ts允许在构造函数里面对成员变量进行隐式的声明，导致误报no-useless-constructor，故关闭此规则
        'no-useless-constructor': 'off',
    },
};
