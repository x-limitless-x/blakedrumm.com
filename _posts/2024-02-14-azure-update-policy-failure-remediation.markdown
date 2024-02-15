---
layout: post
title:  "Configure periodic checking for missing system updates on azure virtual machines - Azure Update Manager Policy"
date:   '2024-02-14 21:00:00 -0500'
categories: troubleshooting azure
author: blakedrumm
thumbnail: /assets/img/posts/azure-update-manager-policy-configure-periodic-checking.png
toc: true

summary: 'This guide shows you how you can mitigate an issue with the built-in Azure Update Manager Policy that utilizes Managed Identity and does not allow read access to Disk Encryption Set by default.'

keywords: azure update manager, update manager policy, azure policy, automatic checking for missing updates, automatic updates azure policy
permalink: /blog/azure-update-policy-failure-remediation/
---
 
## :bulb: Introduction
I had a case today were my customer was experiencing an error with the built-in Azure Update Manager Policy named: **Configure periodic checking for missing system updates on azure virtual machines**. I decided it would be a good idea to script out how to fix this so it can be automatically fixed for anyone who needs this fix in the future.

```
Failed to remediate resource: '/subscriptions/a84b857e-2f4b-4b79-8b92-c6f1093b6d4f/resourceGroups/rg-app-production/providers/Microsoft.Compute/virtualMachines/vmProdServer01'. The 'PUT' request failed with status code: 'Forbidden'. Inner Error: 'The client 'f4e3d2c1-b6a5-4f09-b8ed-9c2a3b1c9e4d' with object id 'f4e3d2c1-b6a5-4f09-b8ed-9c2a3b1c9e4d' has permission to perform action 'Microsoft.Compute/virtualMachines/write' on scope '/subscriptions/a84b857e-2f4b-4b79-8b92-c6f1093b6d4f/resourceGroups/rg-app-production/providers/Microsoft.Compute/virtualMachines/vmProdServer01'; however, it does not have permission to perform action(s) 'Microsoft.Compute/diskEncryptionSets/read' on the linked scope(s) '/subscriptions/a84b857e-2f4b-4b79-8b92-c6f1093b6d4f/resourceGroups/rg-encryption-keys/providers/Microsoft.Compute/diskEncryptionSets/desProdKeySet' (respectively) or the linked scope(s) are invalid.', Correlation Id: '9e2d4b3c-a1b2-c3d4-e5f6-7g8h9i0j1k2l'.
```

# :mag: Cause
Built-in policy for **Configure periodic checking for missing system updates on azure virtual machines** does not utilize a role that includes the permissions needed for Disk Encryption Set read.

# :wrench: Resolution
The below PowerShell script is designed to duplicate the Virtual Machine Contributor role and will add Disk Encryption Set read access to the new custom role. Then the script duplicates the Azure Policy:
Configure periodic checking for missing system updates on azure virtual machines
 
Lastly the script edits the policy and replaces the assigned Role to the newly created custom role created with the script. You will need to edit line 22 to set the subscription name. On line 23 you can see the name of the new Policy that will be created with the script. You can verify the Role Definition is created correctly by searching the display name in your roles: **Virtual Machine Contributor (with Disk Encryption Set read)**

## :computer: PowerShell Script
```powershell
# ============================================================================
# Name: VM Management Role and Update Compliance Policy Setup Script
# ------------------------------------------------------------------
# Description: This PowerShell script automates the creation or updating of a custom Azure role and policy definition 
# for managing virtual machine (VM) security and compliance. It ensures VMs within specified subscriptions are managed 
# with enhanced permissions, including disk encryption set reading, and comply with system update policies. If the 
# targeted custom role does not exist, it creates one by extending the "Virtual Machine Contributor" role. It then 
# duplicates a built-in Azure policy for system update assessments, integrating the custom role to enforce update 
# compliance. Designed for Azure administrators, this script streamlines VM management, security, and compliance 
# within Azure environments.
# ============================================================================
# Author: Blake Drumm (blakedrumm@microsoft.com)
# Date Created: February 2nd, 2024
# Date Modified: February 6th, 2024
# ============================================================================

# Edit Variables Below

# Type in the Subscription Scope you want to target for the new Role
# (You can comma separate Subscriptions you want to apply this role to)
# (Leave this empty if you want to select all subscriptions)
$SubscriptionsScope = 'Visual Studio Enterprise Subscription'
$PolicyDefinitionName = 'Configure periodic checking for missing system updates on azure virtual machines (with Disk Encryption Set read)'

# ============================================================================

$error.Clear()
try
{
	$SubscriptionScopeDetails = Get-AzSubscription -SubscriptionName $SubscriptionsScope -ErrorAction Stop
}
catch
{
	Write-Warning "Experienced an error while gathering the subscription(s): $error`n`n$(Get-AzContext | Out-String)"
	break
}
$SubscriptionScopeId = ($SubscriptionScopeDetails).Id

do
{
	$Question = Read-Host "Current subscriptions selected ($($SubscriptionScopeId.Count)): `n • $($SubscriptionScopeDetails.Name -join "`n • ")`n`n Are you sure you want to perform actions against the above subscriptions? (Y/N)"
}
until ($Question -match "^Y|^N")

