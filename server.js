#!/usr/bin/env node

'use strict';

var BindAgent = require('./bind-agent.js'),
	Database = require('./database.js');

var mongoUrl = 'mongodb://localhost/perflab';
var perfPath = '/home/ray/bind-perflab';
var repoUrl = 'ssh://repo.isc.org/proj/git/prod/bind9';

function install(config) {
	var agent = new BindAgent(config, perfPath, repoUrl);
	agent.on('stdout', console.log);
	agent.on('stderr', console.error);
	return agent.run();
}

try {
	var db = new Database(mongoUrl);
	db.getConfig("v9_10").then(install).catch(console.error);
} catch (e) {
	console.error('catch: ' + e);
}
