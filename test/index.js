var path = require('path');
var helpers = require('yeoman-test');
var fs = require('fs-extra');
var assert = require('yeoman-assert');

describe('donejs-documentjs', function() {
	describe('when there is no package.json', function() {
		before(function(done) {
			helpers.run(path.join(__dirname, '../default'))
				.inTmpDir()
				.withPrompts({
					name: 'my-app',
					folder: 'src'
				}).on('end', done);
		});

		it('should add documentjs script to package.json', function() {
			assert.file(['package.json']);
			assert.JSONFileContent('package.json', {
				scripts: {
					document: "documentjs"
				}
			});
		});

		it('should write documentjs.json file', function() {
			assert.file(['documentjs.json']);
			assert.JSONFileContent('documentjs.json', {
				"sites": {
					"docs": {
						"dest": "docs",
						"parent": "my-app",
						"pageConfig": {
							"page": "docs"
						},
						"glob": {
							"pattern": "src/**/*.{js,md}"
						}
					}
				}
			});
		});
	});

	describe('when there is a package.json with name and directories.lib', function() {
		before(function(done) {
			helpers.run(path.join(__dirname, '../default'))
				.inTmpDir(function(tmpDir) {
					var src = path.join(__dirname, 'files/package.json');
					var dest = path.join(tmpDir, 'package.json');
					fs.copySync(src, dest);
				})
				.on('end', done);
		});

		it('should add documentjs script to package.json', function() {
			assert.file(['package.json']);
			assert.JSONFileContent('package.json', {
				scripts: {
					document: "documentjs"
				}
			});
		});

		it('should write documentjs.json file', function() {
			assert.file(['documentjs.json']);
			assert.JSONFileContent('documentjs.json', {
				"sites": {
					"docs": {
						"dest": "docs",
						"parent": "package-json-app",
						"pageConfig": {
							"page": "docs"
						},
						"glob": {
							"pattern": "directories-lib/**/*.{js,md}"
						}
					}
				}
			});
		});
	});
});