if ($Question -match "^N")
{
	Write-Output "Exiting the script."
	return # Use `return` instead of `break` outside of loops to exit the script
}

$RoleDefinitionName = "Virtual Machine Contributor (with Disk Encryption Set read)"

$CheckIfRolePresent = Get-AzRoleDefinition -Name 'Virtual Machine Contributor (with Disk Encryption Set read)' -ErrorAction SilentlyContinue -WarningAction SilentlyContinue

Write-Output "`n-----------------------------------------------------------------------------"

if (-NOT $CheckIfRolePresent)
{
	# Get the built-in "Virtual Machine Contributor" role definition
	$role = Get-AzRoleDefinition "Virtual Machine Contributor"
	
	# Clone the role to create a new custom role
	$customRole = $role | ConvertTo-Json | ConvertFrom-Json
	
	# Set properties for the new custom role
	$customRole.Id = $null
	$customRole.Name = $RoleDefinitionName
	$customRole.Description = "Lets you manage virtual machines, but not access to them, and not the virtual network or storage account they're connected to. Also lets you read disk encryption sets."
	$customRole.IsCustom = $true
	
	# Replace Actions with a new collection including Disk Encryption Sets read permission
	$customRole.Actions = @(
		"Microsoft.Authorization/*/read",
		"Microsoft.Compute/availabilitySets/*",
		"Microsoft.Compute/locations/*",
		"Microsoft.Compute/virtualMachines/*",
		"Microsoft.Compute/virtualMachineScaleSets/*",
		"Microsoft.Compute/cloudServices/*",
		"Microsoft.Compute/disks/write",
		"Microsoft.Compute/disks/read",
		"Microsoft.Compute/disks/delete",
		"Microsoft.DevTestLab/schedules/*",
		"Microsoft.Insights/alertRules/*",
		"Microsoft.Network/applicationGateways/backendAddressPools/join/action",
		"Microsoft.Network/loadBalancers/backendAddressPools/join/action",
		"Microsoft.Network/loadBalancers/inboundNatPools/join/action",
		"Microsoft.Network/loadBalancers/inboundNatRules/join/action",
		"Microsoft.Network/loadBalancers/probes/join/action",
		"Microsoft.Network/loadBalancers/read",
		"Microsoft.Network/locations/*",
		"Microsoft.Network/networkInterfaces/*",
		"Microsoft.Network/networkSecurityGroups/join/action",
		"Microsoft.Network/networkSecurityGroups/read",
		"Microsoft.Network/publicIPAddresses/join/action",
		"Microsoft.Network/publicIPAddresses/read",
		"Microsoft.Network/virtualNetworks/read",
		"Microsoft.Network/virtualNetworks/subnets/join/action",
		"Microsoft.RecoveryServices/locations/*",
		"Microsoft.RecoveryServices/Vaults/backupFabrics/backupProtectionIntent/write",
		"Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/*/read",
		"Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/read",
		"Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/write",
		"Microsoft.RecoveryServices/Vaults/backupPolicies/read",
		"Microsoft.RecoveryServices/Vaults/backupPolicies/write",
		"Microsoft.RecoveryServices/Vaults/read",
		"Microsoft.RecoveryServices/Vaults/usages/read",
		"Microsoft.RecoveryServices/Vaults/write",
		"Microsoft.ResourceHealth/availabilityStatuses/read",
		"Microsoft.Resources/deployments/*",
		"Microsoft.Resources/subscriptions/resourceGroups/read",
		"Microsoft.SerialConsole/serialPorts/connect/action",
		"Microsoft.SqlVirtualMachine/*",
		"Microsoft.Storage/storageAccounts/listKeys/action",
		"Microsoft.Storage/storageAccounts/read",
		"Microsoft.Support/*",
		"Microsoft.Compute/diskEncryptionSets/read"
	)
	
	# Replace NotActions with an empty array if needed, or customize as necessary
	$customRole.NotActions = @()
	
	# Replace assignable scopes with a new collection
	$customRole.AssignableScopes = @()
	foreach ($id in $SubscriptionScopeId)
	{
		$customRole.AssignableScopes += "/subscriptions/$id"
	}
	Write-Output "`n`t• Getting ready to create Azure Role Definition: $RoleDefinitionName"
	$error.Clear()
	try
	{
		Write-Verbose -Verbose "Custom Role Variable:`n$($customRole | Out-String)"
		# Create the new role definition
		$newAzRole = New-AzRoleDefinition -Role $customRole -ErrorAction Stop
		Write-Output "`n`t• Successfully created Azure Role Definition!"
	}
	catch
	{
		$ScriptError = $_
		"-- Custom Role:"
		$customRole
		$ScriptError
		Write-Verbose -Verbose " == Aborting script / See above for error == "
		return
	}
}
else
{
	$newAzRole = $CheckIfRolePresent
	Write-Output "`n`tRole Definition is already created.`n"
}
Write-Output $newAzRole

