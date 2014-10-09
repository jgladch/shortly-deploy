module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      client: {
        src: ['public/client/*.js', 'public/lib/*.js'],
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
          watch: ['app/**/*', 'lib/**/*', 'server-config.js', 'server.js'],
          ignore: ['public/dist/**/*.*']
        }
      }
    },

    uglify: {
      client: {
        files: {
          'public/dist/client.min.js': ['public/dist/client.js']
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
        ],
        tasks: [
          'build'
        ]
      },
      css: {
        files: ['public/*.css', '!public/*.min.css'],
        tasks: ['cssmin']
      }
    },

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
    },
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
    'uglify'
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
