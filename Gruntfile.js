'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var yeomanConfig = {
    name: 'backbone.serializers',
    src: 'src'
  };

  try {
    yeomanConfig.src = require('./component.json').appPath || yeomanConfig.src;
  } catch (e) {}

  grunt.initConfig({
    yeoman: yeomanConfig,

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.src %>/{,*/}*.js'
      ]
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },

    preprocess: {
      js: {
        src: 'build.js',
        dest: '<%= yeoman.name %>.js'
      }
    },
    uglify: {
      dist: {
        files: {
          '<%= yeoman.name %>.min.js': [
            '<%= yeoman.name %>.js'
          ]
        }
      }
    }
  });

  grunt.registerTask('test', [
    'karma'
  ]);

  grunt.registerTask('build', [
    'test',
    'preprocess:js',
    'uglify'
  ]);

  grunt.registerTask('default', ['build']);
};
