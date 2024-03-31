---
layout: post
title:  "Toggle VM Power by Tag - Azure Automation"
date:   '2024-03-31 00:35:08 -0500'
categories: azure powershell
author: blakedrumm
thumbnail: /assets/img/start-stop-vms-by-tag-test-panel.png
toc: true

summary: 'Learn how to start or stop Azure VMs in bulk based on specific tags, using a PowerShell script for efficient management and cost savings.'

keywords: azure, automation, powershell, vm management, tag-based operations
permalink: /blog/azure-automation-toggle-vm-power-by-tag/
---

## :bulb: Introduction
Managing the power state of Azure VMs can be a cumbersome task, especially when dealing with a large number of instances. In scenarios where VMs need to be started or stopped based on certain criteria—like environment tags—it's crucial to have an automated solution. This guide introduces a PowerShell script designed to toggle the power state of Azure Virtual Machines (VMs) based on their tags, offering a streamlined approach for bulk operations.

## :wrench: The Script
The PowerShell script enables you to start or stop Azure VMs in bulk by specifying their subscription IDs, a tag name, and a tag value. It also supports a `-WhatIf` parameter for dry runs, allowing you to preview the changes without applying them.

## :label: Preparing Your VMs

To ensure your Azure VMs respond correctly to the script, you must tag them with specific key-value pairs. The script identifies VMs to start or stop based on these tags. Here's how to set up your VM tags:

### Tagging VMs

![Example showing a tag configured for a Virtual Machine in the Azure Portal](/assets/img/start-stop-vms-by-tag-vm-example.png)

1. **Access the Azure Portal:** Navigate to the Azure Portal and find the Virtual Machines section.

2. **Select a VM:** Choose the VM you want to manage with the script.

3. **Add Tags:**
    - Click on the **Tags** section in the VM's menu.
    - Add a new tag with the **TagName** you plan to use in the script. For example, if your script uses `Environment` as the tag name, you might set the tag value to `Development` for all development VMs.

### Example Tag Configuration

- **Tag Name:** Environment
- **Tag Value:** Development

With this configuration, if you run the script with `Environment` as the `$TagName` and `Development` as the `$TagValue`, it will target all VMs tagged as part of your development environment.

This setup allows for precise control over which VMs are affected by the script, enabling you to manage VM power states efficiently across different environments or projects.


