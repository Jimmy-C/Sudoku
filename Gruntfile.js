module.exports = function(grunt) {
    'use strict';

    var distPath = "dist/";
    var debugPath = "output/";

    var config = {
        env: process.env,
        pkg: grunt.file.readJSON('package.json'),
        distPath: distPath,
        debugPath: debugPath,

        copy: {
            debug: {
                files: [
                    {expand: true, cwd: 'src/', dest: '<%= debugPath %>',
                        src: 'js/**'
                    },

                    {expand: true, cwd: 'src/', dest: '<%= debugPath %>',
                        src: 'lib/**'
                    },

                    {expand: true, cwd: 'src/', dest: '<%= debugPath %>',
                        src: 'index.html'
                    }
                ]
            },

            dist: {
                files: [
                    {expand: true, cwd: 'src', dest: '<%= distPath %>',
                        src: 'js/*.js'
                    },

                    {expand: true, cwd: 'src', dest: '<%= distPath %>',
                        src: 'lib/**'
                    },
                    {expand: true, cwd: 'src', dest: '<%= debugPath %>',
                        src: 'index.html'
                    }
                ]
            }
        },

        sass: {
            debug: {
                options: {
                    style: 'expanded'
                },
                files: [{
                    src: ['src/css/sudokuApp.scss'],
                    dest: '<%= debugPath %>css/sudoku.css'
                }]
            },
            dist: [{
                options: {
                    style: 'compressed'
                },
                files: [{
                    src: ['src/css/sudokuApp.scss'],
                    dest: '<%= distPath %>css/sudoku.css'
                }]
            }]
        },

        clean: {
            debug: {src: debugPath + '/**/*'},
            dist: {src: distPath + '/**/*'}
        },

        handlebars: {
          compile: {
            options: {
              namespace: "Sudoku.templates",
              processName: function(filePath) {
                    return filePath.replace(/^src\/templates\//, '').replace(/\.handlebars$/, '');
                },
            },
            files: {
              "<%= debugPath %>templates/templates.js": "src/templates/**.handlebars"
            }
          }
        },
        concat: {
            debug: {
              options: {
                // Replace all 'use strict' statements in the code with a single one at the top
                banner: "'use strict';\n",
              },
              files: {
                '<%= debugPath %>sudoku.js': ['<%= debugPath %>/js/**/*.js'],
              },
            },
            dist: {
              options: {
                // Replace all 'use strict' statements in the code with a single one at the top
                banner: "'use strict';\n",
              },
              files: {
                '<%= distPath %>sudoku.js': ['<%= distPath %>/js/**/*.js'],
              },
            },
        }
    };

    // load all grunt npm modules
    require('load-grunt-tasks')(grunt);

    grunt.initConfig(config);

    grunt.registerTask("debug", "Unminified debug build",
        ['clean:debug', 'handlebars:compile', 'sass:debug', 'copy:debug', 'concat:debug']);

    grunt.registerTask("dist", "Minified, concatenated dist build",
        ['clean:dist', 'handlebars:compile', 'sass:dist', 'copy:dist', 'concat:dist']);
};
