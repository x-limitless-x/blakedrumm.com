---
layout: post
title:  "Resolve SCOM Agent Deployment Error: 80070643"
date:   '2022-07-29 13:36:21 -0500'
categories: troubleshooting guides powershell operationsManager
author: blakedrumm
thumbnail: /assets/img/posts/SCOM-Agent-Deployment-Error-80070643.png

summary: >- # this means to ignore newlines
  This article describes how to resolve an SCOM Agent Deployment Error you may experience which can affect the ability to upgrade or install an Agent. 

keywords: resolve 80070643, scom management server 80070643, event 80070643, scom agent upgrade error, agent update error
permalink: /blog/resolve-scom-agent-deployment-80070643/
---
 I had a case where my customer is experiencing an error on their SCOM Console when attempting to resolve an agent Pending Upgrade in Pending Management. The Agent needed to be upgraded from the SCOM 2019 Agent to the SCOM 2022 Agent. We reviewed the Log file: `Agent1AgentInstall.Log` located in the following directory: `C:\Program Files\Microsoft System Center\Operations Manager\Server\AgentManagement\AgentLogs`.
 
 The MSI error highlighted below was the main cause for the installation failure:
  > Action start 16:18:53: _SuppressComputerReboot.
  > MSI (s) (AC:F0) [16:18:53:021]: Skipping action: SetIS_NETFRAMEWORK_472_OR_LATER_INSTALLED (condition is false)
  > MSI (s) (AC:F0) [16:18:53:021]: Doing action: LaunchConditions
  > Action ended 16:18:53: _SuppressComputerReboot. Return value 1.
  > Action start 16:18:53: LaunchConditions.
  > MSI (s) (AC:F0) [16:18:53:021]: Product: Microsoft Monitoring Agent -- <span style="color:yellow">The .NET Framework 4.7.2 is required to install this application.
  > 
  > The .NET Framework 4.7.2 is required to install this application.</span>
  > Action ended 16:18:53: LaunchConditions. Return value 3.
  > Action ended 16:18:53: INSTALL. Return value 3.

We also attempted a manual install and this will also show you the error:
![DotNET Missing MSI Error](/assets/img/posts/dotNET-4_7_2-missing.png)

After installing **.NET Framework 4.7.2** as required for the SCOM 2022 Agent, the installation succeeded. \
[SCOM 2022 Agent Requirements](https://docs.microsoft.com/system-center/scom/system-requirements?view=sc-om-2022#microsoft-monitoring-agent-operating-system)

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/resolve-scom-agent-deployment-80070643/)

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.
-->
