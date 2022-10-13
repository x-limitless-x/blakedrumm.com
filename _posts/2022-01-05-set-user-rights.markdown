---
layout: post
title:  "Set and Check User Rights Assignment via Powershell"
date:   '2022-01-05 23:41:26 -0500'
categories: powershell operationsManager troubleshooting projects 
author: blakedrumm
thumbnail: /assets/img/posts/set-user-rights.png

summary: You can add, remove, and check User Rights Assignment (remotely / locally) with the following Powershell scripts.

keywords: user rights assignment, powershell script, local security policy, secpol.msc, assign user rights via powershell, change user rights via powershell, add logon locally, powershell local security policy, logon as batch powershell, local user account rights
permalink: /blog/set-and-check-user-rights-assignment/
---
<sub>This post was last updated on August 29th, 2022</sub>

 I stumbled across this gem ([weloytty/Grant-LogonAsService.ps1](https://github.com/weloytty/QuirkyPSFunctions/blob/master/Source/Users/Grant-LogOnAsService.ps1)) that allows you to grant Logon as a Service Right for a User. I modified the script you can now run the Powershell script against multiple machines, users, and user rights.
 
## Set User Rights
### How to get it
[Set-UserRights.ps1](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/blob/master/Powershell/General%20Functions/Set-UserRights.ps1) :arrow_left: **Direct Download Link** \
_or_ \
[Personal File Server - Set-UserRights.ps1](https://files.blakedrumm.com/Set-UserRights.ps1) :arrow_left: **Alternative Download Link** \
_or_ \
[Personal File Server - Set-UserRights.txt](https://files.blakedrumm.com/Set-UserRights.txt) :arrow_left: **Text Format Alternative Download Link**

All of the User Rights that can be set:

Privilege                                 | PrivilegeName                                                      |
-------------------------------------------|--------------------------------------------------------------------|
SeAssignPrimaryTokenPrivilege             | Replace a process level token                                      |
SeAuditPrivilege                          | Generate security audits                                           |
SeBackupPrivilege                         | Back up files and directories                                      |
SeBatchLogonRight                         | Log on as a batch job                                              |
SeChangeNotifyPrivilege                   | Bypass traverse checking                                           |
SeCreateGlobalPrivilege                   | Create global objects                                              |
SeCreatePagefilePrivilege                 | Create a pagefile                                                  |
SeCreatePermanentPrivilege                | Create permanent shared objects                                    |
SeCreateSymbolicLinkPrivilege             | Create symbolic links                                              |
SeCreateTokenPrivilege                    | Create a token object                                              |
SeDebugPrivilege                          | Debug programs                                                     |
SeDelegateSessionUserImpersonatePrivilege | Obtain an impersonation token for another user in the same session |
SeDenyBatchLogonRight                     | Deny log on as a batch job                                         |
SeDenyInteractiveLogonRight               | Deny log on locally                                                |
SeDenyNetworkLogonRight                   | Deny access to this computer from the network                      |
SeDenyRemoteInteractiveLogonRight         | Deny log on through Remote Desktop Services                        |
SeDenyServiceLogonRight                   | Deny log on as a service                                           |
SeEnableDelegationPrivilege               | Enable computer and user accounts to be trusted for delegation     |
SeImpersonatePrivilege                    | Impersonate a client after authentication                          |
SeIncreaseBasePriorityPrivilege           | Increase scheduling priority                                       |
SeIncreaseQuotaPrivilege                  | Adjust memory quotas for a process                                 |
SeIncreaseWorkingSetPrivilege             | Increase a process working set                                     |
SeInteractiveLogonRight                   | Allow log on locally                                               |
SeLoadDriverPrivilege                     | Load and unload device drivers                                     |
SeLockMemoryPrivilege                     | Lock pages in memory                                               |
SeMachineAccountPrivilege                 | Add workstations to domain                                         |
SeManageVolumePrivilege                   | Perform volume maintenance tasks                                   |
SeNetworkLogonRight                       | Access this computer from the network                              |
SeProfileSingleProcessPrivilege           | Profile single process                                             |
SeRelabelPrivilege                        | Modify an object label                                             |
SeRemoteInteractiveLogonRight             | Allow log on through Remote Desktop Services                       |
SeRemoteShutdownPrivilege                 | Force shutdown from a remote system                                |
SeRestorePrivilege                        | Restore files and directories                                      |
SeSecurityPrivilege                       | Manage auditing and security log                                   |
SeServiceLogonRight                       | Log on as a service                                                |
SeShutdownPrivilege                       | Shut down the system                                               |
SeSyncAgentPrivilege                      | Synchronize directory service data                                 |
SeSystemEnvironmentPrivilege              | Modify firmware environment values                                 |
SeSystemProfilePrivilege                  | Profile system performance                                         |
SeSystemtimePrivilege                     | Change the system time                                             |
SeTakeOwnershipPrivilege                  | Take ownership of files or other objects                           |
SeTcbPrivilege                            | Act as part of the operating system                                |
SeTimeZonePrivilege                       | Change the time zone                                               |
SeTrustedCredManAccessPrivilege           | Access Credential Manager as a trusted caller                      |
SeUndockPrivilege                         | Remove computer from docking station                               |

> ## :notebook: Note
> You may edit line [399](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/blob/master/Powershell/General%20Functions/Set-UserRights.ps1#L399) in the script to change what happens when the script is run without any arguments or parameters, this also allows you to change what happens when the script is run from the Powershell ISE.

Here are a few examples:
>## Add Users
>### Single Users
>#### Example 1
>Add User Right "Allow log on locally" for current user:
>```powershell
>.\Set-UserRights.ps1 -AddRight -UserRight SeInteractiveLogonRight
>```
>#### Example 2
>Add User Right "Log on as a service" for CONTOSO\User:
>```powershell
>.\Set-UserRights.ps1 -AddRight -Username CONTOSO\User -UserRight SeServiceLogonRight
>```
>#### Example 3
>Add User Right "Log on as a batch job" for CONTOSO\User:
>```powershell
>.\Set-UserRights.ps1 -AddRight -Username CONTOSO\User -UserRight SeBatchLogonRight
>```
>#### Example 4
>Add User Right “Log on as a batch job” for user SID S-1-5-11:
>```powershell
>.\Set-UserRights.ps1 -AddRight -Username S-1-5-11 -UserRight SeBatchLogonRight
>```
>### Add Multiple Users / Rights / Computers
>#### Example 5
>Add User Right "Log on as a service" and "Log on as a batch job" for CONTOSO\User1 and CONTOSO\User2 and run on, local machine and SQL.contoso.com:
>```powershell
>.\Set-UserRights.ps1 -AddRight -UserRight SeServiceLogonRight, SeBatchLogonRight -ComputerName $env:COMPUTERNAME, SQL.contoso.com -UserName CONTOSO\User1, CONTOSO\User2
>```

&nbsp;

>## Remove Users
>### Single Users
>#### Example 1
>Remove User Right "Allow log on locally" for current user:
>```powershell
>.\Set-UserRights.ps1 -RemoveRight -UserRight SeInteractiveLogonRight
>```
>#### Example 2
>Add User Right "Log on as a service" for CONTOSO\User:
>```powershell
>.\Set-UserRights.ps1 -RemoveRight -Username CONTOSO\User -UserRight SeServiceLogonRight
>```
>#### Example 3
>Add User Right "Log on as a batch job" for CONTOSO\User:
>```powershell
>.\Set-UserRights.ps1 -RemoveRight -Username CONTOSO\User -UserRight SeBatchLogonRight
>```
>#### Example 4
>Add User Right “Log on as a batch job” for user SID S-1-5-11:
>```powershell
>.\Set-UserRights.ps1 -RemoveRight -Username S-1-5-11 -UserRight SeBatchLogonRight
>```
>### Remove Multiple Users / Rights / Computers
>#### Example 5
>Add User Right "Log on as a service" and "Log on as a batch job" for CONTOSO\User1 and CONTOSO\User2 and run on, local machine and SQL.contoso.com:
>```powershell
>.\Set-UserRights.ps1 -RemoveRight -UserRight SeServiceLogonRight, SeBatchLogonRight -ComputerName $env:COMPUTERNAME, SQL.contoso.com -UserName CONTOSO\User1, CONTOSO\User2
>```

---

## Check User Rights
### How to get it
[Get-UserRights.ps1](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/blob/master/Powershell/General%20Functions/Get-UserRights.ps1) :arrow_left: **Direct Download Link** \
_or_ \
[Personal File Server - Get-UserRights.ps1](https://files.blakedrumm.com/Get-UserRights.ps1) :arrow_left: **Alternative Download Link** \
_or_ \
[Personal File Server - Get-UserRights.txt](https://files.blakedrumm.com/Get-UserRights.txt) :arrow_left: **Text Format Alternative Download Link**

In order to check the Local User Rights, you will need to run the above (Get-UserRights), you may copy and paste the above script in your Powershell ISE and press play.

![UserAccountsRights](/assets/img/posts/get-user-right.png){:class="img-fluid"}

> ## Note
> You may edit line [467](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/blob/master/Powershell/General%20Functions/Get-UserRights.ps1#L467) in the script to change what happens when the script is run without any arguments or parameters, this also allows you to change what happens when the script is run from the Powershell ISE.

Here are a few examples:
### Local Computer
Get Local User Account Rights and output to text in console:
```powershell
.\Get-UserRights.ps1
```

### Remote Computer
Get Remote SQL Server User Account Rights:
```powershell
.\Get-UserRights.ps1 -ComputerName SQL.contoso.com
```

Get Local Machine and SQL Server User Account Rights:
```powershell
.\Get-UserRights.ps1 -ComputerName $env:COMPUTERNAME, SQL.contoso.com
```

### Output Types
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

Leave some feedback if this helped you! :v:

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/set-and-check-user-rights-assignment/)

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.

Tip:
To add auto-size pictures:
![/assets/img/posts/example.jpg](/assets/img/posts/example.jpg){:class="img-fluid"}
-->
