module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    files: [
      'components/jquery/jquery.js',
      'components/lodash/lodash.js',
      'components/backbone/backbone.js',
      'components/backbone.class/backbone.class.js',
      'components/backbone.error/backbone-error.js',
      'src/**/*.js',

      'components/chai/chai.js',
      'components/sinon/pkg/sinon.js',
      'components/sinon-chai/lib/sinon-chai.js',
      'tests/test.config.js',
      'tests/**/*.test.js'
    ],

    plugins: [
      'karma-mocha',
      'karma-osx-reporter',
      'karma-chrome-launcher'
    ],

    exclude: [
    ],

    reporters: ['progress', 'osx'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    captureTimeout: 60000,
    singleRun: false
  });
};
