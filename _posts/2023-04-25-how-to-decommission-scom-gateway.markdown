---
layout: post
title:  "How to Decommission SCOM Gateway"
date:   '2023-04-25 15:43:02 -0500'
categories: guides operationsManager
author: blakedrumm
thumbnail: /assets/img/posts/scom-gateway-decommission.png
toc: true

summary: >- # this means to ignore newlines
  This article shows you how to remove a SCOM Gateway.

keywords: scom gateway, scom gateway decommission, scom decommission
permalink: /blog/how-to-decommission-scom-gateway/
---

## The Steps Required

1. Move any agents (Agents or Agentless) assigned to the Gateway to another server.

2. Uninstall the SCOM Gateway through programs and features.

3. Delete the Gateway with the Gateway Approval Tool.

    > The Microsoft.EnterpriseManagement.GatewayApprovalTool.exe tool is needed only on the management server, and it only has to be run once.
    >
    > To copy Microsoft.EnterpriseManagement.GatewayApprovalTool.exe to management servers
    > From a target management server, open the Operations Manager installation media `\SupportTools\` (amd64 or x86) directory.
    >
    > Copy the ***Microsoft.EnterpriseManagement.GatewayApprovalTool.exe*** from the installation media to the Operations Manager installation directory.

    The command to delete a SCOM Gateway:
    ```
    Microsoft.EnterpriseManagement.GatewayApprovalTool.exe /ManagementServerName=<managementserverFQDN> /GatewayName=<GatewayFQDN> /Action=Delete
    ```
    
---

## Powershell Script to move Agents

You can find the below script (and others) here: [https://github.com/blakedrumm/SCOM-Scripts-and-SQL/tree/master/Powershell/Agents%20Failover](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/tree/master/Powershell/Agents%20Failover)


Replace the following variables before running:
```
<MoveFrom_MS>
<MoveToPrimary_MS>
<MoveToSecondary_MS>
```

Be aware, the machines will need to be remotely manageable before you can run the below script. More information here: [https://kevinholman.com/2010/02/20/how-to-get-your-agents-back-to-remotely-manageable-in-scom/](https://kevinholman.com/2010/02/20/how-to-get-your-agents-back-to-remotely-manageable-in-scom/)
```powershell
# ===============================
# Author: Blake Drumm (blakedrumm@microsoft.com)
# Created: September 30th, 2022
# Modified: September 30th, 2022
# Script location: https://github.com/blakedrumm/SCOM-Scripts-and-SQL/blob/master/Powershell/Agents%20Failover/Set-AgentFailover.ps1
# ===============================

Import-Module OperationsManager

#===================================================================
#region Script Variables

#We will look for all Agents Managed by this Management Server.
$movefromManagementServer = Get-SCOMManagementServer -Name "<MoveFrom_MS>"

#Primary Management Server
$movetoPrimaryMgmtServer = Get-SCOMManagementServer -Name "<MoveToPrimary_MS>"

#Secondary Management Server
$movetoFailoverMgmtServer = Get-SCOMManagementServer -Name '<MoveToSecondary_MS>'

#Gather the System Center Agent Class so we can get the Agents:
$scomAgent = Get-SCOMClass | Where-Object{ $_.name -eq "Microsoft.SystemCenter.Agent" } | Get-SCOMClassInstance

#endregion Variables
#===================================================================

#===================================================================
#region MainScript
$i = 0
foreach ($agent in $scomAgent)
{
	$i++
	$i = $i
	
	#Check the name of the current
	$scomAgentDetails = Get-SCOMAgent -ManagementServer $movefromManagementServer | Where { $_.DisplayName -match $agent.DisplayName }
	if ($scomAgentDetails)
	{
		#Remove Failover Management Server
		Write-Output "($i/$($scomAgent.count)) $($agent.DisplayName)`n`t`tRemoving Failover"
		$scomAgentDetails | Set-SCOMParentManagementServer -FailoverServer $null | Out-Null
		#Set Primary Management Server
		Write-Output "`t`tCurrent Primary: $($movefromManagementServer.DisplayName)`n`t`tUpdating Primary to: $($movetoPrimaryMgmtServer.DisplayName)"
		$scomAgentDetails | Set-SCOMParentManagementServer -PrimaryServer $movetoPrimaryMgmtServer | Out-Null
		if ($movetoFailoverMgmtServer -and $movetoFailoverMgmtServer -ne '<MoveToSecondary_MS>')
		{
			#Set Secondary Management Server
			Write-Output "               $($agent.DisplayName) Failover: $($movetoFailoverMgmtServer.DisplayName)`n`n"
			$scomAgentDetails | Set-SCOMParentManagementServer -FailoverServer $movetoFailoverMgmtServer | Out-Null
		}
	}
	else
	{
		Write-Verbose "Unable to locate any data."
	}
}
Write-Output "Script completed!"
#endregion MainScript
#===================================================================
```

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/how-to-decommission-scom-gateway/)

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.

Tip:
To add auto-size pictures:
![/assets/img/posts/example.jpg](/assets/img/posts/example.jpg){:class="img-fluid"}
-->
