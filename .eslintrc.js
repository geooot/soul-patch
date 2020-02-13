
module.exports = {
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
    rules: {
        indent: ["error", 4],
        "@typescript-eslint/no-explicit-any": 0
    },
    parserOptions: {
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: "module" // Allows for the use of imports
    },
    env: {
        node: true,
        es6: true
    },
};