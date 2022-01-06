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
[Add-UserRights.ps1](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/blob/master/Powershell/Add-UserRights.ps1)

 I stumbled across this ([weloytty/Grant-LogonAsService.ps1](https://github.com/weloytty/QuirkyPSFunctions/blob/ab4b02f9cc05505eee97d2f744f4c9c798143af1/Source/Users/Grant-LogOnAsService.ps1)) gem that allows you to grant Logon as a Service Right for a User. I modified the script you can now run the Powershell script against multiple machines, users, and user rights.
 
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

# Check User Rights
[Get-LocalUserAccountsRights.ps1](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/blob/master/Powershell/Get-LocalUserAccountsRights.ps1)

In order to check the Local User Rights, you will need to run the above (Get-LocalUserAccountsRights), you may copy and paste the above script in your Powershell ISE and press play.

![LocalUserAccountsRights](/assets/img/posts/server-userlogonrights.png)

You may edit line [207](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/blob/55f03da164976c2138b27b16df9dba2c94e54667/Powershell/Get-LocalUserAccountsRights.ps1#L207) in the script in order to set a folder where a CSV will output (you can open CSV in Excel).

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/add-and-check-user-rights/)

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.
-->
