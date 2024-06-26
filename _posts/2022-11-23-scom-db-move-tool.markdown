---
layout: post
date:   '2022-11-23 18:21:42 -0500'
title: "Reconfigure System Center Operations Manager for Database Move Tool"
categories: powershell projects operationsManager troubleshooting
author: blakedrumm
thumbnail: /assets/img/scom-db-move-tool.png
toc: true

summary: >- # this means to ignore newlines
  This application is designed to allow users to update the configuration when migrating the SCOM SQL Instances to a new location. (This tool does not move the databases, i.e. Backup / Restore). Free and open-source GUI tool written in PowerShell, with multiple ways of running the script: MSI, EXE, or source PS1.

keywords: scom db move, opsmgr db tool, scom db tool, operations manager tool, powershell script for SCOM, powershell script, scom db moving tool, system center
permalink: /blog/scom-db-move-tool/
---

## :book: Introduction

Welcome to the official page for the Reconfigure System Center Operations Manager for Database Move Tool. This tool is compatible with all versions of Operations Manager and is designed to help you manage SQL connections used by Operations Manager.

This script automates the steps outlined here: [https://learn.microsoft.com/system-center/scom/manage-move-opsdb](https://learn.microsoft.com/system-center/scom/manage-move-opsdb)

>#### :spiral_notepad: Note
> The script does not edit the Reporting Services **Data Warehouse Data Source** -> ***Connection String*** \
> (shown here (change to https if you are using SSL Certificates): `http://<reportingServerURL>/Reports/manage/catalogitem/properties/Data%20Warehouse%20Main`) \
> &nbsp;
> You will need to update the Connection String value to the correct data, here is an example of mine:
> ```
> data source=SQL01-2022;initial catalog=OperationsManagerDW;Integrated Security=SSPI
> ```
> ![SQL Server Reporting Services Data Source Example](/assets/img/posts/sql-server-reporting-services-data-source-example.png){:class="img-fluid"}

### Features
- Update / Verify the System Center Operations Manager SQL
  - SQL Instance Configuration for CLR and SQL Service Broker.
  - Database Tables for data related to SQL Connections in SCOM.
- Update / Verify the Registry data
  - Local SCOM Management Servers.
  - Remote SCOM Management Servers.
- Update / Verify the Configuration File
  - Local SCOM Management Servers.
  - Remote SCOM Management Servers.
- Language Changer combo-box which adds automatic support for 8 Languages:
  - English
  - Spanish (Español)
  - Arabic (عربي)
  - Turkish (Türkçe)
  - Chinese (中国人)
  - Portuguese (Português)
  - French (Français)
  - German (Deutsch)
  #### A HUGE THANK YOU to the following individuals for assisting with translation in the different languages:
  - Rafael Lujan (Spanish)
  - Fayez Al Saadi (Arabic)
  - Murat Coskun (Turkish)
  - Wendi Cai (Chinese)
  - Wagner da Costa Carvalho (Portuguese)
  - Joana da Rocha Carvalho (French)
  - Stefan Wuchenauer (German)

### Requirements
- System Center Operations Manager installation
- Powershell 5

## :arrow_down_small: Latest Version
[![Latest Version](https://img.shields.io/github/v/release/blakedrumm/SCOM-Reconfigure-DB-Move-Tool)](https://github.com/blakedrumm/SCOM-Reconfigure-DB-Move-Tool/releases/latest){:class="img-shields-io"} \
[![Download Count Releases](https://img.shields.io/github/downloads/blakedrumm/SCOM-Reconfigure-DB-Move-Tool/total.svg?style=for-the-badge&color=brightgreen)](https://github.com/blakedrumm/SCOM-Reconfigure-DB-Move-Tool/releases){:class="img-shields-io"} \
[![Download Count Latest](https://img.shields.io/github/downloads/blakedrumm/SCOM-Reconfigure-DB-Move-Tool/latest/SCOM-Reconfigure-DB-Move-Tool-EXE.zip?style=for-the-badge&color=brightgreen)](https://aka.ms/SCOM-DB-Move-Tool){:class="img-shields-io"}

Check the changelog for the latest version: [Latest Changes](https://github.com/blakedrumm/SCOM-Reconfigure-DB-Move-Tool/releases/latest)

## :page_with_curl: How to Use

<a href="https://github.com/blakedrumm/SCOM-Reconfigure-DB-Move-Tool/releases/latest/download/SCOM-Reconfigure-DB-Move-Tool-EXE.zip" target="_"><button class="btn btn-primary navbar-btn">Get Started</button></a>

[https://aka.ms/SCOM-DB-Move-Tool](https://aka.ms/SCOM-DB-Move-Tool)

You have multiple ways to download the SCOM Reconfigure DB Move GUI Tool:
1. Download and install the MSI: [MSI Download](https://github.com/blakedrumm/SCOM-Reconfigure-DB-Move-Tool/releases/latest/download/SCOM-Reconfigure-DB-Move-Tool-MSI.zip)
2. Download and run the EXE: [EXE Downloads](https://github.com/blakedrumm/SCOM-Reconfigure-DB-Move-Tool/releases/latest/download/SCOM-Reconfigure-DB-Move-Tool-EXE.zip)
3. Download or Copy the Powershell Script to Powershell ISE: [Powershell Script](https://github.com/blakedrumm/SCOM-Reconfigure-DB-Move-Tool/releases/latest/download/SCOM-Reconfigure-DB-Move-Tool.ps1)
4. Download or Copy the Powershell Script to Powershell ISE: [Text Format Alternative Download Link](https://files.blakedrumm.com/SCOM-ReconfigureDatabaseLocations.txt)

The script by default will attempt to gather the current database connection from the local registry. If it is unable to locate the registry keys the Database Connection box will be empty. If it is empty you will need to manually type the values in here. The Values to Set section is required for the script to run and you will need to manually populate these fields. The Management Servers section is also required for you to be able to set which Management Servers to update the Database information on.

This script will log actions to the Application Event Log. Look for the Event Source: `SCOMDBMoveTool`

## :page_facing_up: More Information

You will get prompted each time you run the script to accept the license agreement, unless you select do not ask me again, when you select this it will save a file to your ProgramData Directory:
```
C:\ProgramData\SCOM-DBMoveTool-AgreedToLicense.log
```

Attribution for the icon:
<a href="https://www.flaticon.com/free-icons/database" title="database icons">Database icons created by manshagraphics - Flaticon</a>

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/scom-db-move-tool/)

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
