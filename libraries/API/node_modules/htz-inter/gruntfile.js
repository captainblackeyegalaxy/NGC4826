module.exports = function (grunt) {
		grunt.initConfig({
			pkg: grunt.file.readJSON('package.json'),
			fixturesPath: "",
			uglify: {
				options: {
					banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
					'Created by: ' + '<%= pkg.author %> ' +
					'<%= grunt.template.today("yyyy-mm-dd") %> */',
					compress: {
						drop_console: true
					}
				},
				interactive: {
					files: {
						'build/js/<%= pkg.name %>-main.min.js': ['js/main.js']
					}
				}
			},
			cssmin: {
				interactive: {
					files: {
						'build/stylesheets/<%= pkg.name %>-styles.min.css': ['stylesheets/styles_heb.css','stylesheets/project_styles.css']
					}
				}
			},
			processhtml: {
				options: {
					strip: true,
					data: {
						name:'<%=pkg.name%>',
						version:'<%=pkg.fileVersions%>',
						prodUrl: '<%=pkg.prodUrl%>',
						resoUrl: '<%=pkg.resoUrl%>',
						d0: '<script src="' + '<%=pkg.domainProd%>' + '/st/c/static/resources/js/',
						d1: '.js"></script>',
						fpu: '<%=pkg.prodUrl %>',
						title:'<%=pkg.title %>',
						author:'<%=pkg.author %>',
						description:'<%=pkg.description %>',
						canonical: '<%=pkg.canonical %>',
						ogtitle: '<%=pkg.ogtitle %>',
						ogtype: '<%=pkg.ogtype %>',
						ogurl: '<%= pkg.ogurl %>',
						ogimg: '<%= pkg.ogimg %>',
						ogdesc: '<%= pkg.ogdesc %>'
					}
				},
				interactive: {
						files: {
							'build/index.html': ['index.html']
						}
					}

			}
		});

	/* TASKS */

	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-processhtml");


	/* REGISTER */

	grunt.registerTask('interactive', ['uglify:interactive','cssmin:interactive','processhtml:interactive']);

};