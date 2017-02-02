var Generator = require('yeoman-generator');
var path = require('path');
var _ = require('lodash');

module.exports = Generator.extend({
  constructor: function(args, opts) {
    Generator.call(this, args, opts);

    this.pkgPath = this.destinationPath('package.json');
    this.pkg = this.fs.readJSON(this.pkgPath, {});

		this.props = {
			name: this.pkg.name,
			folder: _.get(this.pkg, 'steal.directories.lib')
		};

    this.files = [
      'documentjs.json'
    ];
  },

  installingDocumentJS: function() {
    this.npmInstall(['documentjs'], { 'saveDev': true });
  },

  prompting: function () {
    var done = this.async();

		var prompts = [{
			name: 'name',
			message: 'Project name',
			when: !this.props.name,
			default: process.cwd().split(path.sep).pop()
		}, {
			name: 'folder',
			message: 'Project main folder',
			when: !this.props.folder,
			default: 'src'
		}];

		this.prompt(prompts)
			.then(function(answers) {
				_.assign(this.props, answers);
				done();
			}.bind(this));
  },

  writing: function () {
    this.log('Modifying package.json');

    // force writing to package.json so the user isn’t prompted
    this.conflicter.force = true;

    var newPkgConfig = {
      scripts: {
        document: "documentjs"
      }
    };

    this.fs.extendJSON(this.pkgPath, newPkgConfig);
    this.log('Finished modifying package.json');

    this.files.forEach(function(name) {
      this.fs.copyTpl(
        this.templatePath(name),
        this.destinationPath(name),
        this.props
      );
    }.bind(this));
  }
});
