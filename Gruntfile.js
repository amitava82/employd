"use strict";

module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-jade");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.initConfig({
    clean: {
      client: {
        files: [{
          dot: true,
          src: ["/temp/*"]
        }]
      }
    },
    less: {
      compile: {
        options: {
          paths: ["client/styles/less/src", "client/styles/less/lib"]
        },
        files: {
          "temp/funnel.css": ["client/styles/less/src/funnel.less"]
        }
      }
    },
    cssmin: {
      compress: {
        files: {
          "client/styles/css/funnel.css": ["temp/funnel.css"]
        }
      }
    },
    jade: {
      compile: {
        options: {
          pretty: true
        },
        files: [
          {
            expand: true,     // Enable dynamic expansion.
            cwd: 'client/scripts/src/',      // Src matches are relative to this path.
            src: ['**/*.jade'], // Actual pattern(s) to match.
            dest: 'client/scripts/src/',   // Destination path prefix.
            ext: '.tmpl.html',   // Dest filepaths will have this extension.
            extDot: 'first'   // Extensions in filenames begin after the first dot
          }
        ]
      }
    },
    express: {
      options: {
        port: process.env.PORT || 3000
      },
      development: {
        options: {
          script: "app.js"
        }
      },
      production: {
        options: {
          script: "app.js",
          node_env: "production"
        }
      }
    },
    watch: {
      less: {
        files: ["client/styles/less/src/{,*/}*.less"],
        tasks: ["less", "cssmin"]
      },
      jade: {
        files: ["client/scripts/src/**/*.jade"],
        tasks: ["jade:compile"]
      }
    }
  });


  grunt.registerTask("serve", function(target) {
    if (target === "dist") {
      return grunt.task.run(["build", "express:prod", "open", "express-keepalive"]);
    }

    grunt.task.run([
      "clean:client",
      "less",
      "cssmin",
      "watch"
    ]);
  });

  grunt.registerTask("default", ["serve"]);
};
