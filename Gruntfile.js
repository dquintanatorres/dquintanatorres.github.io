'use strict';
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'js/*.js',
        '!js/main.js'
      ]
    },
    watch: {
      js: {
        files: [
          '<%= jshint.all %>'
        ],
        tasks: ['jshint', 'uglify', 'surround'],
        options: {
          livereload: true
        }
      },
    },
    uglify: {
      dist: {
        options: {
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */',
          compress: true,
          beautify: false,
          mangle: false
        },
        files: {
          'js/main.js': [
            'js/plugins/*.js',
            'js/_*.js'
          ]
        }
      }
    },
    surround: {
      src: 'js/main.js',
      options: {
        overwrite: true,
        prepend: '---\n---',
      },
    },
    imagemin: {
      dist: {
        options: {
          optimizationLevel: 7,
          progressive: true
        },
        files: [{
          expand: true,
          cwd: 'images/',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: 'images/'
        }]
      }
    },
    // imgcompress removed; using imagemin instead for image compression
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'images/',
          src: '{,*/}*.svg',
          dest: 'images/'
        }]
      }
    },
  });

  // Load tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-svgmin');
  grunt.loadNpmTasks('grunt-surround');

  // Register tasks
  grunt.registerTask('scripts', ['watch', 'uglify']);
  grunt.registerTask('images', ['newer:imagemin', 'newer:svgmin']);

  // Custom 'surround' task to prepend content to a file (replaces grunt-surround)
  grunt.registerTask('surround', 'Prepend content defined in config.surround.options.prepend to the configured src file', function() {
    var cfg = grunt.config.get('surround') || {};
    var src = cfg.src;
    var options = (cfg.options) ? cfg.options : {};
    var prepend = options.prepend || '';
    if (!src) {
      grunt.log.warn('No surround.src configured.');
      return;
    }
    if (!grunt.file.exists(src)) {
      grunt.log.warn('Source file for surround does not exist: ' + src);
      return;
    }
    var content = grunt.file.read(src);
    if (content.indexOf(prepend) === 0) {
      grunt.log.writeln('File already has prepend content.');
      return;
    }
    var newContent = prepend + '\n' + content;
    grunt.file.write(src, newContent);
    grunt.log.writeln('Prepended surround content to ' + src);
  });
};
