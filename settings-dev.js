'use strict';

let schema = 'perflab';

module.exports = {
	path:		'/home/ray/data',
	mongo: {
		schema,
		url:	`mongodb://localhost/${schema}`,
		oplog:	'mongodb://localhost/local'
	},
	repo: {
		bind: 	'https://source.isc.org/git/bind9.git',
		nsd:	'http://www.nlnetlabs.nl/svn/nsd/tags/',
		knot:	'git://git.nic.cz/knot-dns.git'
	},
	hosts: {
		dns: {
			server: 'localhost',
			tester:	'localhost'
		}
	},
	command: {},
	args: {}
};
