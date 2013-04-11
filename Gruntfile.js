/* Copyright 2013 Treode, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module.exports = function (grunt) {

  grunt.initConfig ({

    pkg: grunt.file.readJSON ('package.json'),

    copy: {
      dev: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['**/*.{css,js}'],
          dest: 'dev/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'nocdn/',
          src: ['**/*.{css,js}'],
          dest: 'dist/nocdn/'
        }]
      },
      stage: {
        files: [{
          expand: true,
          cwd: 'nocdn/',
          src: ['**/*.{css,js}'],
          dest: 'stage/nocdn/'
        }]
      }},

    cssmin: {
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.css': ['src/movies.css']
        }},
      stage: {
        files: {
          'stage/<%= pkg.name %>.min.css': ['src/movies.css']
        }}},

    jade: {
      // Target dev uses files served locally.
      dev: {
        options: {
          pretty: true,
          data: {
            store: 'http://movies.store.localhost:1275'
          }},
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['**/*.jade'],
          dest: 'dev/',
          ext: '.html'
        }]
      },

      // Targets stage and dist use files from CDNs.
      dist: {
        options: {
          data: {
            prod: true,
            store: 'https://movies.store.treode.com'
          }},
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['**/*.jade'],
          dest: 'dist/',
          ext: '.html'
        }]
      },

      stage: {
        options: {
          data: {
            prod: true,
            store: 'http://movies.store.localhost:1275'
          }},
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['**/*.jade'],
          dest: 'stage/',
          ext: '.html'
        }]
      }},

    jshint: {
      files: ['src/**/*.js'],
      options: {
        browser: true,
        globalstrict: true,
        globals: {
          angular: true,
          store: true
        },
        jquery: true
      }},

    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/**/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      },
      stage: {
        src: ['src/**/*.js'],
        dest: 'stage/<%= pkg.name %>.js'
      }},

    uglify: {
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }},
      stage: {
        files: {
          'stage/<%= pkg.name %>.min.js': ['<%= concat.stage.dest %>']
        }}},

    watch: {
      script: {
        files: ['src/**/*.{css,jade,js}'],
        tasks: ['jshint', 'copy:dev', 'jade:dev']
      }
    },

    clean: {
      dev: ['dev'],
      dist: ['dist'],
      stage: ['stage']
    }});

  grunt.loadNpmTasks ('grunt-contrib-clean');
  grunt.loadNpmTasks ('grunt-contrib-concat');
  grunt.loadNpmTasks ('grunt-contrib-copy');
  grunt.loadNpmTasks ('grunt-contrib-cssmin');
  grunt.loadNpmTasks ('grunt-contrib-jade');
  grunt.loadNpmTasks ('grunt-contrib-jshint');
  grunt.loadNpmTasks ('grunt-contrib-uglify');
  grunt.loadNpmTasks ('grunt-contrib-watch');


  // dev uses readable JS, cached libraries and a local Treode server
  grunt.registerTask ('dev', ['jshint', 'copy:dev', 'jade:dev']);

  // dist uses minified JS/CSS, libraries from CDNs, and the production Treode server
  grunt.registerTask ('dist',
    ['jshint', 'copy:dist', 'cssmin:dist', 'jade:dist', 'concat:dist', 'uglify:dist']);

  // stage uses minified JS/CSS, libraries from CDNs, and the local Treode server
  grunt.registerTask ('stage',
    ['jshint', 'copy:stage', 'cssmin:stage', 'jade:stage', 'concat:stage', 'uglify:stage']);

  grunt.registerTask ('default', ['dist']);
};
