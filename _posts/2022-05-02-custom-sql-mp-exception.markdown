---
layout: post
date:   '2022-05-02 14:28:58 -0500'
title: "Custom SQL Management Pack Invoke-SqlCmd Exception"
categories: troubleshooting guides operationsManager
author: blakedrumm
thumbnail: /assets/img/posts/invoke-sqlcmd.png

summary: >- # this means to ignore newlines
  I was working on a case regarding Invoke-SqlCmd powershell command that is unable to return data for all SQL Servers.
  The exception we were experiencing was found to be a: ManagedBatchParser.ParserException

keywords: scom, operationsmanager, SCOM 2019, Invoke-SqlCmd
permalink: /blog/custom-sql-mp-exception/
---
## Introduction
The customer noticed the issue was occurring inside of one of their custom Management Packs (MP) for SCOM SQL Blocking monitoring. They deployed this custom MP to two SCOM Management Groups. The Agents where we were seeing the issue were dual (multi) homed SCOM Agents that were SQL Servers (due to the way the MP was designed).

## Script Section
The command inside of the custom Management Pack was `Invoke-SqlCmd`, which is apart of the built in [SQL Powershell Cmdlets](https://docs.microsoft.com/en-us/sql/powershell/sql-server-powershell?view=sql-server-ver15):

```powershell
...
$conn = "MSSQL-2019"
$ScriptName = "Custom.SQLBlocking.Timed.Monitor.DataSource.ps1"
[int]$WaitTimeMS = $WaitTime * 1000
$blocked_session = $null
$sql1 = "use master
                  SELECT r.session_id,
                  r.blocking_session_id,
                  s.login_name,
                  s.login_time,
                  s.program_name,
                  s.host_name,
                  s.memory_usage as Memory,
                  DB_NAME(r.database_id) AS DatabaseName,
                  r.wait_time,
                  r.command,
                  r.status,
                  r.cpu_time,
                  t.text as Query_Text
                  FROM sys.dm_exec_requests r
                  CROSS APPLY sys.dm_exec_sql_text(sql_handle) t
                  INNER JOIN sys.dm_exec_sessions s ON r.session_id = s.session_id
                  WHERE r.blocking_session_id <> 0 and wait_time > $WaitTimeMS"
          
$error.Clear
Try {
$blocked_session = Invoke-Sqlcmd -Query $sql1  -ServerInstance $conn
}
Catch {$momapi.LogScriptEvent($ScriptName, 9994, 0, $error)}
...
```

`Invoke-SqlCmd` in the above context should be able to successfully run with Local System (or a User Account) as the Action Account.

## Catching the error
We noticed the following error after the script above ran as a part of the Management Pack:

```
Custom.SQLBlocking.Timed.Monitor.DataSource.ps1 : ManagedBatchParser.ParserException
    at ManagedBatchParser.Parser.Parse()
    at Microsoft.SqlServer.Management.PowerShell.ExecutionProcessor.ExecuteTSql(String sqlCommand)
```

## Resolution
You will need to set the time intervals between the rules / monitors to run at a different interval than the other Management Group that is reporting to this same Agent / Group to cause it to be multi-homed.

**OR**

You can remove the other Management Group and allow only 1 Management Server in the Agent Management control panel.

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/custom-sql-mp-exception/)

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
