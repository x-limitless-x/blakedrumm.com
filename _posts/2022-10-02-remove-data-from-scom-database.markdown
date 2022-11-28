---
layout: post
title:  "Remove Data from the SCOM Database Instantly - The Powershell Way!"
date:   '2022-10-02 13:52:41 -0500'
categories: powershell operationsManager troubleshooting projects
author: blakedrumm
thumbnail: /assets/img/posts/remove-scombasemanagedentity.png
toc: true

summary: >- # this means to ignore newlines
  Sometimes you need to remove data from the SCOM Database that relates to a specific server or client. If you need it done quickly, without having to open SQL Server Management Studio, or run queries manually; you can instead use this Powershell script.

keywords: remove scom data permanently, remove scom agent from database, purge scom agent, purge agent from scom, purge agent, purge operations manager agent
permalink: /blog/remove-data-from-scom-database/
---

## :book: Introduction
I have had many cases where I've had to run the following SQL Queries by Kevin Holman: [Deleting and Purging data from the SCOM Database (kevinholman.com)](https://kevinholman.com/2018/05/03/deleting-and-purging-data-from-the-scom-database/) ***(A big thank you to Kevin Holman for his guide!)***

After the 6th or 7th time running the tsql queries I decided that I should automate this process in Powershell, and make it very easy to do this automatically for as many servers as needed. This script will query the Operations Manager database and run all the steps in Kevin Holman's queries. The script will ask questions at each step to verify the action is correct. You have to answer **Y** or **N** before the script will proceed.

> ### :exclamation: Important!
> It is recommended to only run the script when requested by a Microsoft Support Engineer. **This script can be dangerous if used incorrectly.** \
> &nbsp; \
> If you absolutely need to run the script, make sure you have full backups of your SCOM SQL Instances / Databases!

## How to get it
You can get a copy of the script here: \
[Remove-SCOMBaseManagedEntity.ps1](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/blob/master/Powershell/Quick%20Fixes/Remove-SCOMBaseManagedEntity.ps1) :arrow_left: **Direct Download Link** \
_or_ \
[Personal File Server - Remove-SCOMBaseManagedEntity.ps1](https://files.blakedrumm.com/Remove-SCOMBaseManagedEntity.ps1) :arrow_left: **Alternative Download Link** \
_or_ \
[Personal File Server - Remove-SCOMBaseManagedEntity.txt](https://files.blakedrumm.com/Remove-SCOMBaseManagedEntity.txt) :arrow_left: **Text Format Alternative Download Link**

> ## :notebook: Note
> You may edit line [752](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/blob/master/Powershell/Quick%20Fixes/Remove-SCOMBaseManagedEntity.ps1#L752) in the script to change what happens when the script is run without any arguments or parameters, this also allows you to change what happens when the script is run from the Powershell ISE.

&nbsp;

## Argument List

 Parameter       | Alias | ValueFromPipeline | Type   | Description                                                                                                                                                                |
------------------|-------|-------------------|--------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
 AssumeYes        | yes   |                   | Switch | Optionally assume yes to any question asked by this script.                                                                                                                |
 Database         |       |                   | String | The name of the OperationsManager Database for SCOM.                                                                                                                       |
 DontStop         | ds    |                   | Switch | Optionally force the script to not stop when an error occurs connecting to the Management Server.                                                                          |
 Id               |       |                   | Array  | You may provide any Base Managed Entity Id's to be deleted specifically from the Operations Manager Database.                                                              |
 ManagementServer | ms    |                   | String | SCOM Management Server that we will remotely connect to. If running on a Management Server, there is no need to provide this parameter.                                    |
 Name             |       |                   | Array  | The Base Managed Entity Display Name of the object you are wanting to delete from the Operations Manager Database.                                                         |
 Servers          |       | True              | Array  | Each Server (comma separated) you want to Remove related BME ID's related to the Display Name in the OperationsManager Database. This will also remove from Agent Managed. |
 SqlServer        |       |                   | String | SQL Server/Instance, Port that hosts OperationsManager Database for SCOM.                                                                                                  |
{: .table .table-hover .table-text .d-block .overflow-auto }


## :page_with_curl: How to use it
>#### Example 1
>Remove SCOM BME Related Data from the OperationsManager DB, for Agent1 in the Management Group:
>```powershell
>Get-SCOMAgent -Name Agent1.contoso.com | %{.\Remove-SCOMBaseManagedEntity.ps1 -Servers $_}
>```
>#### Example 2
>Remove SCOM BME Related Data for 2 Agent machines:
>```powershell
>.\Remove-SCOMBaseManagedEntity.ps1 -Servers IIS-Server.contoso.com, WindowsServer.contoso.com
>```
>#### Example 3
>Remove SCOM BME IDs from the Operations Manager Database:
>```powershell
>.\Remove-SCOMBaseManagedEntity -Id C1E9B41B-0A35-C069-16EB-00AC43BB9C47, CB29ECDE-BCE8-2213-D5DD-0353116EDA6B
>```

Leave some feedback if this helped you! :v:

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/remove-data-from-scom-database/)

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.

Tip:
To add auto-size pictures:
![/assets/img/posts/example.jpg](/assets/img/posts/example.jpg){:class="img-fluid"}
-->
