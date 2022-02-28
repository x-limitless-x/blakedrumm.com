---
layout: post
title:  "SCOM Data Collector"
date:   '2021-07-06 02:16:42 -0500'
categories: powershell projects operationsManager
title: System Center Operations Manager - Data Collector
author: blakedrumm
thumbnail: /assets/img/posts/scom-data-collector.png
image: {{ post.thumbnail }}
summary: >- # this means to ignore newlines
  With the SCOM Data Collector you can collect a lot of useful data to analyze and troubleshoot
  your System Center Operations Manager Environment! This is a go to Tool for any SCOM Admin 
  that wants a wholistic view of their configuration and setup. Written in Powershell!

keywords: scom data collector, data collector for SCOM, data collector script, SDC_Results, scom, Operations Manager Data Collector, Performance Analysis, powershell script for SCOM, powershell script
permalink: /blog/scom-data-collector/
---
## Download Link
[https://aka.ms/SCOM-DataCollector](https://aka.ms/SCOM-DataCollector)

[![Download Count Latest](https://img.shields.io/github/downloads/blakedrumm/SCOM-Scripts-and-SQL/latest/SCOM-DataCollector.zip?style=for-the-badge&color=brightgreen)](https://aka.ms/SCOM-DataCollector){:class="img-fluid"} \
[![Download Count Releases](https://img.shields.io/github/downloads/blakedrumm/SCOM-Scripts-and-SQL/total.svg?style=for-the-badge&color=brightgreen)](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/releases){:class="img-fluid"}

## Personal Webpage
[https://files.blakedrumm.com/SCOM-DataCollector.zip](https://files.blakedrumm.com/SCOM-DataCollector.zip)

## Github Link
[https://github.com/blakedrumm/SCOM-Scripts-and-SQL/releases/latest](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/releases/latest)

## Requirements
System Center Operations Manager - Management Server

Administrator Privileges

Powershell 4+ (will still run on Powershell 3)

## Instructions

[Download zip file](https://aka.ms/SCOM-DataCollector) and extract zip file to a directory (ex. C:\Data Collector). Open an Powershell shell __as Adminstrator__ and change to the directory the SCOM Data Collector Powershell Script is located, such as: \
`cd C:\Data Collector`

 >## Note
 >You have the ability to run this script as any user you would like when you start the script without any switches. The default is the System Center Data Access Service account.

Run this script on a Operations Manager Management Server to gather their SQL server names and DB names from the local registry. Otherwise user will need to manually input names. It will attempt to query the SQL Server Instance remotely, and will create CSV output files in the Output folder located in the SCOM Data Collector script directory.The SCOM Data Collector has the ability to query multiple databases in the SCOM SQL Instance (_master, OperationsManager, OperationsManagerDW_), having a high level of rights to SQL is preferred for a full gather.

After the script has completed you will see that the Output folder that is temporary created during script execution is removed. A zip file will be created in the same directory as the SCOM Data Collector Powershell Script named something similar to this: \
`SDC_Results_04_04_1975.zip`

This script has the ability to gather the following information:

 - Event Logs – Application, System, OperationsManager
 - SCOM Version Installed
 - Update Rollup Information for SCOM Upgrades
 - SQL Queries that collect information about many aspects of your environment (too many queries to go into detail here, here are some of the queries it uses: https://github.com/blakedrumm/SCOM-Scripts-and-SQL/tree/master/SQL%20Queries)
 - Windows Updates installed on Management Servers / SQL Server
 - Service Principal Name (SPN) Information for SCOM Management Servers
 - Local Administrators Group on each Management Server
 - Local User Account Rights on each Management Server
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
 - Best Practice Analyzer to verify you are following SCOM Best Practices
 - Gathers Group Policy settings on each Management Server and SQL Server
 - Gathers installed Software on each Management Server
 - Management Group Overall Health and verify Configuration matches across Management Servers in Management Group
 - Check SCOM Certificates for Validity / Usability
 - SCOM Install / Update Logs
 - IP Address of each Management Server
 - this list is not complete..

----

## Examples

##### Note: If you know you have Query rights against the DB(s) run any Switch (-Command) with -AssumeYes
 

### Available Switches
Every Switch Available:

    .\DataCollector.ps1 -Servers -GetRunasAccounts -GetEventLogs -CheckCertificates -CheckTLS -ExportMPs -GPResult -MSInfo32 -SQLLogs -SQLOnly -CaseNumber -AssumeYes -GenerateHTML -All -PingAll


### Built in menu

To see the built in menu, run the script with no arguments or switches:

    .\DataCollector.ps1

You can also right click the `.ps1` file and Run with Powershell.



### Certificates

To Check the Certificate(s) Installed on the Management Server(s) in the Management Group, and an Server:

    .\DataCollector.ps1 -CheckCertificates -Servers AppServer1.contoso.com

To Check the Certificate(s) Installed on the Management Server(s) in the Management Group:

    .\DataCollector.ps1 -CheckCertificates


### Gather only SQL Queries

To gather only the SQL Queries run the following:

    .\DataCollector.ps1 -SQLOnly

If you know the account running the Data Collector has permissions against the SCOM Databases, run this:

    .\DataCollector.ps1 -SQLOnly -Yes




### Event Logs

To gather Event Logs from 3 Agents and the Management Server(s) in the Current Management Group:

    .\DataCollector.ps1 -GetEventLogs -Servers Agent1.contoso.com, Agent2.contoso.com, Agent3.contoso.com

To just gather the Event Logs from the Management Server(s) in the Management Group:

    .\DataCollector.ps1 -GetEventLogs





### Management Packs

To Export Installed Management Packs:

    .\DataCollector.ps1 -ExportMPs





### RunAs Accounts

To Export RunAs Accounts from the Management Server:

    .\DataCollector.ps1 -GetRunAsAccounts





### Check TLS 1.2 Readiness

To Run the TLS 1.2 Hardening Readiness Checks on every Management Server and SQL SCOM DB Server(s) in the Management Group:

    .\DataCollector.ps1 -CheckTLS





### All Switches
This will allow you to run every switch available currently, this supports the -Servers Switch:

    .\DataCollector.ps1 -All
    .\DataCollector.ps1 -All -Servers Agent1
    .\DataCollector.ps1 -All -Yes

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
-->
