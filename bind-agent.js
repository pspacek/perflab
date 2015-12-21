#!/usr/bin/env node

'use strict';

let Executor = require('./executor'),
	Promise = require('bluebird'),
	fs = Promise.promisifyAll(require('fs-extra'));

// somewhat complicated class that's capable of running the following
// sequence, with dependency checking and user-specified settings
//
// -  git clone 
// -  configure
// -  make
// -  make install
// -  named
//
// NB: this code, like much of the rest of this syste, uses
//     "Promises" to encapsulate asynchronous results
//
class BindAgent extends Executor {

	constructor(config, perfPath, repo) {
		super("BIND");

		config.args = config.args || {};
		config.options = config.options || "";
		config.global = config.global || "";

		let path = perfPath + '/tests/' + config._id;
		let buildPath = path + '/build';
		let runPath = path + '/run';
		let etcPath = runPath + '/etc';
		let zonePath = runPath + '/zones';

		let createEtc = () => fs.mkdirsAsync(etcPath);
		let createRun = () => fs.mkdirsAsync(runPath);
		let createBuild = () => fs.mkdirsAsync(buildPath);

		let createConfig = () => fs.copyAsync('config/named.conf', `${etcPath}/named.conf`);
		let createOptions = () => fs.writeFileAsync(`${etcPath}/named-options.conf`, config.options);
		let createGlobal = () => fs.writeFileAsync(`${etcPath}/named-global.conf`, config.global);
		let createZoneConf = () => fs.copyAsync(`config/zones-${config.zoneset}.conf`, `${etcPath}/named-zones.conf`);

		let linkZones = () => fs.symlinkAsync('../../../zones', zonePath);

		this._depPath(path);

		// empties the work directory, then creates the necessary
		// subdirectories and 'include' files for this configuration
		this._target('prepare', '', () =>
			fs.emptyDirAsync(path)
				.then(createEtc)
				.then(createRun)
				.then(createBuild)
				.then(createConfig)
				.then(createOptions)
				.then(createGlobal)
				.then(createZoneConf)
				.then(linkZones));

		// does 'git clone'
		this._target('checkout', 'prepare', () => this._run('/usr/bin/git', [
			'clone', '--depth', 1, '-b', config.branch, repo, '.'
		], {cwd: buildPath}));

		// does './configure [args...]'
		this._target('configure', 'checkout', () => {
			let args = ['--prefix', runPath].concat(config.args.configure || []);
			return this._run('./configure', args, {cwd: buildPath});
		});

		// does 'make [args...]'
		this._target('build', 'configure', () => {
			let args = config.args.make || [];
			return this._run('/usr/bin/make', args, {cwd: buildPath});
		});

		// does 'make install'
		this._target('install', 'build', () => this._run('/usr/bin/make', ['install'], {cwd: buildPath}));

		// does 'git log' to extract last commit message
		this.gitlog = () => {
			return this._run('/usr/bin/git', ['log', '-n', 1], {cwd: buildPath});
		}

		// starts BIND
		this.startBind = () => {
			let args = ['-g', '-p', 8053].concat(config.args.bind || []);
			return this._runWatch('./sbin/named', args, {cwd: runPath}, / running$/m);
		}

		// main executor function - optionally does a 'prepare' forcing
		// the entire build sequence to start afresh, then gets the latest
		// commit message and runs BIND, adding the commit message to the
		// BIND result output
		this.run = (opts) =>
			this.prepare({force: !!(opts && opts.checkout)}).then(this.install).then(() =>
				this.gitlog().then((gitlog) =>
					this.startBind().then((res) =>
						Object.assign(res, { commit: gitlog.stdout }))));
	}
}

module.exports = BindAgent;