Write-Output "`n-----------------------------------------------------------------------------`n"

# Step 1: Capture the New Role Definition ID
$newRoleDefinitionId = $newAzRole.Id

# Step 2: Identify the Built-in Azure Policy to Duplicate
# For example, let's assume you've identified a policy by its definition ID
$existingPolicyDefinitionId = '59efceea-0c96-497e-a4a1-4eb2290dac15'

# Get the existing policy definition
$existingPolicyDefinition = Get-AzPolicyDefinition -Name $existingPolicyDefinitionId

# Step 3: Duplicate and Update the Policy with the New Role Definition ID
# Convert the existing policy rule to an object to make it editable
$policyRuleObject = $existingPolicyDefinition.Properties.PolicyRule

# Assuming the policy involves role assignments, update the rule to include your new role definition ID
# Note: The specific changes depend on the policy's structure. This is a generic example.
# If the policy assigns roles, you might find a section in the policy rule to insert the role ID.
# Correctly format the roleDefinitionIds as an array
$policyRuleObject.then.details.roleDefinitionIds = @("/providers/Microsoft.Authorization/roleDefinitions/$newRoleDefinitionId")

# Convert the modified policy rule back to JSON
$modifiedPolicyRuleJson = $policyRuleObject | ConvertTo-Json -Depth 20

Write-Output "`t• Creating/Updating new Policy Definition.`n`t  • Name: $PolicyDefinitionName"

# Step 4: Create the New Policy Definition
$error.Clear()
try
{
	$newPolicyDefinition = New-AzPolicyDefinition -Name "PeroidicCheckMissingAzureVMs" `
												  -DisplayName $PolicyDefinitionName `
												  -Description "Configure auto-assessment (every 24 hours) for OS updates on native Azure virtual machines. You can control the scope of assignment according to machine subscription, resource group, location or tag. Learn more about this for Windows: https://aka.ms/computevm-windowspatchassessmentmode, for Linux: https://aka.ms/computevm-linuxpatchassessmentmode." `
												  -Policy $modifiedPolicyRuleJson `
												  -Mode $existingPolicyDefinition.Properties.Mode `
												  -Parameter ($existingPolicyDefinition.Properties.Parameters | ConvertTo-Json) `
												  -Metadata ($existingPolicyDefinition.Properties.Metadata | ConvertTo-Json) `
												  -ErrorAction Stop
	
	# Output the new policy definition for verification
	Write-Output "`n`t• New policy definition created/updated.`n`t  • Resource Id: $($newPolicyDefinition.ResourceId)"
}
catch
{
	Write-Warning "Experienced an error while creating the Policy Definition:`n`n$error"
	return
}


<#
Copyright (c) Microsoft Corporation. MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
associated documentation files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge, publish, distribute,
sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or
substantial portions of the Software.

THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

#>
```

![VM Management Role and Update Compliance Policy Setup Script Output](/assets/img/posts/azure-update-manager-policy-powershell-script.png){:class="img-fluid"}

Leave some feedback if this helped you! :v:

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/temporary-url/)

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.

Tip:
To add auto-size pictures:
![/assets/img/posts/example.jpg](/assets/img/posts/example.jpg){:class="img-fluid"}
-->
