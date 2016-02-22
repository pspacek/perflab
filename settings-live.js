'use strict';

let schema = 'perflab';

module.exports = {
	path:		'/home/perflab/data',
	mongo: {
		schema,
		url:	`mongodb://perf-ctl.lab.isc.org/${schema}`,
		oplog:	'mongodb://perf-ctl.lab.isc.org/local'
	},
	repo: {
		bind:	'ssh://isclab@repo.isc.org/proj/git/prod/bind9',
		nsd:    'http://www.nlnetlabs.nl/svn/nsd/tags/',
		knot:   'git://git.nic.cz/knot-dns.git'
	},
	hosts: {
		dns: {
			server: '172.16.2.242',
			tester:	'perf-dns-c.lab.isc.org'
		}
	},
	command: {
		dnsperf: '/bin/numactl',
		bind: '/bin/numactl',
		knot: './sbin/knotd',
		nsd: './sbin/nsd'
	},
	args: {
		bind: ['-C0-11', './sbin/named', '-n12'],
		dnsperf: ['-C12-23', '/usr/local/nom/bin/dnsperf', '-c24', '-q82', '-T6' ]
	}
};
