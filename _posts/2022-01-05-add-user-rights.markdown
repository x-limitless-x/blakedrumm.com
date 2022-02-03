---
layout: post
title:  "Add and Check User Rights Assignment via Powershell"
date:   '2022-01-05 23:41:26 -0500'
categories: powershell operationsManager
author: blakedrumm
thumbnail: /assets/img/posts/add-user-rights.png
image: {{ post.thumbnail }}
summary: You can check or add User Rights Assignment (Remotely or Locally) with the following Powershell scripts.

description: {{ post.summary }}

keywords: user rights assignment, powershell script, local security policy, secpol.msc, assign user rights via powershell, change user rights via powershell, add logon locally, powershell local security policy, logon as batch powershell, local user account rights
permalink: /blog/add-and-check-user-rights-assignment/
url: {{site.url}}{{site.baseurl}}{{ post.permalink }}
---
<sub>Article last updated on January 10th, 2022</sub>

 I stumbled across this gem ([weloytty/Grant-LogonAsService.ps1](https://github.com/weloytty/QuirkyPSFunctions/blob/master/Source/Users/Grant-LogOnAsService.ps1)) that allows you to grant Logon as a Service Right for a User. I modified the script you can now run the Powershell script against multiple machines, users, and user rights.
 
# Add User Rights
[Add-UserRights.ps1](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/blob/master/Powershell/General%20Functions/Add-UserRights.ps1)

```
"Log on as a batch job (SeBatchLogonRight)"
"Allow log on locally (SeInteractiveLogonRight)"
"Access this computer from the network (SeNetworkLogonRight)"
"Allow log on through Remote Desktop Services (SeRemoteInteractiveLogonRight)"
"Log on as a service (SeServiceLogonRight)"
"Deny log on as a batch job (SeDenyBatchLogonRight)"
"Deny log on locally (SeDenyInteractiveLogonRight)"
"Deny access to this computer from the network (SeDenyNetworkLogonRight)"
"Deny log on through Remote Desktop Services (SeDenyRemoteInteractiveLogonRight)"
"Deny log on as a service (SeDenyServiceLogonRight)"
```

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
	
You can also modify line [290](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/blob/master/Powershell/General%20Functions/Add-UserRights.ps1#L290) in the script to change what happens when the script is run without any arguments or parameters, this also allows you to change what happens when the script is run from the Powershell ISE.

# Check User Rights
[Get-UserRights.ps1](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/blob/master/Powershell/General%20Functions/Get-UserRights.ps1)

In order to check the Local User Rights, you will need to run the above (Get-UserRights), you may copy and paste the above script in your Powershell ISE and press play.

![UserAccountsRights](/assets/img/posts/get-user-right.png){:class="img-fluid"}

You may edit line [485](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/blob/master/Powershell/General%20Functions/Get-UserRights.ps1#L485) in the script to change what happens when the script is run without any arguments or parameters, this also allows you to change what happens when the script is run from the Powershell ISE.

Here are a few examples:
## Local Computer
Get Local User Account Rights and output to text in console:
```powershell
.\Get-UserRights.ps1
```

## Remote Computer
Get Remote SQL Server User Account Rights:
```powershell
.\Get-UserRights.ps1 -ComputerName SQL.contoso.com
```

Get Local Machine and SQL Server User Account Rights:
```powershell
.\Get-UserRights.ps1 -ComputerName $env:COMPUTERNAME, SQL.contoso.com
```

## Output Types
Output Local User Rights on Local Machine as CSV in 'C:\Temp':
```powershell
.\Get-UserRights.ps1 -FileOutputPath C:\Temp -FileOutputType CSV
```

Output to Text in 'C:\Temp':
```powershell
.\Get-UserRights.ps1 -FileOutputPath C:\Temp -FileOutputType Text
# or
.\Get-UserRights.ps1 -FileOutputPath C:\Temp
```

PassThru object to allow manipulation / filtering:
```powershell
.\Get-UserRights.ps1 -ComputerName SQL.contoso.com -PassThru | Where {$_.Principal -match "Administrator"}
# or
.\Get-UserRights.ps1 -PassThru | ? {$_.Privilege -match 'SeServiceLogonRight'}
```

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com{{ post.permalink }})

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.
-->
