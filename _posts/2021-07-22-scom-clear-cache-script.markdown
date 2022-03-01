---
layout: post
title:  "SCOM Clear Cache Script"
date:   '2021-07-22 01:09:42 -0500'
categories: powershell operationsManager
author: blakedrumm
thumbnail: /assets/img/posts/clear-scomcache.png

summary: >- # this means to ignore newlines
  Clear your Agent, Management Server, or Gateway SCOM Cache with an easy to use Powershell Script!
  The script also utilizes Invoke-Command, be sure to enable PSRemoting to allow you to utilize this script across servers if needed.

keywords: clear scom cache, clear cache for scom, Management Server clear cache, clear gateway cache, clear agent cache, clean gateway, clean management server, clean agent, clean MS
permalink: /blog/clear-scomcache/
---
<sub>Article last updated on December 29th, 2021</sub>

  The Clear SCOM Cache Script, which is located here: \
  [https://github.com/blakedrumm/SCOM-Scripts-and-SQL/blob/master/Powershell/Clear-SCOMCache.ps1](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/blob/master/Powershell/Clear-SCOMCache.ps1)

The script without any modifications clears the SCOM cache only on the local server, nothing else.

Argument List | Description |
------------- | ----------- |
-All | Optionally clear all caches that SCOM could potentially use that doesnt require a reboot. Flushing DNS, Purging Kerberos Tickets, Resetting NetBIOS over TCPIP Statistics. (Combine with -Reboot for a full clear cache) |
-Reboot | Optionally reset winsock catalog, stop the SCOM Services, clear SCOM Cache, then reboot the server. This will always perform on the local server last. |
-Servers | Optionally each Server you want to clear SCOM Cache on. Can be an Agent, Management Server, or SCOM Gateway. This will always perform on the local server last. |
-Shutdown | Optionally shutdown the server after clearing the SCOM cache. This will always perform on the local server last. |
-Sleep | Time in seconds to sleep between each server. |



## Examples
### Clear all Gray SCOM Agents
```powershell
#Get the SystemCenter Agent Class
$agent = Get-SCOMClass | where-object{$_.name -eq "microsoft.systemcenter.agent"}
#Get the grey agents
$objects = Get-SCOMMonitoringObject -class:$agent | where {$_.IsAvailable -eq $false}
.\Clear-SCOMCache.ps1 -Servers $objects
```

### Clear SCOM cache on every Management Server in Management Group.
```powershell
Get-SCOMManagementServer | .\Clear-SCOMCache.ps1
```

### Clear SCOM cache on every Agent in the in Management Group.
```powershell
Get-SCOMAgent | .\Clear-SCOMCache.ps1
```

### Clear SCOM cache and reboot the Servers specified.
```powershell
.\Clear-SCOMCache.ps1 -Servers AgentServer.contoso.com, ManagementServer.contoso.com -Reboot
```

### Clear SCOM cache and shutdown the Servers specified.
```powershell
.\Clear-SCOMCache.ps1 -Servers AgentServer.contoso.com, ManagementServer.contoso.com -Shutdown
```

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/clear-scomcache/)

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.
-->
