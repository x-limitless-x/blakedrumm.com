---
layout: post
title:  "Troubleshooting Tips for Unix / Linux System Center Operations Manager Agents"
date:   '2022-01-26 12:21:52 -0500'
categories: troubleshooting
author: blakedrumm
thumbnail: /assets/img/posts/prerequisite-software-unix-linux.png
summary: Tips / Tricks for troubleshooting SCOM Unix / Linux Agent issues.
permalink: /blog/scom-unix-linux-troubleshooting-tips/
---
## Verify the versions for all prerequisite software
You can run the following command on a working and non-working server to compare the software installed:
```shell
rpm -qa | egrep "^glibc|^openssl|^pam|^scx|^omi"
```

Working Example: \
![Example 2 - Prerequisite Software](/assets/img/posts/prerequisite-software-unix-linux-example2.png){:class="img-fluid"}

___

## Tail the Logs
You can run the following command to show current log data pertaining to authentication and authorization privileges:
```shell
tail -f /var/log/secure
```

You can run the following command to show all the global system messages, including the messages that are logged during system startup:
```shell
tail -f /var/log/messages
```

OMI Server Log:
```shell
tail -f /var/opt/microsoft/scx/log/omiserver.log
```

OMI Agent Log:
```shell
tail -f /var/opt/microsoft/scx/log/omiagent.root.root.log
```

SCX Agent Log:
```shell
tail -f /var/opt/microsoft/scx/log/scx.log
```

___

## Verify OpenSSL s_client
The OpenSSL s_client command is a helpful test client for troubleshooting remote SSL or TLS connections:
```shell
openssl s_client -connect server.domain.com:1270
openssl s_client -connect server.domain.com:1270 -tls1
openssl s_client -connect server.domain.com:1270 -ssl3
```

___

## Get MB / GB size of file
Run the following command to gather the MB / GB size of a file:
```shell
du -sh /var/opt/microsoft/scx/log/scx.log
```

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/scom-unix-linux-troubleshooting-tips)

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.
-->
