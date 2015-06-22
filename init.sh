#! /bin/sh

##
# install 'unicornserv' daemon and other
# Author: Zelder
#

PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

UNISERV=unicornserv
POSTGRESERV=postgresql	# zepostgre

cRED='\033[0;31m'
cGREEN='\033[0;32m'
cYELLOW='\033[1;33m'
cNC='\033[0m' # No Color



do_unicorn() {
  	echo "${cRED}Installing unicorn as daemon..${cNC}"
  	cp "unicornserv.sh" "/etc/init.d/$UNISERV"
	chmod 755 /etc/init.d/$UNISERV
	chown root:root /etc/init.d/$UNISERV
	update-rc.d $UNISERV defaults
	#update-rc.d $UNISERV enable
  	echo "${cRED}Daemon ${cYELLOW}'$UNISERV'${cRED} is installed${cNC}"
}


do_postgre() {
  	#echo "${cRED}Installing PostgreSQL as daemon..${cNC}"
  	#cp "postgre.sh" "/etc/init.d/$POSTGRESERV"
	#chmod +x /etc/init.d/$POSTGRESERV
	##chown root:root /etc/init.d/$POSTGRESERV
	#update-rc.d $POSTGRESERV defaults
	##update-rc.d $POSTGRESERV enable
  	#echo "${cRED}Daemon ${cYELLOW}'$POSTGRESERV'${cRED} is installed${cNC}"
	
	echo "postgre.."
}


do_start_unicorn() {
	service $UNISERV start
}
do_start_postgre() {
	service $POSTGRESERV start
}

do_stop_unicorn() {
	service $UNISERV stop
}
do_stop_postgre() {
	service $POSTGRESERV stop
}





do_installall() {
  	do_unicorn
	do_postgre
}
do_start() {
  	do_start_postgre
	do_start_unicorn
}
do_stop() {
	do_stop_unicorn
	do_stop_postgre
}




case "$1" in
  iall)
    do_installall
    ;;
  installall)
    do_installall
    ;;
  start)
    do_start
    ;;
  stop)
	do_stop
	;;
  *)
    echo "Usage: $0 {iall|installall|start|stop}"

esac

