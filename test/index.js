var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');

describe('donejs-documentjs', function() {
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
