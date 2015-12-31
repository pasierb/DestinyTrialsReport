// Generated on 2015-07-04 using generator-angular-heroku 0.0.2
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
  //Heroku Settings
  var pkg = grunt.file.readJSON('package.json');
  var herokuAppName = pkg.name.replace(/[^a-z0-9]/gi, '');

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };

  var BUNGIE_API_KEY = '10E792629C2A47E19356B8A79EEFA640';

  // Define the configuration for all the tasks
  grunt.initConfig({
    // Project settings
    yeoman: appConfig,

    //Heroku Settings
    mkdir: {
      heroku: {
        options: {
          create: ['heroku']
        }
      }
    },

    //Heroku Settings
    shell: {
        'heroku-create': {
            command: [
                'cd heroku',
                'heroku create ' + herokuAppName,
                'heroku config:set PORT=80 --app ' + herokuAppName
            ].join('&&')
        },
        'heroku-dyno': {
            command: [
                'cd heroku',
                'heroku ps:scale web=1 --app trials-report'
            ].join('&&')
        },
        'heroku-git-init': {
            command: [
                'cd heroku',
                'git init',
                'git remote add heroku https://git.heroku.com/trials-report.git',
                'git remote add staging https://git.heroku.com/trialsscout.git'
            ].join('&&')
        },
        'heroku-git-push': {
            command: [
                'cd heroku',
                'git add -A',
                'git commit -m "' + (grunt.option('gitm') ? grunt.option('gitm') : 'updated') + '" --allow-empty',
                'git push --force heroku master'
            ].join('&&')
        },
        'heroku-git-push-staging': {
            command: [
                'cd heroku',
                'git add -A',
                'git commit -m "' + (grunt.option('gitm') ? grunt.option('gitm') : 'updated') + '" --allow-empty',
                'git push --force staging master'
            ].join('&&')
        }, //these need to be updated still, but will work for now.
        'deploy-init': {
            command: [
                'cd heroku',
                'git init',
                'git remote add production ssh://root@destinytrialsreport.com/var/git/production.git',
                'git remote add development ssh://root@destinytrialsreport.com/var/git/development.git'
            ].join('&&')
        },
        'deploy-production': {
            command: [
                'cd heroku',
                'git add -A',
                'git commit -m "' + (grunt.option('gitm') ? grunt.option('gitm') : 'updated') + '" --allow-empty',
                'git push --force production master'
            ].join('&&')
        },
        'deploy-development': {
            command: [
                'cd heroku',
                'git add -A',
                'git commit -m "' + (grunt.option('gitm') ? grunt.option('gitm') : 'updated') + '" --allow-empty',
                'git push --force development master'
            ].join('&&')
        }
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= yeoman.app %>/components/**/*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      compass: {
        files: ['<%= yeoman.app %>/assets/css/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'postcss']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/**/*.html',
          '.tmp/assets/css/{,*/}*.css',
          '<%= yeoman.app %>/assets/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: ['.tmp', '.', appConfig.app],
          middleware: function (connect, options, middlewares) {
            middlewares.unshift(require('grunt-connect-proxy/lib/utils').proxyRequest);
            return middlewares;
          }
        },
        proxies: [{
          context: ['/ps', '/xbox'],
          host: 'localhost',
          port: 9000,
          https: false,
          xforward: false,
          rewrite: {
            '^/ps': '/#!ps',
            '^/xbox': '/#!xbox'
          }
        },
        {
          context: '/Platform',
          host: 'www.bungie.net',
          port: 80,
          https: false,
          xforward: false,
          headers: {
            'host': 'www.bungie.net',
            'X-API-Key': BUNGIE_API_KEY
          }
        }]
      },
      test: {
        options: {
          port: 9001,
          base: ['.tmp', 'test', '.', appConfig.app]
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code assets/css are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/components/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git{,*/}*',
            //Heroku Settings
            '!<%= yeoman.dist %>/Procfile',
            '!<%= yeoman.dist %>/manifest.js',
            '!<%= yeoman.dist %>/package.json',
            '!<%= yeoman.dist %>/server.js',
            '!<%= yeoman.dist %>/.gitignore'
          ]
        }]
      },
      //Heroku Settings
      heroku: {
          files: [{
              dot: true,
              src: [
                  'heroku/*',
                  '!heroku/.git*',
                  '!heroku/.gitignore',
                  '!heroku/.server.js',
                  '!heroku/.Procfile'
              ]
          }]
      },
      server: '.tmp'
    },

    postcss: {
      options: {
        processors: [
          require('autoprefixer')({
            browsers: '> 1%, last 2 versions'
          })
        ]
      },
      server: {
        options: {
          map: true
        },
        files: [{
          expand: true,
          cwd: '.tmp/assets/css/',
          src: '{,*/}*.css',
          dest: '.tmp/assets/css/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/assets/css/',
          src: '{,*/}*.css',
          dest: '.tmp/assets/css/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath:  /\.\.\//
      },
      test: {
        devDependencies: true,
        src: '<%= karma.unit.configFile %>',
        ignorePath:  /\.\.\//,
        fileTypes:{
          js: {
            block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
              detect: {
                js: /'(.*\.js)'/gi
              },
              replace: {
                js: '\'{{filePath}}\','
              }
            }
          }
      },
      sass: {
        src: ['<%= yeoman.app %>/assets/css/{,*/}*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,2}bower_components\//
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/assets/css',
        cssDir: '.tmp/assets/css',
        generatedImagesDir: '.tmp/assets/img/generated',
        imagesDir: '<%= yeoman.app %>/images',
        javascriptsDir: '<%= yeoman.app %>/assets/js',
        fontsDir: '<%= yeoman.app %>/assets/css/fonts',
        importPath: './bower_components',
        httpImagesPath: '/assets/img',
        httpGeneratedImagesPath: '/assets/img/generated',
        httpFontsPath: '/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= yeoman.dist %>/assets/img/generated'
        }
      },
      server: {
        options: {
          sourcemap: true
        }
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/components/**/*.js',
          '<%= yeoman.dist %>/shared/**/*.js',
          '<%= yeoman.dist %>/assets/js/**/*.js',
          '<%= yeoman.dist %>/assets/css/{,*/}*.css'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglify'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/assets/css/{,*/}*.css'],
      options: {
        assetsDirs: [
          '<%= yeoman.dist %>',
          '<%= yeoman.dist %>/assets/img',
          '<%= yeoman.dist %>/assets/css'
        ]
      }
    },

    imagemin: {
      //jpg: {
      //  options: {
      //    progressive: true
      //  }
      //},
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/assets/img',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/assets/img'
        }, {
          expand: true,
          cwd: '<%= yeoman.app %>/assets/img/icons',
          src: '*.{png,ico}',
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/assets/img',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/assets/img'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeComments: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          removeAttributeQuotes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'components/{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    ngtemplates: {
      trialsReportApp: {
        cwd: '<%= yeoman.app %>',
        src: '**/*.html',
        dest: '.tmp/templates.js',
        options: {
          usemin: 'app.js',
          htmlmin: '<%= htmlmin.dist %>'
        }
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat',
          src: '{,**/}*.js',
          dest: '.tmp/concat'
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      //Heroku Settings
      heroku: {
          files: [{
              expand: true,
              dest: 'heroku',
              src: ['package.json', 'server.js', 'manifest.json']
          }, {
              expand: true,
              dot: true,
              cwd: '<%= yeoman.app %>',
              dest: 'heroku',
              src: [
                  '**'
              ]
          }]
      },
      herokumin: {
          files: [{
              expand: true,
              dest: 'heroku',
              src: ['package.json', 'server.js']
          }, {
              expand: true,
              dot: true,
              cwd: '<%= yeoman.dist %>',
              dest: 'heroku',
              src: [
                  '**'
              ]
          }]
      },
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt,json}',
            '*.html',
            'components/{,*/}*.html',
            'shared/{,*/}*.html',
            'assets/img/{,*/}*.{webp}',
            'assets/css/fonts/{,*/}*.*',
            'lib/{,*/}*.*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/assets/img',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: '.',
          dest: '<%= yeoman.dist %>',
          src: ['manifest.js']
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/assets/css',
        dest: '.tmp/assets/css/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'compass:server'
      ],
      test: [
        'compass'
      ],
      dist: [
        'compass:dist',
        'imagemin',
        'svgmin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    }
  });

  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'concurrent:server',
      'postcss:server',
      'configureProxies:livereload',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'wiredep',
    'concurrent:test',
    'postcss',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'postcss',
    'ngtemplates',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);

  grunt.registerTask('deploy', function(method) {
    switch(method) {
      case 'init':
        grunt.task.run(['shell:deploy-init']);
      break;

      case 'production':
        grunt.task.run(['shell:deploy-production']);
      break;

      case 'development':
        grunt.task.run(['shell:deploy-development']);
      break;
    }
  });

  //Heroku Settings
  grunt.registerTask('heroku', function(method) {
      if (typeof grunt.option('min') === 'undefined') {
          grunt.option('min', true);
      }
      if (grunt.option('min')) {
          grunt.option('cwd', 'dist');
      } else {
          grunt.option('cwd', 'app');
      }
      if(method === 'init') {
        grunt.task.run([
            'mkdir:heroku'
        ]);
      }
      grunt.task.run([
          'clean:heroku',
      ]);
      if (grunt.option('min')) {
          grunt.task.run([
              'copy:herokumin'
          ]);
      } else {
          grunt.task.run([
              'copy:heroku'
          ]);
      }
      switch (method) {
          case 'init':
              grunt.task.run([
                  'shell:heroku-git-init',
                  'shell:heroku-dyno'
              ]);
              break;
          case 'push':
              grunt.task.run([
                  'shell:heroku-git-push'
              ]);
              break;
          case 'staging':
              grunt.task.run([
                  'shell:heroku-git-push-staging'
              ]);
              break;
          default:
              console.log('heroku:' + method + ' is not a valid target.');
              break;
      }
  });
};
