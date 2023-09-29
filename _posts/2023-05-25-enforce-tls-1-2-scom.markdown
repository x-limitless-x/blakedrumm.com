---
layout: post
title:  "Enforce TLS 1.2 in SCOM - The PowerShell Way!"
date:   '2023-05-25 17:08:51 -0500'
categories: powershell operationsManager troubleshooting projects security
author: blakedrumm
thumbnail: /assets/img/posts/enforce-tls-1-2-scom.png
toc: true

summary: >- # this means to ignore newlines
  This article shows you how to enforce TLS 1.2 in SCOM with a simple PowerShell script.

keywords: scom tls 1.2, scom tls enforcement, opsmgr tls 1.2, om tls 1.2, scom security hardening, scom security
permalink: /blog/enforce-tls-1-2-scom/
---

## :book: Introduction
This PowerShell script will allow you to enforce TLS 1.2 in your SCOM Environment to help you to secure your environment. (A big thank you to Kevin Holman for the original creation of his [TLS 1.2 enforcement script](https://kevinholman.com/2018/05/06/implementing-tls-1-2-enforcement-with-scom/), which this script originated from.) It will attempt to auto download the prerequisites if they are not present in the local directory (or if you set the parameter **DirectoryForPrerequisites** to another path it will check there). The script from a high level will do the following:
1. Creates a log file to Program Data (`C:\ProgramData\SCOM_TLS_1.2_-_<Month>-<Day>-<Year>.log`).
2. Locate or Download the prerequisites for TLS 1.2 Enforcement.
3. Checks the SCOM Role (*Management Server, Web Console, ACS Collector*).
4. Checks the version of System Center Operations Manager to confirm supportability of TLS enforcement.
5. Checks the .NET version to confirm you are on a valid version.
6. Checks the SQL version (on both the Operations Manager and Data Warehouse Database Instances) to confirm your version of SQL supports TLS enforcement.
7. Checks and/or installs the *(prerequisite software)* MSOLEDB driver (or SQL Client).
8. Checks and/or installs the *(prerequisite software)* ODBC driver.
9. Checks and/or modifies the registry to enforce TLS 1.2 (If your using Window Server 2022 (or newer) or Windows 11 (or newer) it will attempt to enforce TLS 1.2 **and** TLS 1.3).
10. Ask to reboot the machine to finalize the configuration.

## :classical_building: Argument List

| Parameter                    | Alias | ValueFromPipeline | Type   | Description                                                                               |
|------------------------------|-------|-------------------|--------|-------------------------------------------------------------------------------------------|
| AssumeYes                    | yes   |                   | Switch | The script will not ask any questions. Good for unattended runs.                          |
| DirectoryForPrerequisites    | dfp   |                   | String | The directory to save / load the prerequisites from. Default is the current directory.    |
| ForceDownloadPrerequisites   | fdp   |                   | Switch | Force download the prerequisites to the directory specified in DirectoryForPrerequisites. |
| SkipDotNetCheck              | sdnc  |                   | Switch | Skip the .NET Check step.                                                                 |
| SkipDownloadPrerequisites    | sdp   |                   | Switch | Skip downloading the prerequisite files to current directory.                             |
| SkipModifyRegistry           | smr   |                   | String | Skip any registry modifications.                                                          |
| SkipRoleCheck                | src   |                   | Switch | Skip the SCOM Role Check step.                                                            |
| SkipSQLQueries               | ssq   |                   | Switch | Skip any check for SQL version compatibility.                                             |
| SkipSQLSoftwarePrerequisites | sssp  |                   | Switch | Skip the ODBC, MSOLEDBSQL, and/or Microsoft SQL Server 2012 Native Client.                |
| SkipVersionCheck             | svc   |                   | Switch | Skip SCOM Version Check step.                                                             |
{: .table .table-hover .table-text .d-block .overflow-auto }

> ## :notebook: Note
> You may edit line [1909](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/blob/master/Powershell/TLS%201.2%20Enforcement/Invoke-EnforceSCOMTLS1.2.ps1#L1909) in the script to change what happens when the script is run without any arguments or parameters, this also allows you to change what happens when the script is run from the Powershell ISE.

## How to get it
You can get a copy of the script here: \
[Invoke-EnforceSCOMTLS1.2.ps1](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/blob/master/Powershell/TLS%201.2%20Enforcement/Invoke-EnforceSCOMTLS1.2.ps1) :arrow_left: **Direct Download Link** \
_or_ \
[Personal File Server - Invoke-EnforceSCOMTLS1.2.ps1](https://files.blakedrumm.com/Invoke-EnforceSCOMTLS1.2.ps1) :arrow_left: **Alternative Download Link** \
_or_ \
[Personal File Server - Invoke-EnforceSCOMTLS1.2.txt](https://files.blakedrumm.com/Invoke-EnforceSCOMTLS1.2.txt) :arrow_left: **Text Format Alternative Download Link**

## :page_with_curl: How to use it
>#### Example 1
>Normal run:
>```powershell
>.\Invoke-EnforceSCOMTLS1.2.ps1
>```
>#### Example 2
>Set the prerequisites folder:
>```powershell
>.\Invoke-EnforceSCOMTLS1.2.ps1 -DirectoryForPrerequisites "C:\Temp"
>```
>#### Example 3
>Assume yes to all questions asked by script:
>```powershell
>.\Invoke-EnforceSCOMTLS1.2.ps1 -AssumeYes
>```

## Check TLS Configuration
You can run the following PowerShell script to gather your current TLS configuration: \
[https://github.com/blakedrumm/SCOM-Scripts-and-SQL/blob/master/Powershell/Get-TLSRegistryKeys.ps1](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/blob/master/Powershell/Get-TLSRegistryKeys.ps1)

---

Leave some feedback if this helped you! :v:

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/enforce-tls-1-2-scom/)

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.

Tip:
To add auto-size pictures:
![/assets/img/posts/example.jpg](/assets/img/posts/example.jpg){:class="img-fluid"}
-->
