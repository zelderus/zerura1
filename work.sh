#!/bin/sh

#
#	Управление проектом
#	файл необходимо положить в корень приложения Rails (рядом с Gemfile)
#
#	перед запуском сделать исполняемым: 
#		$ chmod +x work.sh
#	вызов команды
#		$ ./work.sh [params]
#	params:
#		migrate		- миграция базы в production
#		precompile	- прекомпиляция скриптов и стилей в production
#		restart		- перезапуск Unicorn
#

PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

cRED='\033[0;31m'
cGREEN='\033[0;32m'
cYELLOW='\033[1;33m'
cNC='\033[0m' # No Color



do_migrate() {
  	echo "${cGREEN}Migrating..${cNC}"
  	#su $RUNAS
  	#cd $UPATH
  	#RAILS_ENV=production rvm use 1.9.3 do bundle exec rake db:migrate
	RAILS_ENV=production bundle exec rake db:migrate
  	echo "${cYELLOW}Migrated${cNC}"
}

do_precompile() {
  	echo "${cGREEN}Precompiling..${cNC}"
  	#su $RUNAS
  	#cd $UPATH

	#RAILS_ENV=production bundle exec rake assets:precompile
	RAILS_ENV=production bundle exec rake assets:precompile
	echo "${cYELLOW}Precompiled${cNC}"
}



do_restart() {
  	service unicornserv restart
}





case "$1" in
  restart)
    do_restart
    ;;
  migrate)
    do_migrate
    ;;
  precompile)
    do_precompile
    ;;
  *)
    echo "Usage: $0 {migrate|precompile|restart}"

esac
