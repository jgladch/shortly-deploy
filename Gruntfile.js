module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
        stripBanners: true,
        sourceMap: true
      },
      lib: {
        src : [
          'public/lib/jquery.js',
          'public/lib/underscore.js',
          'public/lib/backbone.js',
          'public/lib/handlebars.js'
        ],
        dest: 'public/dist/lib.js'
      },
      client: {
        src: [
          'public/client/app.js',
          'public/client/link.js',
          'public/client/links.js',
          'public/client/linkView.js',
          'public/client/linksView.js',
          'public/client/createLinkView.js',
          'public/client/router.js'
            ],
        dest: 'public/dist/client.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          watch: ['app/**/*', 'lib/**/*', 'server-config.js', 'server.js', 'Gruntfile.js'],
          ignore: ['public/dist/**/*.*']
        }
      }
    },

    uglify: {
      options: {
        sourceMap: true
      },
      client: {
        options: {
          sourceMapIn: 'public/dist/client.js.map'
        },
        files: {
          'public/dist/client.min.js': ['public/dist/client.js']
        }
      },
      lib: {
        options: {
          sourceMapIn: 'public/dist/lib.js.map'
        },
        files: {
          'public/dist/lib.min.js' : ['public/dist/lib.js']
        }
      }
    },

    jshint: {
      files: [
        '**/*.js'
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js',
          'node_modules/**/*.js',
          'test/**/*.js'
        ]
      }
    },

    cssmin: {
      minify: {
        src: 'public/style.css',
        dest: 'public/style.min.css'
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
          'Gruntfile.js'
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: [
          'public/*.css',
          '!public/*.min.css'
        ],
        tasks: ['cssmin']
      }
    },
    //Maybe refactor the gitpush into the below shell
    shell: {
      prodServer: {
      }
    },

    gitpush: {
      azure: {
        options: {
          remote: 'azure',
          branch: 'master'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-git');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'jshint',
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'concat',
    'uglify',
    'cssmin'
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      grunt.task.run(['gitpush']);
    } else {
      grunt.task.run([ 'build', 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
      'test',
      'upload'
  ]);


};
