'use strict';

module.exports = function (grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  var config = {
    name: 'backbone.serializers',
    src: 'src'
  };

  try {
    config.src = require('./component.json').appPath || config.src;
  } catch (e) {}

  grunt.initConfig({
    config: config,

    preprocess: {
      js: {
        src: 'build.js',
        dest: '<%= config.name %>.js'
      }
    },

    uglify: {
      dist: {
        files: {
          '<%= config.name %>.min.js': [
            '<%= config.name %>.js'
          ]
        }
      }
    }
  });

  grunt.registerTask('build', [
    'preprocess:js',
    'uglify'
  ]);

  grunt.registerTask('default', ['build']);
};
