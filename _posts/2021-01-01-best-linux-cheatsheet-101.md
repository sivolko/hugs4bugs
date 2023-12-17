---
title: Linux Cheat Sheet 101
date: 2021-01-01 22:55:45 Z
category: linux
tags:
- linux
- system Admin
layout: post
subtitle: Linux,where a true freedom is !
description: Best Linux cheat sheet for begineer to advance level.
image: https://www.iihglobal.com/wp-content/uploads/2019/02/dcsad.gif
optimized_image: https://www.iihglobal.com/wp-content/uploads/2019/02/dcsad.gif
author: Shubhendu Shubham
---

Linux is a kernel, on which lots of Operating systems like andriod, Debian, Arch are runnig.

The Linux "core" (called a kernel) was born in 1991 in Finland, and it has come a really long way from its humble beginnings. It went on to be the kernel of the GNU Operating System, creating the duo GNU/Linux.

> What makes Linux special is,Distro !

Eg of linux distro are:-Ubuntu, Debian, kali, Parrot,openSUSE,Fedora

**System**

<style type="text/css">
.tg  {border:none;border-collapse:collapse;border-color:#9ABAD9;border-spacing:0;}
.tg td{background-color:#EBF5FF;border-color:#9ABAD9;border-style:solid;border-width:0px;color:#444;
  font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{background-color:#409cff;border-color:#9ABAD9;border-style:solid;border-width:0px;color:#fff;
  font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-ng5i{background-color:#000000;border-color:inherit;font-size:24px;text-align:left;vertical-align:top}
.tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
</style>
<div class="table-responsive text-nowrap">
<table class="tg">
<colgroup>
<col style="width: 166.001067px">
<col style="width: 468.001067px">
</colgroup>
<thead>
  <tr>
    <th class="tg-ng5i"><span style="font-weight:bold;color:#FFF">Commands</span></th>
    <th class="tg-ng5i"><span style="font-weight:bold">     Descriptions</span></th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0pky">uname</td>
    <td class="tg-0pky">Display the Linux information</td>
  </tr>
  <tr>
    <td class="tg-0pky">uname-r</td>
    <td class="tg-0pky">Display the kernel information</td>
  </tr>
  <tr>
    <td class="tg-0pky">utime</td>
    <td class="tg-0pky">Display how long the system has been running including the load average</td>
  </tr>
  <tr>
    <td class="tg-0pky">hostname</td>
    <td class="tg-0pky">shows the system hostname</td>
  </tr>
  <tr>
    <td class="tg-0pky">hostname-i</td>
    <td class="tg-0pky">display the IP address of the system </td>
  </tr>
  <tr>
    <td class="tg-0pky">last reboot</td>
    <td class="tg-0pky">shows the system reboot history</td>
  </tr>
  <tr>
    <td class="tg-0pky">date</td>
    <td class="tg-0pky">Display the current system date &amp; time </td>
  </tr>
  <tr>
    <td class="tg-0pky">timedatectl</td>
    <td class="tg-0pky">Query and change the system clock </td>
  </tr>
  <tr>
    <td class="tg-0pky">cal</td>
    <td class="tg-0pky">Display the current calendar month and day</td>
  </tr>
  <tr>
    <td class="tg-0pky">w</td>
    <td class="tg-0pky">Display currently logged in users in the system </td>
  </tr>
  <tr>
    <td class="tg-0pky">whoami</td>
    <td class="tg-0pky">Display who you are logged in </td>
  </tr>
  <tr>
    <td class="tg-0pky">finger username</td>
    <td class="tg-0pky">Display the information about the user</td>
  </tr>
</tbody>
</table>
</div>

<strong>Hardware </strong>

<style type="text/css">
.tg  {border:none;border-collapse:collapse;border-color:#9ABAD9;border-spacing:0;}
.tg td{background-color:#EBF5FF;border-color:#9ABAD9;border-style:solid;border-width:0px;color:#444;
  font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{background-color:#409cff;border-color:#9ABAD9;border-style:solid;border-width:0px;color:#fff;
  font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-ng5i{background-color:#000000;border-color:inherit;font-size:24px;text-align:left;vertical-align:top}
.tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
</style>
<div class="table-responsive text-nowrap">
<table class="tg">
<colgroup>
<col style="width: 166.001067px">
<col style="width: 468.001067px">
</colgroup>
<thead>
  <tr>
    <th class="tg-ng5i"><span style="font-weight:bold;color:#FFF">Commands</span></th>
    <th class="tg-ng5i"><span style="font-weight:bold">     Descriptions</span></th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0pky">dmseg</td>
    <td class="tg-0pky">Display bootup messages</td>
  </tr>
  <tr>
    <td class="tg-0pky">cat/proc/cpuinfo</td>
    <td class="tg-0pky">Displays more information about CPU eg. model, model name,cores,vendor id</td>
  </tr>
  <tr>
    <td class="tg-0pky">cat/proc/meminfo</td>
    <td class="tg-0pky">Display the more information about hardware memory e.g total and free memory</td>
  </tr>
  <tr>
    <td class="tg-0pky">lshw</td>
    <td class="tg-0pky">Display information about system's hardware configuration</td>
  </tr>
  <tr>
    <td class="tg-0pky">lsblk</td>
    <td class="tg-0pky">Display the block device related information</td>
  </tr>
  <tr>
    <td class="tg-0pky">free -m </td>
    <td class="tg-0pky">Display free and used memory in the system (-m flag indicates memory in MB )</td>
  </tr>
  <tr>
    <td class="tg-0pky">lspci -tv</td>
    <td class="tg-0pky">Display PCI devices in a tree-like diagram</td>
  </tr>
  <tr>
    <td class="tg-0pky">lsusb -tv </td>
    <td class="tg-0pky">Display USB devices in a tree-like diagram</td>
  </tr>
  <tr>
    <td class="tg-0pky">dmidecode</td>
    <td class="tg-0pky">Display hardware information from the BIOS</td>
  </tr>
  <tr>
    <td class="tg-0pky">hdparm -i /dev/xda</td>
    <td class="tg-0pky">Display information about the disk data</td>
  </tr>
  <tr>
    <td class="tg-0pky">hdparm -tT/dev/xda</td>
    <td class="tg-0pky">Conducts a read speed test on device xda</td>
  </tr>
  <tr>
    <td class="tg-0pky">badblocks -s/dev/xda</td>
    <td class="tg-0pky">Test for unreadable blocks on disk</td>
  </tr>
</tbody>
</table>
</div>

<strong>User</strong>

<style type="text/css">
.tg  {border:none;border-collapse:collapse;border-color:#9ABAD9;border-spacing:0;}
.tg td{background-color:#EBF5FF;border-color:#9ABAD9;border-style:solid;border-width:0px;color:#444;
  font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{background-color:#409cff;border-color:#9ABAD9;border-style:solid;border-width:0px;color:#fff;
  font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-ng5i{background-color:#000000;border-color:inherit;font-size:24px;text-align:left;vertical-align:top}
.tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
</style>
<div class="table-responsive text-nowrap">

<table class="tg">
<colgroup>
<col style="width: 226px">
<col style="width: 387px">
</colgroup>
<thead>
  <tr>
    <th class="tg-ng5i"><span style="font-weight:bold;color:#FFF">Commands</span></th>
    <th class="tg-ng5i"><span style="font-weight:bold">     Descriptions</span></th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0pky">id</td>
    <td class="tg-0pky">Displays the details of the active user e.g uid,gid, and groups </td>
  </tr>
  <tr>
    <td class="tg-0pky">Last</td>
    <td class="tg-0pky">Shows the last logins in the System</td>
  </tr>
  <tr>
    <td class="tg-0pky">who</td>
    <td class="tg-0pky">Shows who is logged into the System</td>
  </tr>
  <tr>
    <td class="tg-0pky">groupadd "admin"</td>
    <td class="tg-0pky">Adds the group "admin"</td>
  </tr>
  <tr>
    <td class="tg-0pky">adduser"Shubham"</td>
    <td class="tg-0pky">Adds user Shubham</td>
  </tr>
  <tr>
    <td class="tg-0pky">userdel"Sam"</td>
    <td class="tg-0pky">Deletes user Sam</td>
  </tr>
  <tr>
    <td class="tg-0pky">usermod</td>
    <td class="tg-0pky">used for changing/modifying user information </td>
  </tr>
</tbody>
</table>
</div>

<strong> File commands </strong>

<style type="text/css">
.tg  {border:none;border-collapse:collapse;border-color:#9ABAD9;border-spacing:0;}
.tg td{background-color:#EBF5FF;border-color:#9ABAD9;border-style:solid;border-width:0px;color:#444;
  font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{background-color:#409cff;border-color:#9ABAD9;border-style:solid;border-width:0px;color:#fff;
  font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-ng5i{background-color:#000000;border-color:inherit;font-size:24px;text-align:left;vertical-align:top}
.tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
</style>
<div class="table-responsive text-nowrap">
<table class="tg">
<colgroup>
<col style="width: 201px">
<col style="width: 459px">
</colgroup>
<thead>
  <tr>
    <th class="tg-ng5i"><span style="font-weight:bold;color:#FFF">Commands</span></th>
    <th class="tg-ng5i"><span style="font-weight:bold">     Descriptions</span></th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0pky">ls -al </td>
    <td class="tg-0pky">List files both regular and hidden along with their permission </td>
  </tr>
  <tr>
    <td class="tg-0pky">pwd</td>
    <td class="tg-0pky">Display the path of the current directory</td>
  </tr>
  <tr>
    <td class="tg-0pky">mkdir &lt;directory_name&gt;</td>
    <td class="tg-0pky">Creates a directory</td>
  </tr>
  <tr>
    <td class="tg-0pky">rm &lt;file_name&gt;</td>
    <td class="tg-0pky">Delete file</td>
  </tr>
  <tr>
    <td class="tg-0pky">rm -r &lt;directory_name&gt;</td>
    <td class="tg-0pky">Delete directory recursively </td>
  </tr>
  <tr>
    <td class="tg-0pky">rm -f &lt;file_name&gt;</td>
    <td class="tg-0pky">Forcefully remove file</td>
  </tr>
  <tr>
    <td class="tg-0pky">rm -rf &lt;directory_name&gt;</td>
    <td class="tg-0pky">Forcefully remove the directory</td>
  </tr>
  <tr>
    <td class="tg-0pky">cp file1 file2</td>
    <td class="tg-0pky">copy file1 to file2</td>
  </tr>
  <tr>
    <td class="tg-0pky">cp -r dir1 dir2</td>
    <td class="tg-0pky">copy dir1 to dir2 ,creates dir2 if it doesn't exits</td>
  </tr>
  <tr>
    <td class="tg-0pky">mv file1 file2</td>
    <td class="tg-0pky">Rename source to Destination/move source to directory</td>
  </tr>
  <tr>
    <td class="tg-0pky">ln -s /path/to/file-name link name</td>
    <td class="tg-0pky">Creates symbolic link to the file-name</td>
  </tr>
  <tr>
    <td class="tg-0pky">touch file</td>
    <td class="tg-0pky">Creates/ Update file</td>
  </tr>
  <tr>
    <td class="tg-0pky">cat &gt; file</td>
    <td class="tg-0pky">Place standard input into filel</td>
  </tr>
  <tr>
    <td class="tg-0pky">more file</td>
    <td class="tg-0pky">Output contents of file</td>
  </tr>
  <tr>
    <td class="tg-0pky">head file</td>
    <td class="tg-0pky">Output first 10 lines of file</td>
  </tr>
  <tr>
    <td class="tg-0pky">tail file</td>
    <td class="tg-0pky">Output last 10 lines of file</td>
  </tr>
  <tr>
    <td class="tg-0pky">tail -f file</td>
    <td class="tg-0pky">Output contents of file as it grows starting with the last 10 lines</td>
  </tr>
  <tr>
    <td class="tg-0pky">gpg -c file</td>
    <td class="tg-0pky">Encrypt file</td>
  </tr>
  <tr>
    <td class="tg-0pky">gpg file.gpg</td>
    <td class="tg-0pky">Decrypt file</td>
  </tr>
  <tr>
    <td class="tg-0pky">wc</td>
    <td class="tg-0pky">print the number of bytes,words,and lines in files</td>
  </tr>
  <tr>
    <td class="tg-0pky">xargs</td>
    <td class="tg-0pky">Execute command lines from standard input</td>
  </tr>
</tbody>
</table>
</div>

<strong>File Permission Related </strong>

<style type="text/css">
.tg  {border:none;border-collapse:collapse;border-color:#9ABAD9;border-spacing:0;}
.tg td{background-color:#EBF5FF;border-color:#9ABAD9;border-style:solid;border-width:0px;color:#444;
  font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{background-color:#409cff;border-color:#9ABAD9;border-style:solid;border-width:0px;color:#fff;
  font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-ng5i{background-color:#000000;border-color:inherit;font-size:24px;text-align:left;vertical-align:top}
.tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
</style>
<div class="table-responsive text-nowrap">
<table class="tg">
<colgroup>
<col style="width: 201px">
<col style="width: 459px">
</colgroup>
<thead>
  <tr>
    <th class="tg-ng5i"><span style="font-weight:bold;color:#FFF">Commands</span></th>
    <th class="tg-ng5i"><span style="font-weight:bold">     Descriptions</span></th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0pky">chmod octal &lt; file_name&gt; </td>
    <td class="tg-0pky">Change the permission of the file to local</td>
  </tr>
  <tr>
    <td class="tg-0pky">Eg: -</td>
    <td class="tg-0pky"></td>
  </tr>
  <tr>
    <td class="tg-0pky">chmod 777 /data/test.c</td>
    <td class="tg-0pky">Set rwx permission for owner,group,world</td>
  </tr>
  <tr>
    <td class="tg-0pky">chmod 755/data/test.c</td>
    <td class="tg-0pky">Set rws permission for the owner, rx for group and world</td>
  </tr>
  <tr>
    <td class="tg-0pky">chmod 766/data/test.c</td>
    <td class="tg-0pky">Sets rwx for the owner,rw for the group and everyone </td>
  </tr>
  <tr>
    <td class="tg-0pky"></td>
    <td class="tg-0pky"></td>
  </tr>
  <tr>
    <td class="tg-0pky">chown owner user-file</td>
    <td class="tg-0pky">Changes the ownership of the file</td>
  </tr>
  <tr>
    <td class="tg-0pky">chown owner-user:owner-group <br> &lt; file_name&gt;</td>
    <td class="tg-0pky">change owner and group owner of the file</td>
  </tr>
  <tr>
    <td class="tg-0pky">chown owner-user:owner-group <br> -directory</td>
    <td class="tg-0pky">change owner and group owner of the directory</td>
  </tr>
  
</tbody>
</table>
</div>

<strong> Process Related </strong>

<style type="text/css">
.tg  {border:none;border-collapse:collapse;border-color:#9ABAD9;border-spacing:0;}
.tg td{background-color:#EBF5FF;border-color:#9ABAD9;border-style:solid;border-width:0px;color:#444;
  font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{background-color:#409cff;border-color:#9ABAD9;border-style:solid;border-width:0px;color:#fff;
  font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-ng5i{background-color:#000000;border-color:inherit;font-size:24px;text-align:left;vertical-align:top}
.tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
</style>
<div class="table-responsive text-nowrap">
<table class="tg">
<colgroup>
<col style="width: 201px">
<col style="width: 459px">
</colgroup>
<thead>
  <tr>
    <th class="tg-ng5i"><span style="font-weight:bold;color:#FFF">Commands</span></th>
    <th class="tg-ng5i"><span style="font-weight:bold">     Descriptions</span></th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0pky">ps </td>
    <td class="tg-0pky">Display the current active processes</td>
  </tr>
  <tr>
    <td class="tg-0pky">ps aux | grep 'telnet'</td>
    <td class="tg-0pky">Searches for the id of the process 'telnet'</td>
  </tr>
  <tr>
    <td class="tg-0pky">pmap</td>
    <td class="tg-0pky">Display memory map of the process</td>
  </tr>
  <tr>
    <td class="tg-0pky">top</td>
    <td class="tg-0pky">Displays all running processes</td>
  </tr>
  <tr>
    <td class="tg-0pky">kill pid</td>
    <td class="tg-0pky">Terminates process with a given pid </td>
  </tr>
  <tr>
    <td class="tg-0pky">killall proc</td>
    <td class="tg-0pky">kills/Terminates all processes named proc</td>
  </tr>
  <tr>
    <td class="tg-0pky">pkill process-name</td>
    <td class="tg-0pky">Sends a signal to a process with its a name</td>
  </tr>
  <tr>
    <td class="tg-0pky">bg</td>
    <td class="tg-0pky">Resume suspended jobs in the background</td>
  </tr>
  <tr>
    <td class="tg-0pky">fg</td>
    <td class="tg-0pky">Brings suspended jobs to the foreground</td>
  </tr>

  <tr>
    <td class="tg-0pky">fg n </td>
    <td class="tg-0pky">Brings job n to the foreground</td>
  </tr>
  <tr>
    <td class="tg-0pky">lsof</td>
    <td class="tg-0pky">Lists files that are open by processes</td>
  </tr>
<tr>
    <td class="tg-0pky">renic 19 PID</td>
    <td class="tg-0pky">Makes a process run with very low priority</td>
  </tr>
<tr>
    <td class="tg-0pky">pregp firefox</td>
    <td class="tg-0pky">find Firefox process ID</td>
  </tr>
<tr>
    <td class="tg-0pky">pstree</td>
    <td class="tg-0pky">Visualizing processess in tree model</td>
  </tr>
</tbody>
</table>
</div>

<strong>Network Related </strong>

<style type="text/css">
.tg  {border:none;border-collapse:collapse;border-color:#9ABAD9;border-spacing:0;}
.tg td{background-color:#EBF5FF;border-color:#9ABAD9;border-style:solid;border-width:0px;color:#444;
  font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{background-color:#409cff;border-color:#9ABAD9;border-style:solid;border-width:0px;color:#fff;
  font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-ng5i{background-color:#000000;border-color:inherit;font-size:24px;text-align:left;vertical-align:top}
.tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
</style>
<div class="table-responsive text-nowrap">
<table class="tg">
<colgroup>
<col style="width: 201px">
<col style="width: 459px">
</colgroup>
<thead>
  <tr>
    <th class="tg-ng5i"><span style="font-weight:bold;color:#FFF">Commands</span></th>
    <th class="tg-ng5i"><span style="font-weight:bold">     Descriptions</span></th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0pky">ip addr show </td>
    <td class="tg-0pky">Displays IP addresses and all the network interfaces</td>
  </tr>
  <tr>
    <td class="tg-0pky">ip address add 192.1.20<br> dev eth0</td>
    <td class="tg-0pky">Set Ip address</td>
  </tr>
  <tr>
    <td class="tg-0pky">ifconfig</td>
    <td class="tg-0pky">Displays Ip addresses of all network interfaces</td>
  </tr>
  <tr>
    <td class="tg-0pky">ping host </td>
    <td class="tg-0pky">ping command sends an ICMP echo request to establish a connection to <br>server/Pc</td>
  </tr>
  <tr>
    <td class="tg-0pky">whois domain</td>
    <td class="tg-0pky">Retrievs more information about a domain name </td>
  </tr>
  <tr>
    <td class="tg-0pky">dig domain</td>
    <td class="tg-0pky">Retrievs DNS infromation about the domain</td>
  </tr>
  <tr>
    <td class="tg-0pky">dig-x host</td>
    <td class="tg-0pky">Performs reverse lookup on a domain</td>
  </tr>
  <tr>
    <td class="tg-0pky">host google.com</td>
    <td class="tg-0pky">perfroms an Ip lookup for the domain name</td>
  </tr>
  <tr>
    <td class="tg-0pky">hostname-i</td>
    <td class="tg-0pky">Display all local Ip address</td>
  </tr>

  <tr>
    <td class="tg-0pky">wget &lt;file_name&gt;</td>
    <td class="tg-0pky">Downloads a file from an online source</td>
  </tr>
  <tr>
    <td class="tg-0pky">netstat-pnltu</td>
    <td class="tg-0pky">Displays all active listening port </td>
  </tr>
</tbody>
</table>
</div>

<strong>Compression/Archives </strong>

<style type="text/css">
.tg  {border:none;border-collapse:collapse;border-color:#9ABAD9;border-spacing:0;}
.tg td{background-color:#EBF5FF;border-color:#9ABAD9;border-style:solid;border-width:0px;color:#444;
  font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{background-color:#409cff;border-color:#9ABAD9;border-style:solid;border-width:0px;color:#fff;
  font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-ng5i{background-color:#000000;border-color:inherit;font-size:24px;text-align:left;vertical-align:top}
.tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
</style>
<div class="table-responsive text-nowrap">
<table class="tg">
<colgroup>
<col style="width: 201px">
<col style="width: 459px">
</colgroup>
<thead>
  <tr>
    <th class="tg-ng5i"><span style="font-weight:bold;color:#FFF">Commands</span></th>
    <th class="tg-ng5i"><span style="font-weight:bold">     Descriptions</span></th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0pky">tar -cf home.tar home</td>
    <td class="tg-0pky">creates archive file called 'home.tar' from file 'home' </td>
  </tr>
  <tr>
    <td class="tg-0pky">tar -Xf files.tar</td>
    <td class="tg-0pky">Extracct archive file 'files.tar'</td>
  </tr>
  <tr>
    <td class="tg-0pky">tar -ZCVf home.tar.gz <br> Source-folder</td>
    <td class="tg-0pky">Creates gzipped tar archive file from source folder</td>
  </tr>
  <tr>
    <td class="tg-0pky">gzip file</td>
    <td class="tg-0pky">Compression a file with .gz extension</td>
  </tr>
  </tbody>
</table>
</div>

<strong> Install packages </strong>

<style type="text/css">
.tg  {border:none;border-collapse:collapse;border-color:#9ABAD9;border-spacing:0;}
.tg td{background-color:#EBF5FF;border-color:#9ABAD9;border-style:solid;border-width:0px;color:#444;
  font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{background-color:#409cff;border-color:#9ABAD9;border-style:solid;border-width:0px;color:#fff;
  font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-ng5i{background-color:#000000;border-color:inherit;font-size:24px;text-align:left;vertical-align:top}
.tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
</style>
<div class="table-responsive text-nowrap">
<table class="tg">
<colgroup>
<col style="width: 201px">
<col style="width: 459px">
</colgroup>
<thead>
  <tr>
    <th class="tg-ng5i"><span style="font-weight:bold;color:#FFF">Commands</span></th>
    <th class="tg-ng5i"><span style="font-weight:bold">     Descriptions</span></th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0pky">rpm -i pkg_name.rpm</td>
    <td class="tg-0pky">Install an rpm package</td>
  </tr>
  <tr>
    <td class="tg-0pky">rpm -e pkg_name</td>
    <td class="tg-0pky">Removes an rpm package</td>
  </tr>
  <tr>
    <td class="tg-0pky">dnf install pkg_name</td>
    <td class="tg-0pky">Install package using dnf utility</td>
  </tr>
  </tbody>
</table>
</div>

<strong> Install Source (Compilation) </strong>

./ configure <br>
make <br>
make install

<strong>Search </strong>

<style type="text/css">
.tg  {border:none;border-collapse:collapse;border-color:#9ABAD9;border-spacing:0;}
.tg td{background-color:#EBF5FF;border-color:#9ABAD9;border-style:solid;border-width:0px;color:#444;
  font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{background-color:#409cff;border-color:#9ABAD9;border-style:solid;border-width:0px;color:#fff;
  font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-ng5i{background-color:#000000;border-color:inherit;font-size:24px;text-align:left;vertical-align:top}
.tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
</style>
<div class="table-responsive text-nowrap">
<table class="tg">
<colgroup>
<col style="width: 201px">
<col style="width: 459px">
</colgroup>
<thead>
  <tr>
    <th class="tg-ng5i"><span style="font-weight:bold;color:#FFF">Commands</span></th>
    <th class="tg-ng5i"><span style="font-weight:bold">     Descriptions</span></th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0pky">grep 'pattern' files</td>
    <td class="tg-0pky">Search for a given pattern in files </td>
  </tr>
  <tr>
    <td class="tg-0pky">grep -r pattern dir</td>
    <td class="tg-0pky">Search recursively for a pattern in a given directory</td>
  </tr>
  <tr>
    <td class="tg-0pky">locate file</td>
    <td class="tg-0pky">Find all instances of the file</td>
  </tr>
  <tr>
    <td class="tg-0pky">find /home/ -name "index"</td>
    <td class="tg-0pky">Find file names that begin with 'index in /home folder</td>
  </tr>
<tr>
    <td class="tg-0pky">find /home/ -size +10000k</td>
    <td class="tg-0pky">Find files greater than 10000k in the home folder</td>
  </tr>
  </tbody>
</table>
</div>

<strong> Login </strong>

<style type="text/css">
.tg  {border:none;border-collapse:collapse;border-color:#9ABAD9;border-spacing:0;}
.tg td{background-color:#EBF5FF;border-color:#9ABAD9;border-style:solid;border-width:0px;color:#444;
  font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{background-color:#409cff;border-color:#9ABAD9;border-style:solid;border-width:0px;color:#fff;
  font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-ng5i{background-color:#000000;border-color:inherit;font-size:24px;text-align:left;vertical-align:top}
.tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
</style>
<div class="table-responsive text-nowrap">
<table class="tg">
<colgroup>
<col style="width: 201px">
<col style="width: 459px">
</colgroup>
<thead>
  <tr>
    <th class="tg-ng5i"><span style="font-weight:bold;color:#FFF">Commands</span></th>
    <th class="tg-ng5i"><span style="font-weight:bold">     Descriptions</span></th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0pky">ssh user@host</td>
    <td class="tg-0pky">Securely connect to host as user </td>
  </tr>
  <tr>
    <td class="tg-0pky">ssh -p &lt;port_number&gt; <br>user@host</td>
    <td class="tg-0pky">Securely connect to host using a specified port</td>
  </tr>
  <tr>
    <td class="tg-0pky">ssh host </td>
    <td class="tg-0pky">Securely connect to the system via SSH default port 22</td>
  </tr>
  <tr>
    <td class="tg-0pky">telnet host</td>
    <td class="tg-0pky">Connect to host via telnet default port 23 </td>
  </tr>

  </tbody>
</table>
</div>

<strong> File Transfer </strong>

<style type="text/css">
.tg  {border:none;border-collapse:collapse;border-color:#9ABAD9;border-spacing:0;}
.tg td{background-color:#EBF5FF;border-color:#9ABAD9;border-style:solid;border-width:0px;color:#444;
  font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{background-color:#409cff;border-color:#9ABAD9;border-style:solid;border-width:0px;color:#fff;
  font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-ng5i{background-color:#000000;border-color:inherit;font-size:24px;text-align:left;vertical-align:top}
.tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
</style>
<div class="table-responsive text-nowrap">
<table class="tg">
<colgroup>
<col style="width: 201px">
<col style="width: 459px">
</colgroup>
<thead>
  <tr>
    <th class="tg-ng5i"><span style="font-weight:bold;color:#FFF">Commands</span></th>
    <th class="tg-ng5i"><span style="font-weight:bold">     Descriptions</span></th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0pky">scp file1.txt server2/tmp</td>
    <td class="tg-0pky">Securely copy file1.txt to server2 in /tmp diretory </td>
  </tr>
  <tr>
    <td class="tg-0pky">rsync -a/home/apps /backup</td>
    <td class="tg-0pky">Synchronize contents in /home/apps directory with directory</td>
  </tr>
  </tbody>
</table>
</div>

<strong> Disk usages </strong>

<style type="text/css">
.tg  {border:none;border-collapse:collapse;border-color:#9ABAD9;border-spacing:0;}
.tg td{background-color:#EBF5FF;border-color:#9ABAD9;border-style:solid;border-width:0px;color:#444;
  font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{background-color:#409cff;border-color:#9ABAD9;border-style:solid;border-width:0px;color:#fff;
  font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-ng5i{background-color:#000000;border-color:inherit;font-size:24px;text-align:left;vertical-align:top}
.tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
</style>
<div class="table-responsive text-nowrap">
<table class="tg">
<colgroup>
<col style="width: 201px">
<col style="width: 459px">
</colgroup>
<thead>
  <tr>
    <th class="tg-ng5i"><span style="font-weight:bold;color:#FFF">Commands</span></th>
    <th class="tg-ng5i"><span style="font-weight:bold">     Descriptions</span></th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0pky">df -h </td>
    <td class="tg-0pky">Displays free space on mounted systems </td>
  </tr>
  <tr>
    <td class="tg-0pky">df -i </td>
    <td class="tg-0pky">Displays free inodes on filesystems</td>
  </tr>
  <tr>
    <td class="tg-0pky">fdisk -l</td>
    <td class="tg-0pky">Shows disk partitions, sizes,and types</td>
  </tr>
  <tr>
    <td class="tg-0pky">du -sh</td>
    <td class="tg-0pky">Displays disk usage in the current directory in a human readable format</td>
  </tr>
<tr>
    <td class="tg-0pky">findmnt</td>
    <td class="tg-0pky">Displays target mount points for all filesystems</td>
  </tr>
  <tr>
    <td class="tg-0pky">mount device-path <br> mount-point</td>
    <td class="tg-0pky">Mount a device</td>
  </tr>
  </tbody>
</table>
</div>

<strong> Directory Traverse </strong>

<style type="text/css">
.tg  {border:none;border-collapse:collapse;border-color:#9ABAD9;border-spacing:0;}
.tg td{background-color:#EBF5FF;border-color:#9ABAD9;border-style:solid;border-width:0px;color:#444;
  font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{background-color:#409cff;border-color:#9ABAD9;border-style:solid;border-width:0px;color:#fff;
  font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-ng5i{background-color:#000000;border-color:inherit;font-size:24px;text-align:left;vertical-align:top}
.tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
</style>
<div class="table-responsive text-nowrap">
<table class="tg">
<colgroup>
<col style="width: 201px">
<col style="width: 459px">
</colgroup>
<thead>
  <tr>
    <th class="tg-ng5i"><span style="font-weight:bold;color:#FFF">Commands</span></th>
    <th class="tg-ng5i"><span style="font-weight:bold">     Descriptions</span></th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0pky">cd .. </td>
    <td class="tg-0pky">Move up one level in the directory tree structure</td>
  </tr>
  <tr>
    <td class="tg-0pky">cd</td>
    <td class="tg-0pky">change directory to the $HOME directory</td>
  </tr>
  <tr>
    <td class="tg-0pky">cd /test</td>
    <td class="tg-0pky">Change directory to the /test directory</td>
  </tr>
  </tbody>
</table>
</div>
