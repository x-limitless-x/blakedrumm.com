---
layout: post
title:  "Add and Check User Rights via Powershell"
date:   2022-01-05 23:41:26 -0500
categories: powershell
title: Add and Check User Rights via Powershell
author: blakedrumm
thumbnail: /assets/img/posts/add-user-rights.png
description: >- # this means to ignore newlines
  You can check or add User Rights with the following scripts.

permalink: /blog/add-and-check-user-rights/
---

# Add User Rights
[https://github.com/blakedrumm/SCOM-Scripts-and-SQL/blob/master/Powershell/Add-UserRights.ps1](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/blob/master/Powershell/Add-UserRights.ps1)

# Check User Rights
[https://github.com/blakedrumm/SCOM-Scripts-and-SQL/blob/master/Powershell/Get-LocalUserAccountsRights.ps1](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/blob/master/Powershell/Get-LocalUserAccountsRights.ps1)

 I stumbled across this ([https://github.com/weloytty/QuirkyPSFunctions/blob/ab4b02f9cc05505eee97d2f744f4c9c798143af1/Source/Users/Grant-LogOnAsService.ps1](https://github.com/weloytty/QuirkyPSFunctions/blob/ab4b02f9cc05505eee97d2f744f4c9c798143af1/Source/Users/Grant-LogOnAsService.ps1)) gem that allows you to add Logon as a Service Right to a User. I modified the script and allowed for any type of Service to be modified, you can also run the Powershell script against multiple machines, users, and user rights.
 
Here are a few examples:
## Single Users
Add User Right "Log on as a service" to CONTOSO\User:
```powershell
.\Add-UserRights.ps1 -Username CONTOSO\User -UserRight SeServiceLogonRight
```

Add User Right "Log on as a batch job" to CONTOSO\User:
```powershell
.\Add-UserRights.ps1 -Username CONTOSO\User -UserRight SeBatchLogonRight
```

Add User Right "Allow log on locally" to current user:
```powershell
.\Add-UserRights.ps1 -UserRight SeInteractiveLogonRight
```

## Multiple Users / Services / Computers
Add User Right "Log on as a service" and "Log on as a batch job" to CONTOSO\User and run on, local machine and SQL.contoso.com:
```powershell
.\Add-UserRights.ps1 -UserRight SeServiceLogonRight, SeBatchLogonRight -ComputerName $env:COMPUTERNAME, SQL.contoso.com -UserName CONTOSO\User1, CONTOSO\User2
```
	
You can also modify line 203 in the script to change what happens when the script is run without any arguments or parameters.

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/add-and-check-user-rights/)

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.
-->