## :arrow_down: How to get it
**GitHub Gist:** [Toggle-VMPowerByTag.ps1](https://gist.github.com/blakedrumm/23163b76af766e38bcc507743472c603)

```powershell
param
(
	[Parameter(Mandatory = $true)]
	[String[]]$SubscriptionIds,
	[Parameter(Mandatory = $true)]
	[String]$TagName,
	[Parameter(Mandatory = $true)]
	[String]$TagValue,
	[Parameter(Mandatory = $true)]
	[Boolean]$PowerState, # true for start, false for stop
	[Boolean]$WhatIf # test how the script will work, without making any changes to your environment
)

# Script to toggle Azure VM power states based on tags
# Requires PowerShell 7.2 or higher
# Author: Blake Drumm (blakedrumm@microsoft.com)
# Website: https://blakedrumm.com/
# Date created: March 31st, 2024

# Ensures you do not inherit an AzContext in your runbook
$disableAzContextAutosave = Disable-AzContextAutosave -Scope Process

# Connect using a Managed Service Identity
try
{
	# Connect to Azure
	$AzConnection = Connect-AzAccount -Identity -AccountId cb02e61e-d392-48d7-936a-9b44bbf5f312 -ErrorAction Stop
	Write-Output "$((Get-Date).ToLocalTime()) - Connected to Azure"
}
catch
{
	# Log the error and exit
	Write-Output "$((Get-Date).ToLocalTime()) - Connection failed: $_"
	exit 1
}

$SubscriptionIds | ForEach-Object {
	# Initialize variables
	$PS = $PowerState
	$SubId = $_
	try
	{
		# Set the subscription context
		Write-Output "$((Get-Date).ToLocalTime()) - Subscription Id: $SubId"
		$setAzContext = Set-AzContext -SubscriptionId $SubId -ErrorAction Stop
	}
	catch
	{
		# Log the error and exit
		Write-Output "$((Get-Date).ToLocalTime()) - Encountered error: $_"
		exit 1
	}
	# Fetch VMs with the specified tag
	$vms = Get-AzResource -ResourceType Microsoft.Compute/virtualMachines -TagName $TagName -TagValue $TagValue
	# Start or stop the VMs based on the desired state
	$vms | ForEach-Object -Parallel {
		$vm = $_
		$WhatIf = $using:WhatIf
		$Power = $using:PS
		# Fetch VM status
		$x = 0
		do
		{
			$x++
			try
			{
				$vmStatus = Get-AzVM -ResourceGroupName $vm.ResourceGroupName -Name $vm.Name -Status -ErrorAction Stop
				# This will only be set to 2 if the command above is able to successfully fetch the VM status
				$x = 2
			}
			catch
			{
				Write-Output "$((Get-Date).ToLocalTime()) - Encountered error: (VM Name: $($vm.Name)) $_"
			}
		}
		until ($x -eq 2)
		
		
		# Extract the power state of the VM
		$vmPowerState = $vmStatus.Statuses | Where-Object { $_.Code -like 'PowerState/*' } | Select-Object -ExpandProperty Code
		
		# Start or stop VM based on the desired state		
		if (($Power -eq $true) -and ($vmPowerState -ne 'PowerState/running'))
		{
			if ($WhatIf)
			{
				Write-Output "$((Get-Date).ToLocalTime()) - What if: Starting $($vm.Name)"
			}
			else
			{
				# Start the VM
				Start-AzVM -Name $vm.Name -ResourceGroupName $vm.ResourceGroupName -Verbose
				Write-Output "$((Get-Date).ToLocalTime()) - Starting $($vm.Name)"
			}
		}
		elseif ($Power -eq $false -and $vmPowerState -notmatch 'PowerState/(deallocated|stopped)')
		{
			if ($WhatIf)
			{
				Write-Output "$((Get-Date).ToLocalTime()) - What if: Stopping $($vm.Name)"
			}
			else
			{
				# Stop the VM
				Stop-AzVM -Name $vm.Name -ResourceGroupName $vm.ResourceGroupName -Force -Verbose
				Write-Output "$((Get-Date).ToLocalTime()) - Stopping $($vm.Name)"
			}
		}
		else
		{
			# Log the VM is already in the desired state
			Write-Output "$((Get-Date).ToLocalTime()) - VM $($vm.Name) is already in the desired state (PowerState: $Power). (Current VM PowerState: $vmPowerState)"
		}
	} -ThrottleLimit 4 # Example throttle limit
}
Write-Output "$((Get-Date).ToLocalTime()) - Script completed!"

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

## :gear: How It Works
The script first disables AzContext autosave to ensure a clean environment. Then, it attempts to connect to Azure using a Managed Service Identity. For each subscription ID provided, it sets the Azure context and fetches VMs that match the specified tag name and value. Depending on the desired power state (`$PowerState`), it starts or stops the fetched VMs, respecting the `-WhatIf` parameter to only simulate actions if specified.

### :key: Key Features
- **Tag-Based Filtering:** Selectively start or stop VMs based on tags, allowing for flexible management of different environments or deployment stages.
- **Bulk Operations:** Perform actions on multiple VMs across different subscriptions, saving time and effort.
- **Safe Testing with `-WhatIf`:** Preview the impact of the script without making actual changes to your VMs, enhancing control and safety.

## :mag: Use Cases
This script is particularly useful for scenarios like:
- **Cost Optimization:** Automatically stop non-essential VMs outside of business hours.
- **Environment Management:** Quickly start or stop all VMs within a specific environment (e.g., development, testing) based on tagging.

## :thought_balloon: Feedback
Have you tried using the script in your Azure environment? Any suggestions for improvement or additional features you'd find useful? Share your thoughts and experiences to help enhance this script for everyone.

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/azure-automation-toggle-vm-power-by-tag/)
