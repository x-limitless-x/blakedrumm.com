---
layout: post
date:   '2021-07-06 02:16:42 -0500'
categories: powershell projects operationsManager
title: System Center Operations Manager - Data Collector
author: blakedrumm
thumbnail: /assets/img/posts/scom-data-collector.png
toc: true

summary: >- # this means to ignore newlines
  With the SCOM Data Collector you can collect a lot of useful data to analyze and troubleshoot
  your System Center Operations Manager Environment! This is a go to tool for any SCOM Admin 
  that wants a wholistic view of their configuration and setup. Written in Powershell!

keywords: scom data collector, data collector for SCOM, data collector script, SDC_Results, scom, Operations Manager Data Collector, Performance Analysis, powershell script for SCOM, powershell script
permalink: /blog/scom-data-collector/
---

## :book: Introduction
This tool was designed to assist with troubleshooting complex System Center Operations Manager issues.

## :arrow_down_small: Quick Download Link
[https://aka.ms/SCOM-DataCollector](https://aka.ms/SCOM-DataCollector)

[![Latest Version](https://img.shields.io/github/v/release/blakedrumm/SCOM-Scripts-and-SQL)](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/releases/latest){:class="img-shields-io"} \
[![Download Count Latest](https://img.shields.io/github/downloads/blakedrumm/SCOM-Scripts-and-SQL/latest/SCOM-DataCollector.zip?style=for-the-badge&color=brightgreen)](https://aka.ms/SCOM-DataCollector){:class="img-shields-io"} \
[![Download Count Releases](https://img.shields.io/github/downloads/blakedrumm/SCOM-Scripts-and-SQL/total.svg?style=for-the-badge&color=brightgreen)](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/releases){:class="img-shields-io"}

## :page_facing_up: Personal Webpage
#### Data Collector
[https://files.blakedrumm.com/SCOM-DataCollector.zip](https://files.blakedrumm.com/SCOM-DataCollector.zip)
#### Report Builder
[https://files.blakedrumm.com/ReportBuilder.zip](https://files.blakedrumm.com/ReportBuilder.zip)

## :link: Github Link
#### Data Collector
[https://github.com/blakedrumm/SCOM-Scripts-and-SQL/releases/latest/download/SCOM-DataCollector.zip](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/releases/latest/download/SCOM-DataCollector.zip)
#### Report Builder
[https://github.com/blakedrumm/SCOM-Scripts-and-SQL/releases/latest/download/ReportBuilder.zip](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/releases/latest/download/ReportBuilder.zip)

## :red_circle: Requirements
- System Center Operations Manager - Management Server
- Administrator Privileges
- Powershell 4

## :page_with_curl: Instructions
[Download the zip file](https://aka.ms/SCOM-DataCollector) and extract zip file to a directory (ex. C:\Data Collector). You have 2 options for running this script.
1. Right Click the SCOM Data Collector script and select Run with Powershell.
2. Open an Powershell shell __as Adminstrator__ and change to the directory the SCOM Data Collector Powershell Script is located, such as:
   ```powershell
   cd C:\Data Collector
   .\DataCollector-v4.0.0.ps1
   ```

 >### :o: Optional
 >You have the ability to run this script as any user you would like when you start the script without any switches. The default is the System Center Data Access Service account.

Run this script on a Operations Manager Management Server to gather their SQL server names and DB names from the local registry. Otherwise user will need to manually input names. It will attempt to query the SQL Server Instance remotely, and will create CSV output files in the Output folder located in the SCOM Data Collector script directory.The SCOM Data Collector has the ability to query multiple databases in the SCOM SQL Instance (_master, OperationsManager, OperationsManagerDW_), having a high level of rights to SQL is preferred for a full gather.

After the script has completed you will see that the Output folder that is temporary created during script execution is removed. The Data Collector will automatically create a zip file in the same directory as the SCOM Data Collector Powershell Script named something similar to this: \
`SDC_Results_04_04_1975.zip`

This script has the ability to gather the following information:

 - Data from Management Server(s), Operations Manager SQL Server(s). You can also gather from Servers(s) specified with `-Servers`.
 - Event Logs – Application, System, OperationsManager
 - SCOM Version Installed
 - Update Rollup Information for SCOM Upgrades
 - SQL Queries that collect information about many aspects of your environment (too many queries to go into detail here, here are some of the queries it uses: [https://github.com/blakedrumm/SCOM-Scripts-and-SQL/tree/master/SQL%20Queries](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/tree/master/SQL%20Queries))
 - Windows Updates installed on Management Servers / SQL Server
 - Service Principal Name (SPN) Information for SCOM Management Servers
 - Local Administrators Group on each Management Server and any other servers you specify
 - Local User Account Rights on each Management Server and any other servers you specify
 - Database Information / DB Version
 - SCOM RunAs Account Information
 - Check TLS 1.2 Readiness
 - TLS Settings on each Management Server and SQL Server
 - MSInfo32
 - Sealed / Unsealed MPs
 - Clock Synchronization
 - Latency Check (Ping Test)
 - Rules / Monitors in your SCOM Environment
 - Get Run As Accounts from SCOM Management Group
 - Test SCOM Ports
 - Best Practice Analyzer to verify you are following SCOM Best Practices *(only a few items being checked currently)*
 - Gathers Group Policy settings on each Management Server and SQL Server
 - Gathers installed Software on each Management Server
 - Management Group Overall Health and verify Configuration matches across Management Servers in Management Group
 - Check SCOM Certificates for Validity / Usability
 - SCOM Install / Update Logs
 - IP Address of each Management Server
 - Gather SCOM Configuration from registry and configuration file
 - ***this list is not complete...***

----

## :question: Examples

>### :o: Optional
>If you know you have (read) Query rights against the DB(s) and Administrator permissions on the Management Servers, run any Switch (-Command) with -AssumeYes (-Yes). Otherwise you will need to provide an account that has permissions at runtime.


### Available Switches
Every Switch Available:

```powershell
.\DataCollector.ps1 -All -ManagementServers "<array>" -Servers "<array>" -AdditionalEventLogs "<array>" -GetRulesAndMonitors -GetRunAsAccounts -CheckTLS -CheckCertificates -GetEventLogs -ExportMPs -GPResult -SQLLogs -CheckPorts -GetLocalSecurity -GetInstalledSoftware -GetSPN -AssumeYes -GetConfiguration -CheckGroupPolicy -GetInstallLogs -SkipSQLQueries -SQLOnly -SQLOnlyOpsDB -SQLOnlyDW -BuildPipeline -CaseNumber "<string>" -ExportSCXCertificates -ExportMSCertificates -GenerateHTML -GetNotificationSubscriptions -GetUserRoles -LeastAmount -MSInfo32 -NoSQLPermission -PingAll -SCXAgents "<array>" -SCXUsername "<string>" -SCXMaintenanceUsername "<string>" -SCXMonitoringUsername "<string>" -SkipBestPracticeAnalyzer -SkipConnectivityTests -SkipGeneralInformation -SQLLogs
```


### All Switches
This will allow you to run every switch available currently:

```powershell
.\DataCollector.ps1 -All
.\DataCollector.ps1 -All -Servers Agent1
.\DataCollector.ps1 -All -Servers Agent1, Agent2, Agent3
.\DataCollector.ps1 -All -Servers Agent1 -ManagementServer MS01-2019.contoso.com, MS02-2019.contoso.com
.\DataCollector.ps1 -All -Yes
```


### Built in menu
To see the built in menu, run the script with no arguments or switches:

```powershell
.\DataCollector.ps1
```
You can also right click the `.ps1` file and Run with Powershell.


### Certificates
To Check the Certificate(s) Installed on the Management Server(s) in the Management Group, and an Server:

```powershell
.\DataCollector.ps1 -CheckCertificates -Servers AppServer1.contoso.com
```

To Check the Certificate(s) Installed on the Management Server(s) in the Management Group:

```powershell
.\DataCollector.ps1 -CheckCertificates
```

### Gather only SQL Queries
To gather only the SQL Queries run the following:

```powershell
.\DataCollector.ps1 -SQLOnly
```

If you know the account running the Data Collector has permissions against the SCOM Databases, run this:

```powershell
.\DataCollector.ps1 -SQLOnly -Yes
```



### Event Logs
To gather Event Logs from 3 Agents and the Management Server(s) in the Current Management Group:

```powershell
.\DataCollector.ps1 -GetEventLogs -Servers Agent1.contoso.com, Agent2.contoso.com, Agent3.contoso.com
```

To just gather the Event Logs from the Management Server(s) in the Management Group:

```powershell
.\DataCollector.ps1 -GetEventLogs
```


### Management Packs
To Export Installed Management Packs:

```powershell
.\DataCollector.ps1 -ExportMPs
```


### RunAs Accounts
To Export RunAs Accounts from the Management Server:

```powershell
.\DataCollector.ps1 -GetRunAsAccounts
```


### Check TLS 1.2 Readiness
To Run the TLS 1.2 Hardening Readiness Checks on every Management Server and SQL SCOM DB Server(s) in the Management Group:

```powershell
.\DataCollector.ps1 -CheckTLS
```

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/scom-data-collector/)

<!--
## Welcome to GitHub Pages

You can use the [editor on GitHub](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/edit/master/docs/index.md) to maintain and preview the content for your website in Markdown files.

Whenever you commit to this repository, GitHub Pages will run [Jekyll](https://jekyllrb.com/) to rebuild the pages in your site, from the content in your Markdown files.

### Markdown

Markdown is a lightweight and easy-to-use syntax for styling your writing. It includes conventions for

```markdown
Syntax highlighted code block

# Header 1
## Header 2
### Header 3

- Bulleted
- List

1. Numbered
2. List

**Bold** and _Italic_ and `Code` text

[Link](url) and ![Image](src)
```

For more details see [GitHub Flavored Markdown](https://guides.github.com/features/mastering-markdown/).

### Jekyll Themes

Your Pages site will use the layout and styles from the Jekyll theme you have selected in your [repository settings](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/settings/pages). The name of this theme is saved in the Jekyll `_config.yml` configuration file.

### Support or Contact

Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.

Tip:
To add auto-size pictures:
![/assets/img/posts/example.jpg](/assets/img/posts/example.jpg){:class="img-fluid"}
-->
