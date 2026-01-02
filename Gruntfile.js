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
    // Use grunt-image (wrapper around jpegoptim/pngquant/gifsicle) for better compression
    image: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'images/',
          src: ['**/*.{png,jpg,jpeg,gif}'],
          dest: 'images/'
        }]
      }
    },

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
  grunt.loadNpmTasks('grunt-image');
  grunt.loadNpmTasks('grunt-svgmin');
  grunt.loadNpmTasks('grunt-surround');

  // Register tasks
  grunt.registerTask('scripts', ['watch', 'uglify']);
  // use newer:image for incremental runs
  grunt.registerTask('images', ['newer:image', 'newer:svgmin']);

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
