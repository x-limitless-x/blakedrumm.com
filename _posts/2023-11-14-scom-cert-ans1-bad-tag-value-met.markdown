---
layout: post
date: '2023-11-14 14:33:27 -0500'
title: "SCOM Certificate Error - ASN1 Bad Tag Value Met"
categories: troubleshooting guides operationsManager
author: blakedrumm
thumbnail: /assets/img/posts/scom-ans1-bad-tag-value-met.png
toc: true

summary: >- # this means to ignore newlines
  Troubleshooting a SCOM issue where the certificate generation fails with an ASN1 bad tag value met error. This guide provides steps to diagnose and resolve the issue.

keywords: scom, unix, linux, certificate, troubleshooting
permalink: /blog/scom-cert-issue/
---
## :book: Introduction
Today I encountered an issue where SCOM fails to generate a certificate for Unix/Linux agents with an error message stating "ASN1 bad tag value met".

### Error Description
>Task invocation failed with error code -2130771918. Error message was: The SCXCertWriteAction module encountered a DoProcess exception. The workflow "Microsoft.Unix.Agent.GetCert.Task" has been unloaded. \
> \
> \
>Module: SCXCertWriteAction \
>Location: DoProcess \
>Exception type: ScxCertLibException \
>Exception message: <span style="color:yellow">Unable to create certificate context <br>
>; {ASN1 bad tag value met. <br>
>}
></span> \
>Additional data: Sudo path: /etc/opt/microsoft/scx/conf/sudodir/
>
>Management group: SCOM2019 \
>Workflow name: Microsoft.Unix.Agent.GetCert.Task \
>Object name: UNIX/Linux Resource Pool \
>Object ID: {7B5B80D1-5C4A-6643-762D-60F46FB70CB8}

---

## :mag: Possible Causes and Resolution
### Possible Causes
- Sudoers permissions are missing.
- Errors in SSHCommandProbe.log (look for `errdata`)
> 3: 08/08/22 12:01:59 : Entering RunSSHCommand \
> 3: 08/08/22 12:01:59 : Using su command:   su - root -c \
> 3: 08/08/22 12:01:59 : Using sudo command: ${SUDO_PATH}sudo sh -c \
> 3: 08/08/22 12:01:59 : sending: if [ -x /etc/opt/microsoft/scx/conf/sudodir/sudo ]; then \
>   SUDO_PATH=/etc/opt/microsoft/scx/conf/sudodir/; export SUDO_PATH \
> else \
>   if [ -x /opt/sfw/bin/sudo ]; then \
>     SUDO_PATH=/opt/sfw/bin/; export SUDO_PATH \
>   else \
>     SUDO_PATH=/usr/bin/; export SUDO_PATH \
>   fi \
> fi \
> echo "Sudo path: ${SUDO_PATH}" \
> ${SUDO_PATH}sudo sh -c 'cat /etc/opt/microsoft/scx/ssl/scx.pem' \
>  \
> 3: 08/08/22 12:01:59 : Enter SSHFacade::RunCommand \
> 3: 08/08/22 12:02:02 : Leave SSHFacade::RunCommand \
> 3: 08/08/22 12:02:02 : returned: Sudo path: /etc/opt/microsoft/scx/conf/sudodir/ \
>  \
> <span style="color:yellow">errdata: sudo: a terminal is required to read the password; either use the -S option to read from standard input or configure an askpass helper</span>
- In the secure log file on the Linux Server, you should see messages like:
>Aug  8 12:32:00 rhel8-5 sshd[2749309]: pam_unix(sshd:session): session opened for user scxmaint by (uid=0) \
>Aug  8 12:32:00 rhel8-5 sudo[2749343]: pam_unix(sudo:auth): conversation failed \
>Aug  8 12:32:00 rhel8-5 sudo[2749343]: pam_unix(sudo:auth): auth could not identify password for [scxmaint] \
>Aug  8 12:32:02 rhel8-5 sudo[2749343]: <span style="color:yellow">scxmaint : command not allowed</span> ; TTY=unknown ; PWD=/home/scxmaint ; USER=root ; COMMAND=/bin/sh -c cat /etc/opt/microsoft/scx/ssl/scx.pem \
>Aug  8 12:32:02 rhel8-5 sshd[2749309]: pam_unix(sshd:session): session closed for user scxmaint

### How to fix it
1. Check and verify the sudoers are setup correctly: \
[https://social.technet.microsoft.com/wiki/contents/articles/7375.scom-configuring-sudo-elevation-for-unix-and-linux-monitoring.aspx](https://social.technet.microsoft.com/wiki/contents/articles/7375.scom-configuring-sudo-elevation-for-unix-and-linux-monitoring.aspx).


Leave some feedback if this helped you! :v:

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/scom-cert-issue/)

<!--
## Welcome to GitHub Pages
... [Remaining GitHub Pages content] ...
-->
