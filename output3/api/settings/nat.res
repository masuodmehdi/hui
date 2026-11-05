#!/bin/sh
################################################################################

# cat /etc/jffs.img > /dev/mtdblock1
cat /etc/jffs.img > /dev/mtdblock2
# cat /etc/jffs.img > /dev/mtdblock3
# cat /etc/jffs.img > /dev/mtdblock4

# mount -t jffs2 /dev/mtdblock2 /var/module
mount -t jffs2 -o ro /dev/mtdblock8 /www
mount -t jffs2 /dev/mtdblock2 /config
mount -t jffs2 /dev/mtdblock12 /fota
mount -t jffs2 /dev/mtdblock13 /coredump
test ! -e /www/defaultcfg.xml && umount /www

# mount -t jffs2 /dev/mtdblock4 /var/middleware

echo "Loading SDK modules"

insmod  /lib/extra/hi_mdio.ko
insmod  /lib/extra/hi_sysctl.ko
insmod  /lib/extra/hi_gpio.ko
insmod  /lib/extra/hi_gpio_int.ko
insmod  /lib/extra/hi_i2c.ko
insmod  /lib/extra/hi_timer.ko
insmod  /lib/extra/hi_spi.ko
insmod  /lib/extra/hi_dma.ko
insmod  /lib/extra/hi_ioctl_sysctl.ko
insmod  /lib/extra/hi_ioctl_interface.ko
insmod  /lib/extra/hi_dp.ko
insmod  /lib/extra/hi_ioctl_dp.ko

echo "Loading HSAN modules"

insmod  /lib/extra/hi_kbasic.ko
insmod  /lib/extra/hi_kmisc.ko
insmod  /lib/extra/hi_keth.ko
insmod  /lib/extra/hi_kveth.ko
insmod  /lib/extra/hi_kphy.ko
insmod  /lib/extra/hi_kgpio.ko
insmod  /lib/extra/hi_kaccel.ko


echo "Loading WLAN modules"

insmod  /lib/extra/wl.ko nvram_path=/etc/43217.nvm

hi_system &

hi_wancmd &
