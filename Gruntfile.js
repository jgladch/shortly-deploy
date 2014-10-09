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
    shell: {
      options: {
        stdout: true,
        stderr: true,
        async: true,
        failOnError: true
      },
      mongodev: {
        command: 'mongod --dbpath db/mongo'
      },
      mongotest: {
        command: 'mongod --dbpath db/test'
      },
      nodemon: {
        command: 'grunt nodemon'
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
  grunt.loadNpmTasks('grunt-shell-spawn');

  grunt.registerTask('server-dev', [ 'shell:nodemon', 'shell:mongodev', 'watch' ]);

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'shell:mongotest',
    'jshint',
    'force:on',
    'mochaTest',
    'force:restore',
    'shell:mongotest:kill'
  ]);

  var previous_force_state = grunt.option("force");

  grunt.registerTask("force",function(set){
    if (set === "on") {
      grunt.option("force",true);
    }
    else if (set === "off") {
      grunt.option("force",false);
    }
    else if (set === "restore") {
      grunt.option("force",previous_force_state);
    }
  });

  grunt.registerTask('build', [
    'concat',
    'uglify',
    'cssmin'
  ]);

  grunt.registerTask('upload', function(n) {
    grunt.task.requires('mochaTest');
    if(grunt.option('prod')) {
      grunt.task.run(['gitpush']);
    } else {
      grunt.task.run(['build', 'server-dev']);
    }
  });

  grunt.registerTask('deploy', ['test', 'upload']);


};
