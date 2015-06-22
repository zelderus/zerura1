#!/bin/sh
### BEGIN INIT INFO
# Provides:          unicornserv
# Required-Start:    $local_fs $remote_fs $network $syslog $named
# Required-Stop:     $local_fs $remote_fs $network $syslog $named
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: srart unicorn serv
# Description:       start unicornserv
### END INIT INFO

# Author: Zelder
#
# Please remove the "Author" lines above and replace them
# with your own name if you copy and modify this script.

# Do NOT "set -e"

PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
#DAEMON=/usr/sbin/nginx
DESC=unico

RUNAS=zelder
UPATH=/home/zelder/rails/zerura/
NAME=unicornserv


start() {
  	echo 'Service strarting..'
  	#su $RUNAS
	echo "going.."
  	#cd $UPATH
  	(cd $UPATH && bundle exec unicorn_rails -c config/unicorn.rb -E production -D)
  	echo 'Service strarted'
}

stop() {
  	echo 'Service stopping..'
  	#su $RUNAS
  	#cd $UPATH
	#pid=-2
  	#(cd $UPATH && pid=`cat $UPATH/tmp/pids/unicorn.pid`)

	pid=`cat $UPATH/tmp/pids/unicorn.pid`
  	echo "killing $pid.."
	kill $pid
	echo "Service stopped"
}

uninstall() {
  echo -n "Are you really sure you want to uninstall this service? That cannot be undone. [yes|No] "
  local SURE
  read SURE
  if [ "$SURE" = "yes" ]; then
    stop
    #rm -f "$PIDFILE"
    update-rc.d -f $NAME remove
    #rm -fv "$0"
  fi
}

case "$1" in
  start)
    start
    ;;
  stop)
    stop
    ;;
  uninstall)
    uninstall
    ;;
  restart)
    stop
    start
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|uninstall}"

esac

