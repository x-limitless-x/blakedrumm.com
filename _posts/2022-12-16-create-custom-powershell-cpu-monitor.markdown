---
layout: post
title:  "Create Custom Powershell CPU Monitor"
date:   '2022-12-02 13:52:41 -0500'
categories: powershell operationsManager guides
author: blakedrumm
thumbnail: /assets/img/posts/custom-cpu-usage-monitor-alert.png
toc: true

summary: >- # this means to ignore newlines
  This article shows you how to create a CPU Usage Monitor that runs via Powershell script. You can also download the example MP for testing.

keywords: create powershell monitor, create scom powershell monitor, scom powershell monitor, monitor scom with powershell, cpu usage monitor scom, custom cpu usage monitor, cpu usage monitor powershell scom
permalink: /blog/create-custom-powershell-cpu-monitor/
---

## :book: Introduction
Recently I had a case and I needed to assist my customer with a CPU Monitor that targets all Windows Computers. The customer is using the Powershell Authoring Community MP by Cookdown. I will document my steps to get this working as intended.

## :red_circle: Prerequisites
- Import Cookdown Powershell Monitoring - Community Management Pack ([https://www.cookdown.com/scom-essentials/powershell-authoring/](https://www.cookdown.com/scom-essentials/powershell-authoring/))

## Example MP
You can get a copy of the Management Pack I created in this guide, here: \
[Custom Monitor for CPU Usage](https://files.blakedrumm.com/custom.monitor.for.cpu.usage.xml)) :arrow_left: **Direct Download Link**

> ## :notebook: Note
> This guide will require you to edit the Management Pack directly, be aware that you need to be careful when editing any Management Pack to ensure you do not accidently change the wrong thing.

&nbsp;

## :page_with_curl: Start of Guide

### Step 1. Create a new Unit Monitor
You will need to create a new Unit Monitor.
1. Open the SCOM Console and navigate to the ***Authoring Tab*** -> ***Monitors*** -> Right Click ***Monitors*** -> Hover over ***Create a Monitor*** and select ***Unit Monitor...***: \
![Create Unit Monitor in SCOM Console](/assets/img/posts/create-a-unit-monitor.png){:class="img-fluid"}
2. Open the ***Scripting*** folder -> ***PowerShell Based*** -> ***PowerShell Script Two State Monitor (Community)*** \
   ![Select Scripting and PowerShell Script](/assets/img/posts/select-unit-monitor-type-scripting.png){:class="img-fluid"}
3. Select the appropriate Management Pack to save the new Monitor. \
   **It is HIGHLY recommended to save to a new MP instead of any existing MPs!**
4. Select **Next >**
5. Type in an appropriate name / description, I used: **Custom CPU Monitor**
6. Change the Monitor Target to **Windows Computer** \
   ![Select Windows Computer as Target](/assets/img/posts/windows-computer-target.png){:class="img-fluid"}
7. Click **Next >** \
   ![Verify data matches](/assets/img/posts/create-unit-monitor-step1.png){:class="img-fluid"}
8. Run every **15 minutes** by default, this is a good interval to start with. Click **Next >**
9. Type in the File Name you want to use, I used: **my_custom_cpu_monitoring_script.ps1**
10. Copy and Paste the below script into the ***Script*** section and click **Next >**:
    ```powershell
    $api = New-Object -ComObject "MOM.ScriptAPI";
    $PropertyBag = $api.CreatePropertyBag();
    [int]$Result = [int]((Get-Counter "\Processor(_Total)\% Processor Time").CounterSamples.CookedValue);
    $PropertyBag.AddValue("CPUUsage", $Result);
    $PropertyBag
    ```
    ![Copy and paste the above script to your script pane](/assets/img/posts/create-unit-monitor-script-pane.png)
11. Copy and paste the below, when everything below has been copied, click **Next >**:
    - Parameter Name column: `Property[@Name="CPUUsage"]`
    - Operator: `Greater than or equal to`
    - Value: `50`
    ![Verify values are set for Unhealthy expression](/assets/img/posts/create-unit-monitor-unhealthy.png)
12. Copy and paste the below, when everything below has been copied, click **Next >**:
    - Parameter Name column: `Property[@Name="CPUUsage"]`
    - Operator: `Less than`
    - Value: `50`
    ![Verify values are set for Healthy expression](/assets/img/posts/create-unit-monitor-healthy.png)
13. Optional: Change Unhealthy from Warning to Critical.
    ![Configure Monitor Health](/assets/img/posts/create-unit-monitor-configurehealth.png)
14. Click the ***Generate alerts for this monitor*** checkbox and change the Alert Description text to this:
    ```text
    The CPU has reached at or above 50% usage.

		  Current CPU usage is: $Data/Context/Property[@Name="CPUUsage"]$%
    ```
15. Done creating the unit monitor, now onto the more advanced stuff!

### Step 2. Modify the Management Pack
We will need to modify the Management Pack in order to allow the expressions to evaluate correctly. The Monitor is setup to use string values instead of integers, which will cause problems when we try to evaluate the health of the monitor.
1. Go to ***Administration Tab*** -> ***Management Packs*** -> ***Installed Management Packs*** -> Search for the Management Pack where your Monitor is saved. Select and export the Management Pack to any location.
   ![Export Management Pack](/assets/img/posts/create-unit-monitor-export-mp.png)
2. Navigate to the exported Management Pack xml file, open the MP XML with Notepad.
3. Find and replace: \
   `<XPathQuery>Property[@Name="CPUUsage"]</XPathQuery>`
   - Replace any occurrences with the following: \
     `<XPathQuery Type="Integer">Property[@Name="CPUUsage"]</XPathQuery>`
   - The above change allows us to interpret the output as integer, instead of string.
4. Find and replace: \
   `<Value Type="String">50</Value>`
   - Replace any occurrences with the following: \
     `<Value Type="Integer">50</Value>`
   - The above change allows us to interpret the output as integer, instead of string.
5. Modify Line 5 (the version of the Management Pack) in the xml file from: \
   `<Version>1.0.0.0</Version>` \
   to \
   `<Version>1.0.0.1</Version>`
6. Save the Management Pack XML and import the Management Pack back into your environment.

Leave some feedback if this helped you! :v:

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/create-custom-powershell-cpu-monitor/)

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.

Tip:
To add auto-size pictures:
![/assets/img/posts/example.jpg](/assets/img/posts/example.jpg){:class="img-fluid"}
-->
