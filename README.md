# tiny-picker

*Ultra light weight date picker. There are no external dependencies involved.*<br><br>
![Optional Text](./docs/example.png)
## Install

` npm install tiny-picker --save`

## Use

Bind to input:

```html
<input type="text" class="TinyPicker" />
<input type="text" class="TinyPicker" />
```
To have preselected dates:
```html
    <input type="text" class="TinyPicker" id="startDate" value="2018-10-22">
    <input type="text" class="TinyPicker" value="2018-11-04">
```
In Javascript:<br>
```js
new TinyPicker();
```
<br><br>
In HTML:<br>
```js
new window.TinyPicker();
```

#### Options:
*TinyPicker also takes in options as seen below*
```js
new TinyPicker({
            firstBox:document.getElementById('startDate'), // Overrides us finding the first input box
            lastBox: document.getElementById('endDate'), // Overrides us finding the last input box
            monthsToShow: 2, // How many months to display
            preChoose:10, // After the user selects the first date, how many days in the future do you want us to prehighlight
            days: ['Su','Mo','Tu','We','Th','Fr','Sa'], // Override for day abbreviations in the calendar
            selectToday: true, // Allow the user to select the current date
            local: 'es-US', // Specifiy the language and date format. < IE 10 defaults to en-US
        });
```

## Developing and contributing to tiny-picker
### Folder structure
The main body of code is in `index.js`

The tests are in the `test/spec` directory. Please follow naming convention with `xxxx.spec.js`

### Running tests

We use [Feather-test](https://www.npmjs.com/package/feather-test) which is similar to jasmine for unit tests. Unless there is a very compelling reason to use something different, please continue using Feather for tests. The existing tests are in the spec folder. Here are some useful command shortcuts:

#### Run all the tests:

`npm test`

#### Run only some tests:

`npm test --run=nameOfFile`

### Before submitting a pull request

Please make sure all code supports all versions of node. We write code in ES5 syntax for smaller size and browser compatibility.

We use ESLint for syntax consistency, and the linting rules are included in this repository. Running `npm test` will check the linting rules as well. Please make sure your code has no linting errors before submitting a pull request.

`npm run lint_fix` will also automatically fix any linting errors.

## License

[MIT](https://github.com/raymondborkowski/4loop/blob/master/LICENSE)
