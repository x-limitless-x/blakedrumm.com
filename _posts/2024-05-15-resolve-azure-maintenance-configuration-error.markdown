---
layout: post
title:  "Resolving Azure Maintenance Configuration Authorization Errors - Azure Update Manager"
date:   '2024-05-15 10:00:00 -0500'
categories: azure powershell troubleshooting guide
author: blakedrumm
thumbnail: /assets/img/posts/azure-authorization-error.png
toc: true

summary: >-
  Encountering authorization errors in Azure while creating maintenance configurations can hinder efficient resource management. This blog post explores the issue, its implications, and provides a PowerShell script to create a custom role to resolve the problem.

keywords: azure authorization error, azure custom role, azure maintenance configuration, resolve azure error, azure automation
permalink: /blog/resolve-azure-maintenance-configuration-error/
---

## :book: Introduction

While working with Azure, I encountered an authorization error while attempting to create a maintenance configuration. This post discusses the error, its implications, and how to resolve it using a custom role.

## :x: Error text

While creating a maintenance configuration, I encountered the following error:
><span style="color:yellow">The client 'user@contoso.com'</span> with object id '8b4fd821-05b6-4938-9949-18782893c5ed' <span style="color:yellow">does not have authorization to perform action 'Microsoft.Resources/deployments/validate/action'</span> over scope '/subscriptions/a1b2c3d4-5e6f-7g8h-9i0j-1k2l3m4n5o6p/resourceGroups/DeleteThisResourceGroup/providers/Microsoft.Resources/deployments/TestConfiguration_1715820611290' or the scope is invalid. If access was recently granted, please refresh your credentials. (Code: AuthorizationFailed)

This error message indicates a lack of permissions necessary to perform specific actions within the Azure portal.

## :gear: Solution

To address this error we will need to create a custom role that specifically includes the necessary permissions for managing maintenance configurations and validating deployments.

## :arrow_down: How to get it
**GitHub Gist:** [Create-MaintenanceConfigManagerRole.ps1](https://gist.github.com/blakedrumm/d94fe65970bbf5d4c56d471e5f4024a2)

I developed a PowerShell script that creates a custom role to grant a user the necessary permissions for managing Maintenance Configurations within a specific Resource Group.

```powershell
# Create-MaintenanceConfigManagerRole.ps1
# Script to create a custom role for managing Azure Maintenance Configurations
# Author: Blake Drumm (blakedrumm@microsoft.com)
# Website: https://blakedrumm.com/blog/resolve-azure-maintenance-configuration-error/
# Date created: May 15th, 2024

# Define custom variables
$subscriptionId = "a1b2c3d4-5e6f-7g8h-9i0j-1k2l3m4n5o6p"
$resourceGroupName = "ResourceGroupName"
$customRoleName = "Maintenance Configuration Manager - Resource Group: $resourceGroupName"
$userPrincipalName = "user@contoso.com"

# Define the custom role as a JSON string with the subscription ID and resource group name directly replaced
$customRoleJson = @"
{
    "Name": "$customRoleName",
    "IsCustom": true,
    "Description": "Allows management of maintenance configurations, validate and write deployments, read and write virtual machines, and write configuration assignments.",
    "Actions": [
        "Microsoft.Maintenance/maintenanceConfigurations/read",
        "Microsoft.Maintenance/maintenanceConfigurations/write",
        "Microsoft.Maintenance/maintenanceConfigurations/delete",
        "Microsoft.Resources/deployments/validate/action",
        "Microsoft.Resources/deployments/write",
        "Microsoft.Maintenance/configurationAssignments/write",
        "Microsoft.Compute/virtualMachines/read",
        "Microsoft.Compute/virtualMachines/write"
    ],
    "NotActions": [],
    "AssignableScopes": [
        "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName"
    ]
}
"@

# Convert the JSON string to a PowerShell object
$customRole = $customRoleJson | ConvertFrom-Json

# Create the custom role
New-AzRoleDefinition -Role $customRole

# Define the scope
$scope = "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName"

# Assign the custom role to the user
New-AzRoleAssignment -RoleDefinitionName $customRoleName -UserPrincipalName $userPrincipalName -Scope $scope

<#
    Copyright (c) Microsoft Corporation. MIT License
    
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
#>
```

:bulb: How to Use It
To implement this solution:

1. **Modify the script** with your specific details, including subscription ID, resource group name, and user principal name.
2. **Execute the script** in your PowerShell environment to create the custom role and assign it.
3. **Verify the permissions** are correctly applied by attempting to create a Maintenance Configuration again.

:speech_balloon: Conclusion
By understanding and addressing Azure permission errors through custom role creation, administrators can ensure smoother operation, enhance security, and reduce manual workload. Feel free to modify the script to fit your specific needs and share your feedback on how it worked for you! :v:

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/resolve-azure-maintenance-configuration-error/)