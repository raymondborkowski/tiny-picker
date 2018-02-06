# tiny-picker

*Ultra light weight date picker. There are no external dependencies involved.*
![Optional Text](./docs/example.png)
## Install

` npm install tiny-picker --save`

## Use

Bind to input:

```
<input type="text" class="dp" />
<input type="text" class="dp" />
```
In Javascript:<br>
```new TinyPicker('.dp');```
<br><br>
In HTML:<br>
```new window.TinyPicker('.datepicker');```

#### Options:
*TinyPicker also takes in options as seen below*
```
new TinyPicker('.dp', {
    // Date  output format
    outputFormat:'%Y-%m-%d',
    // Auto open next calendar picker for next item in input collection
    autoOpen: true
});
```

## Developing and contributing to tiny-picker
### Folder structure
The main body of code is in `src/index.js` but the bablified code lives under `lib/index.js`

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

`npm run lint_fix` will also automatically fix any linting errors.

## License

[MIT](https://github.com/raymondborkowski/4loop/blob/master/LICENSE)
