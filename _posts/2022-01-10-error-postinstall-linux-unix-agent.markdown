---
layout: post
title:  "Resolve Post Install error with Unix / Linux Install for SCOM Agent"
date:   '2022-01-10 18:04:26 -0500'
categories: troubleshooting linux
author: blakedrumm
thumbnail: /assets/img/posts/scx-agent-list.png
summary: I recently had a case where my customer was experiencing an issue when attempting to install the SCOM Agent onto a Solaris 10 server. SCOM 2019 Management Group.
keywords: unix linux agent install issue, scom solaris agent install issue, scom solaris install, unable to discover solaris server, solaris scom, scom linux agent install
permalink: /blog/error-postinstall-linux-unix-agent/
---
My customer was running Solaris 10 (SunOS 5.10), they were having issues when attempting to install the SCOM Agent (scx-1.6.8-1.solaris.10.sparc.sh). So we dug further into things to verify why the installer was failing on the __PostInstall__ step.

I asked the customer to copy the SCOM Linux / Unix Agent install files (`C:\Program Files\Microsoft System Center\Operations Manager\Server\AgentManagement\UnixAgents\DownloadedKits`) to the Solaris Machine so we can attempt a manual installation.

Extract the Solaris Installer file:
```shell
sh scx-1.6.8-1.solaris.10.sparc.sh --extract
```

We looked at the output after running the install manually:
```shell
[solaris10:root@/home/ops_monitoring/scxbundle.24766] pkgadd -d scx-1.6.8-1.solaris.10.sparc.pkg
 
The following packages are available:
  1  MSFTscx     Microsoft System Center 2012 Operations Manager for UNIX/Linux agent
                 (sparc) 1.6.8-1
 
Select package(s) you wish to process (or 'all' to process
all packages). (default: all) [?,??,q]:
 
Processing package instance <MSFTscx> from </home/ops_monitoring/scxbundle.24766/scx-1.6.8-1.solaris.10.sparc.pkg>
 
Microsoft System Center 2012 Operations Manager for UNIX/Linux agent(sparc) 1.6.8-1
http://www.microsoft.com
## Processing package information.
## Processing system information.
## Verifying package dependencies.
## Verifying disk space requirements.
## Checking for conflicts with packages already installed.
## Checking for setuid/setgid programs.
 
This package contains scripts which will be executed with super-user
permission during the process of installing this package.
 
Do you want to continue with the installation of <MSFTscx> [y,n,?] y
 
Installing Microsoft System Center 2012 Operations Manager for UNIX/Linux agent as <MSFTscx>
 
## Executing preinstall script.
Waiting for service stop: svc:/application/management/omid ...
## Installing part 1 of 1.
/etc/opt/microsoft/scx/pf_file.sh
/etc/opt/omi/conf/omiregister/root-scx/SCXProvider-omi.reg
/etc/opt/omi/conf/omiregister/root-scx/SCXProvider-req.reg
/etc/opt/omi/conf/omiregister/root-scx/SCXProvider-root.reg
/opt/microsoft/scx/bin/omi_preexec
/opt/microsoft/scx/bin/scxlogfilereader
/opt/microsoft/scx/bin/setup.sh
/opt/microsoft/scx/bin/tools/.scxadmin
/opt/microsoft/scx/bin/tools/.scxsslconfig
/opt/microsoft/scx/bin/tools/scxadmin
/opt/microsoft/scx/bin/tools/scxsslconfig
/opt/microsoft/scx/bin/tools/setup.sh
/opt/microsoft/scx/bin/uninstall
/opt/microsoft/scx/lib/libSCXCoreProviderModule.so
/opt/omi/lib/libSCXCoreProviderModule.so <symbolic link>
[ verifying class <none> ]
/etc/opt/microsoft/scx/conf/installinfo.txt
/etc/opt/microsoft/scx/conf/scxconfig.conf
/etc/opt/microsoft/scx/conf/scxlog.conf
/etc/opt/microsoft/scx/conf/scxrunas.conf
[ verifying class <config> ]
## Executing postinstall script.
/var/sadm/pkg/MSFTscx/install/postinstall: ENV=/usr/sislocal/profile: is not an identifier
pkgadd: ERROR: postinstall script did not complete successfully
 
Installation of <MSFTscx> failed.
```

The piece of the message above that stood out to me was this line:
```shell
/var/sadm/pkg/MSFTscx/install/postinstall: ENV=/usr/sislocal/profile: is not an identifier
```

I asked the customer to take a look at their Environmental Variables in `/etc/profile` and verify if there are any custom lines in there. We noticed there were custom lines, __we removed these lines and attempted the installation again, it succeeded!__

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/error-postinstall-linux-unix-agent)

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.
-->
