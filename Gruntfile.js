/* global module:false */
module.exports = function(grunt) {
	var port = grunt.option('port') || 8000;
	var root = grunt.option('root') || '.';

	if (!Array.isArray(root)) root = [root];

	// Project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		conf: grunt.file.readYAML(root[1]+'/config.yml'),
		meta: {
			banner:
				'/*!\n' +
				' * reveal.js <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd, HH:MM") %>)\n' +
				' * http://revealjs.com\n' +
				' * MIT licensed\n' +
				' *\n' +
				' * Copyright (C) 2018 Hakim El Hattab, http://hakim.se\n' +
				' */'
		},

		qunit: {
			files: [ 'test/*.html' ]
		},

		uglify: {
			options: {
				banner: '<%= meta.banner %>\n',
				ie8: true
			},
			build: {
				src: 'js/reveal.js',
				dest: 'js/reveal.min.js'
			}
		},

		sass: {
			core: {
				src: 'css/reveal.scss',
				dest: 'css/reveal.css'
			},
			themes: {
				expand: true,
				cwd: 'css/theme/source',
				src: ['*.sass', '*.scss'],
				dest: 'css/theme',
				ext: '.css'
			}
		},

		autoprefixer: {
			core: {
				src: 'css/reveal.css'
			}
		},

		cssmin: {
			options: {
				compatibility: 'ie9'
			},
			compressReveal: {
				src: 'css/reveal.css',
				dest: 'css/reveal.min.css'
			},
			compressTheme: {
				src: 'css/theme/<%= conf.theme || "serif" %>.css',
				dest: 'css/theme/<%= conf.theme || "serif" %>.min.css'
			}
		},

		jshint: {
			options: {
				curly: false,
				eqeqeq: true,
				immed: true,
				esnext: true,
				latedef: 'nofunc',
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				eqnull: true,
				browser: true,
				expr: true,
				loopfunc: true,
				globals: {
					head: false,
					module: false,
					console: false,
					unescape: false,
					define: false,
					exports: false
				}
			},
			files: [ 'Gruntfile.js', 'js/reveal.js' ]
		},

		connect: {
			server: {
				options: {
					port: port,
					base: root,
					livereload: true,
					open: true,
					useAvailablePort: true
				}
			}
		},

		zip: {
			bundle: {
				router: function (filepath) {
					return filepath.replace( root[1]+'/', '');
			    },
				src: [
					'css/reveal.min.css',
					'css/print/paper.css',
					'css/theme/<%= conf.theme %>.min.css',
					'js/reveal.min.js',
					"lib/<%= conf.libs %>",
					"lib/{<%= conf.libs %>}",
					"plugin/<%= conf.plugins %>/**",
					"plugin/{<%= conf.plugins %>}/**",
					root[1]+'/img/**.{jpg,jpeg,png,gif,svg}',
					'index.html',
				],
				dest: root[1]+'/reveal-js-presentation.zip'
			}
		},

		watch: {
			js: {
				files: [ 'Gruntfile.js', 'js/reveal.js' ],
				tasks: 'js'
			},
			theme: {
				files: [
					'css/theme/source/*.sass',
					'css/theme/source/*.scss',
					'css/theme/template/*.sass',
					'css/theme/template/*.scss'
				],
				tasks: 'css-themes'
			},
			css: {
				files: [ 'css/reveal.scss' ],
				tasks: 'css-core'
			},
			html: {
				files: root.map(path => path + '/*.html')
			},
			markdown: {
				files: root.map(path => path + '/index.md')
			},
			options: {
				livereload: true
			},
			pandoc: {
				files: [ root[1]+'/index.md', root[1]+'/config.yml', root[0]+"tpl/*.html" ],
				tasks: 'pandoc'
			}
		},

		retire: {
			js: [ 'js/reveal.js', 'lib/js/*.js', 'plugin/**/*.js' ],
			node: [ '.' ]
		},

		node_pandoc: {
			options: {
				flags: "-t revealjs --no-highlight --mathjax --template=tpl/tpl-<%= conf.template %>.html <%= Object.entries(conf).map( tab => '-V '+tab[0]+'='+tab[1] ).join(' ') %>"
			},
			files: {
				src:  root[1] + '/index.md',
				dest: 'index.html'
			}
		},

	});

	// Dependencies
	grunt.loadNpmTasks( 'grunt-contrib-connect' );
	grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-qunit' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-autoprefixer' );
	grunt.loadNpmTasks( 'grunt-retire' );
	grunt.loadNpmTasks( 'grunt-sass' );
	grunt.loadNpmTasks( 'grunt-zip' );
	grunt.loadNpmTasks( 'grunt-node-pandoc' );

	// Default task
	grunt.registerTask( 'default', [ 'css', 'js', 'pandoc' ] );

	// JS task
	grunt.registerTask( 'js', [ 'jshint', 'uglify', ] ); // 'qunit'

	// Theme CSS
	grunt.registerTask( 'css-themes', [ 'sass:themes', 'cssmin:compressTheme' ] );

	// Core framework CSS
	grunt.registerTask( 'css-core', [ 'sass:core', 'autoprefixer', 'cssmin' ] );

	// All CSS
	grunt.registerTask( 'css', [ 'sass', 'autoprefixer', 'cssmin' ] );

	// Package presentation to archive
	grunt.registerTask( 'package', [ 'default', 'zip' ] );

	// Serve presentation locally
	grunt.registerTask( 'serve', [ 'default', 'connect', 'watch' ] );

	// Run tests
	grunt.registerTask( 'test', [ 'jshint', 'qunit' ] );

	// Run Pandoc
	grunt.registerTask( 'pandoc', [ 'node_pandoc' ] );

};
