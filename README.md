# tiny-picker

*Ultra light weight date picker. There are no external dependencies involved.*

## Install

` npm install tiny-picker --save`

## Use

## Developing and contributing to 4loop

### Folder structure

The main body of code is in `src/index.js`.

The tests are in the `test/spec` directory. Please follow naming convention with `xxxx.spec.js`

### Running tests

We use [Feather-test](https://www.npmjs.com/package/feather-test) which is similar to jasmine for unit tests. Unless there is a very compelling reason to use something different, please continue using Feather for tests. The existing tests are in the spec folder. Here are some useful command shortcuts:

#### Run all the tests:

`npm test`

#### Run only some tests:

`npm test --run=nameOfFile`

### Before submitting a pull request

Please make sure all code supports all versions of node. We write code in ES6 syntax but than transpile it to ES5 for browser coverage.

We use ESLint for syntax consistency, and the linting rules are included in this repository. Running `npm test` will check the linting rules as well. Please make sure your code has no linting errors before submitting a pull request.

`eslint . --fix` will also automatically fix any linting errors.

## License

[MIT](https://github.com/raymondborkowski/4loop/blob/master/LICENSE)
