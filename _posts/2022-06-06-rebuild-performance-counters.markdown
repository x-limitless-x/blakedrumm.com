---
layout: post
date:   '2022-06-06 9:21:21 -0500'
title: "Rebuild Performance Counters"
categories: operationsManager
author: blakedrumm
thumbnail: /assets/img/scom-dw-grooming-tool.png

summary: >- # this means to ignore newlines
  This article shows you how to rebuild your Performance Counters.

keywords: rebuild scom perf counters, scom perf counters, opsmgr perf counters, operations manager
permalink: /blog/rebuild-perf-counters/
---
## Introduction
The following event id prompted me to write this article.

```
Log Name:      Operations Manager
Source:        Health Service Modules
Date:          5/16/2022 2:47:00 PM
Event ID:      10103
Task Category: None
Level:         Warning
Keywords:      Classic
User:          N/A
Computer:      <ManagementServerFQDN>
Description:
In PerfDataSource, could not resolve counter instance OpsMgr DW Writer Module, Dropped Data Item Count, All Instances. Module will not be unloaded. 

One or more workflows were affected by this.  

Workflow name: Microsoft.SystemCenter.DataWarehouse.CollectionRule.Performance.Writer.DroppedDataItemCount 
Instance name: <ManagementServerFQDN> 
Instance ID: {3Z4DF6FB-B78C-33D9-BE0F-C84F7278AB92} 
Management group: <ManagementGroupName>
```

The above tells me, for some reason SCOM is no longer able to resolve some Performance Counter names on the Management Server, which causes some of the workflows for the SCOM Data Warehouse to fail.

## How to Resolve
Rebuild the Performance counters with the following Powershell Script, you can copy and paste the below script to a Powershell ISE Window running as **Administrator**:
```powershell
Push-Location $PWD
$FirstPath = 'C:\Windows\System32'
$SecondPath = 'C:\Windows\SysWOW64'
cd $FirstPath
Write-Output '---------------------------------------------------------'
Write-Output "Recreating Performance Counters in: $FirstPath"
Write-Output ' - Running: lodctr /R'
lodctr /R
cd $SecondPath
Write-Output "`nRecreating Performance Counters in: $SecondPath"
Write-Output ' - Running: lodctr /R'
lodctr /R
Write-Output '---------------------------------------------------------'
Write-Output 'Resyncing the Performance Counters with Windows Management Instrumentation (WMI)'
Write-Output ' - Running: C:\Windows\System32\wbem\WinMgmt.exe /RESYNCPERF'
C:\Windows\System32\wbem\WinMgmt.exe /RESYNCPERF
Write-Output '---------------------------------------------------------'
Write-Output 'Restarting Service: Performance Logs & Alerts (pla)'
$error.Clear()
try
{
	Get-Service -Name "pla" | Restart-Service -ErrorAction Stop | Out-Null
}
catch
{
	Write-Warning "A Failure has occurred: `n$error"
}
$error.Clear()
Write-Output 'Restarting Service: Windows Management Instrumentation (winmgmt)'
try
{
	Get-Service -Name "winmgmt" | Restart-Service -Force -ErrorAction Stop | Out-Null
}
catch
{
	Write-Warning "A Failure has occurred: `n$error"
}
Pop-Location
```

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/rebuild-perf-counters/)

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
