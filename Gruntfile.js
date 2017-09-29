module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      main: {
      }
    },
    concat: {
      css: {
        src: ['src/*.css'],
        dest: 'client/css/webrdp.css'
      },
      js: {
        src: ['src/*.js'],
        dest: 'client/js/webrdp.js'
      }
    },
    uglify: {
      build: {
        src: ['src/canvas.js', 'src/client.js', 'src/keyboard.js', 'src/mstsc.js', 'src/rle.js'],
        dest: 'client/js/webrdp.min.js'
      }
    }
  })

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-uglify')

  // Default task(s).
  grunt.registerTask('default', ['copy', 'concat', 'uglify'])
}
