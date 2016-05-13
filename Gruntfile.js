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
                command : 'java -cp Bomberman-server-1.0.jar main.Main'
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
        }
    });
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-fest');
    grunt.loadNpmTasks('grunt-sass');
    
    


    grunt.registerTask('test', ['qunit:all']);
    grunt.registerTask('default', ['concurrent']);
    grunt.registerTask('compile', ['sass']);


};