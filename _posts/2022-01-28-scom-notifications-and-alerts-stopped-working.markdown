---
layout: post
title:  "How to resolve SCOM Notifications Stopped & No New Alerts"
date:   '2022-01-28 14:21:52 -0500'
categories: troubleshooting operationsManager
author: blakedrumm
thumbnail: /assets/img/posts/SCOM-Notification-Bell-Email.png
summary: Here is how I resolved an issue my customer had with not receiving notification emails for alerts in SCOM. They also noticed there are no new alerts in several days.
keywords: scom notifications failed, opsmgr notifications, operations manager notifications, alerts not updating, no new alerts, alerts stalled, all management server resource pool failure
permalink: /blog/scom-notifications-and-alerts-stopped-working/
---
 
 First thing I noticed was that the SCOM Management Servers had an SCOM Agent Installed on it. We noticed by verifing the following location:
 ![Management Server - Bad Registry Keys](/assets/img/posts/agent-registry-scom-ms.png){:class="img-fluid"}

Apparently the Operations Manager Management Server received a package from SCCM, and this attempted to install the SCOM Agent (Microsoft Monitoring Agent) and overwrote some registry keys inside of the following location: \
`HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Microsoft Operations Manager\3.0\`

 > ## Precaution
 > Take care when directly modifying the Registry via [regedit.exe](https://support.microsoft.com/windows/how-to-open-registry-editor-in-windows-10-deab38e6-91d6-e0aa-4b7c-8878d9e07b11). If you insist on making changes, always backup the registry first. There is always the possiblity you can cause more damage than you are fixing.

I had the customer Delete the __AgentManagement__ key and we matched the Registry Values for __Server Management Groups__ to my lab environment.
![Management Server - Good Registry Keys](/assets/img/posts/management-server-registry.png){:class="img-fluid"}

After doing this we cleared the cache on the SCOM Management Servers by running the following PowerShell script: \
[SCOM-Scripts-and-SQL/Clear-SCOMCache.ps1 at master · blakedrumm/SCOM-Script-and-SQL](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/blob/master/Powershell/Clear-SCOMCache.ps1)


We waited for a few minutes after clearing the SCOM Management Server cache. The Management Servers were coming back online, but they were still not receiving new Alerts, and there were not any Notification Emails.

While reviewing the Operations Manager Event Logs, we found that there were 2115 Errors indicating an issue with the insertion of Discovery and other related data:

___

## Event 1

  >__Log Name:__      Operations Manager \
  >__Source:__        HealthService \
  >__Date:__          1/20/2022 3:42:02 PM \
  >__Event ID:__      2115 \
  >__Task Category:__ None \
  >__Level:__         Warning \
  >__Keywords:__      Classic \
  >__User:__          N/A \
  >__Computer:__      ManagementServer1.contoso.com \
  >__Description:__ \
  >A Bind Data Source in Management Group ManagementGroup1 has posted items to the workflow, but has not received a response in 480 seconds.  This indicates a performance or functional problem with the workflow. \
  >__Workflow Id :__ <span style="color:yellow">Microsoft.SystemCenter.CollectEventData</span> \
  >__Instance    :__ ManagementServer1.contoso.com \
  >__Instance Id :__ {AEC38E5Z-67A9-0406-20DB-ACC33BB9C4A4}

___

 ## Event 2

  >__Log Name:__      Operations Manager \
  >__Source:__        HealthService \
  >__Date:__          1/20/2022 3:42:02 PM \
  >__Event ID:__      2115 \
  >__Task Category:__ None \
  >__Level:__         Warning \
  >__Keywords:__      Classic \
  >__User:__          N/A \
  >__Computer:__      ManagementServer1.contoso.com \
  >__Description:__ \
  >A Bind Data Source in Management Group ManagementGroup1 has posted items to the workflow, but has not received a response in 480 seconds.  This indicates a performance or functional problem with the workflow. \
  >__Workflow Id :__ <span style="color:yellow">Microsoft.SystemCenter.CollectPerformanceData</span> \
  >__Instance    :__ ManagementServer1.contoso.com \
  >__Instance Id :__ {AEC38E5Z-67A9-0406-20DB-ACC33BB9C4A4}

___

 ## Event 3

  >__Log Name:__      Operations Manager \
  >__Source:__        HealthService \
  >__Date:__          1/20/2022 3:42:02 PM \
  >__Event ID:__      2115 \
  >__Task Category:__ None \
  >__Level:__         Warning \
  >__Keywords:__      Classic \
  >__User:__          N/A \
  >__Computer:__      ManagementServer1.contoso.com \
  >__Description:__ \
  >A Bind Data Source in Management Group ManagementGroup1 has posted items to the workflow, but has not received a response in 480 seconds.  This indicates a performance or functional problem with the workflow. \
  >__Workflow Id :__ <span style="color:yellow">Microsoft.SystemCenter.CollectPublishedEntityState</span> \
  >__Instance    :__ ManagementServer1.contoso.com \
  >__Instance Id :__ {AEC38E5Z-67A9-0406-20DB-ACC33BB9C4A4}

___

## Event 4

  >__Log Name:__      Operations Manager \
  >__Source:__        HealthService \
  >__Date:__          1/20/2022 3:42:03 PM \
  >__Event ID:__      2115 \
  >__Task Category:__ None \
  >__Level:__         Warning \
  >__Keywords:__      Classic \
  >__User:__          N/A \
  >__Computer:__      ManagementServer1.contoso.com \
  >__Description:__ \
  >A Bind Data Source in Management Group ManagementGroup1 has posted items to the workflow, but has not received a response in 480 seconds.  This indicates a performance or functional problem with the workflow. \
  >__Workflow Id :__ <span style="color:yellow">Microsoft.SystemCenter.CollectSignatureData</span> \
  >__Instance    :__ ManagementServer1.contoso.com \
  >__Instance Id :__ {AEC38E5Z-67A9-0406-20DB-ACC33BB9C4A4}

___

 ## Event 5

  >__Log Name:__      Operations Manager \
  >__Source:__        HealthService \
  >__Date:__          1/20/2022 3:42:30 PM \
  >__Event ID:__      2115 \
  >__Task Category:__ None \
  >__Level:__         Warning \
  >__Keywords:__      Classic \
  >__User:__          N/A \
  >__Computer:__      ManagementServer1.contoso.com \
  >__Description:__ \
  >A Bind Data Source in Management Group ManagementGroup1 has posted items to the workflow, but has not received a response in 480 seconds.  This indicates a performance or functional problem with the workflow. \
  >__Workflow Id :__ <span style="color:yellow">Microsoft.SystemCenter.CollectDiscoveryData</span> \
  >__Instance    :__ ManagementServer1.contoso.com \
  >__Instance Id :__ {AEC38E5Z-67A9-0406-20DB-ACC33BB9C4A4}

___

We reviewed the current SQL Logs and found that there were authentication failures that indicated the __Computer Account__ for the SCOM Management Server didnt have permission to the Database. This lead us to check the __Default Action Account__ in Run As Profiles. We modified the __Default Action Account__ for the Management Servers to be assigned an __Windows Action Account__ instead of __Local System__. This resolved the issue and now Notifications and Alerts are being being sent normally.

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/scom-notifications-and-alerts-stopped-working/)

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.
-->