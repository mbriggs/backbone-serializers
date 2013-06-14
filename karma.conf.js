// Karma configuration

// base path, that will be used to resolve files and exclude
basePath = '';

// list of files / patterns to load in the browser
files = [
  MOCHA,
  MOCHA_ADAPTER,
  'app/components/es5-shim/es5-shim.js',
  'app/components/es6-shim/es6-shim.js',

  'app/components/lodash/lodash.js',
  'app/components/jquery/jquery.js',
  'app/components/backbone/backbone.js',

  'app/components/mocha/mocha.js',
  'app/components/sinon/lib/sinon.js',
  'app/components/chai/chai.js',
  'app/components/sinon-chai/lib/sinon-chai.js',

  'src/class.js',
  'src/backbone.serializer.js',
  'src/backbone.deserializer.js',

  'test/spec.config.js',
  'test/**/*.js'
];

// list of files to exclude
exclude = [];

// test results reporter to use
// possible values: dots || progress || growl
reporters = ['progress'];

// web server port
port = 8080;

// cli runner port
runnerPort = 9100;

// enable / disable colors in the output (reporters and logs)
colors = true;

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;

// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['PhantomJS', 'Chrome', 'Firefox', 'Safari'];

// If browser does not capture in given timeout [ms], kill it
captureTimeout = 10000;

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
