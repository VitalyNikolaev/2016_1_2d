module.exports = function (grunt) {

    grunt.initConfig({
        sass: {
            dist: {
                options: {
                    update: true
                },
                files: [{
                    expand: true,
                    cwd: 'blocks',
                    src: ['main.scss'],
                    dest: 'public_html/css/build/',
                    ext: '.css'
                }]
            }
        },
        shell: {
            options: {
                stdout: true,
                stderr: true
            },
            server: {
                command: 'node server.js '
            },
            backend : {
                command : 'java -cp *.jar main.Main '
            },
        },
        fest: {
            templates: {
                files: [{
                    expand: true,
                    cwd: 'templates',
                    src: '*.xml',
                    dest: 'public_html/js/tmpl'
                }],
                options: {
                    template: function (data) {
                        return grunt.template.process(
                            'define(function () { return <%= contents %> ; });',
                            {data: data}
                        );
                    }
                }
            }
        },
        watch: {
            fest: {
                files: ['templates/*.xml'],
                tasks: ['fest'],
                options: {
                    interrupt: true,
                    atBegin: true
                }
            },
            sass: {
                style: "compressed",
                files: 'blocks/**/*.scss',
                tasks: ['sass']
            },
            server: {
                files: [
                    'public_html/js/**/*.js',
                    'public_html/css/**/*.css'
                ],
                options: {
                    livereload: true
                }
            }
        },
        concurrent: {
            target: ['watch','shell:backend'],
            options: {
                logConcurrentOutput: true
            }
        },
        qunit: {
            all: ['public_html/tests/*.html']
        },
        requirejs: {
            build: {
                options: {
                    almond: true,
                    baseUrl: "public_html/js",
                    mainConfigFile: "public_html/js/config.js",
                    name: "main",
                    optimize: "none",
                    out: "public_html/js/build/build-requirejs.js"
                }
            }
        },
        concat: {
            build: {
                separator: ';\n',
                src: [
                    'public_html/js/lib/almond.js',
                    'public_html/js/build/build-requirejs.js'
                ],
                dest: 'public_html/js/build/build-concat.js'
            }
        },
        uglify: {
            build: {
                files: {
                    'public_html/js/build/build.min.js': ['public_html/js/build/build-concat.js']
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-fest');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    


    grunt.registerTask('test', ['qunit:all']);
    grunt.registerTask('default', ['concurrent']);
    grunt.registerTask('compile', ['sass']);
    grunt.registerTask('build', ['fest', 'requirejs:build', 'concat:build', 'uglify:build']
    );


};