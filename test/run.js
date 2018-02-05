var FeatherTestBrowser = require('feather-test-browser');

// create a new test suite with your spec files
var myTests = new FeatherTestBrowser({
    specs: './specs'
});

// run your tests and get a link to run them again in any browser
myTests.run(callback);
