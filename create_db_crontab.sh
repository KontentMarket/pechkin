#!/bin/sh
######## SET
LANG=C
LC_ALL=C

if [ $# = 0 ]; then
	echo Error - надо указать root пароль от mysql
	echo create_db_crontab.sh rootpassword
	exit 1
fi

mysql -A -h'127.0.0.1' -u'root' -p$1 -e"CREATE DATABASE pechkin"
mysql -A -h'127.0.0.1' -u'root' -p$1 -e"GRANT ALL PRIVILEGES ON pechkin.* TO pechkin@'127.0.0.1' IDENTIFIED BY 'pechkin'"
mysql -A -h'127.0.0.1' -u'root' -p$1 pechkin < pechkin.sql
mysqladmin -u'root' -p$1 flush-privileges
crontab -l > crontab.txt
echo '*/5	*	*	*	*	/home/ubuntu/pechkin/pechkin.sh' >> crontab.txt
echo '#EOF' >> crontab.txt
crontab crontab.txt
rm crontab.txt
