#!/usr/bin/env bash
source /home/ubuntu/perl5/perlbrew/etc/bashrc
PATH_PECHKIN="/home/ubuntu/pechkin"
{ echo -n '### start ### '; /bin/date '+%Y-%m-%d -- %T'; } >> ${PATH_PECHKIN}/log/out.log

	cd ${PATH_PECHKIN}
	/usr/local/bin/node ${PATH_PECHKIN}/mailer.js >> ${PATH_PECHKIN}/log/out.log 2>>${PATH_PECHKIN}/log/out_err.log

{ echo -n '### end ### '; /bin/date '+%Y-%m-%d -- %T'; } >> ${PATH_PECHKIN}/log/out.log
