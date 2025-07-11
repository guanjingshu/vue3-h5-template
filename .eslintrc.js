module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    'plugin:prettier/recommended'
  ],
  rules: {
    'prettier/prettier': 'error',
    eqeqeq: 2, // 强制使用 === 和 !==
    'no-var': 2, // 禁止使用 var 声明变量
    'prefer-const': 2, // 使用 const 声明那些声明后不再被修改的变量
    // 更多规则...
  }
}
