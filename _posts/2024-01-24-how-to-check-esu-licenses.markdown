---
layout: post
title:  "How to check core usage of ESU licenses - Azure Arc"
date:   '2024-01-24 12:00:00 -0500'
categories: troubleshooting azure
author: blakedrumm
thumbnail: /assets/img/posts/azure-arc.png
toc: true

summary: 'This article shows how to check the core usage of ESU licenses being used in Azure Arc with Resource Graph Explorer. A huge thank you to Brian McDermott and Sachin Panwar for the original guide creation.'

keywords: scom unix linux, scom unix runas accounts, scom runas account, unix linux runas account view error, linux error runas accounts, scom runas account view error
permalink: /blog/how-to-check-esu-licenses-azure-arc/
---
 
## :bulb: Introduction
This is my first blog post regarding the Azure space! On my blog today, I want to shed light on a common issue customers face: tracking the usage of Cores across their licenses. This is vital for understanding how many Cores are being utilized versus what's available. Currently, Azure Portal lacks a direct report view for this, forcing customers to manually check each license and linked server to sum up the Core count, which is a hassle.

Good news, though. When a customer asks for such a report, there's a simpler method: querying the Azure Resource Graph (ARG). The query I've got does the heavy lifting. It counts the Cores from each linked Arc machine, adjusts the count to meet the minimum requirements (8 vCores per VM and 16 pCores per physical server), and then presents this data alongside the license info.

This approach is a game-changer. It not only saves time but also gives a more accurate picture of Core usage.

## :chart_with_upwards_trend: Steps to Gather Data

### :mag: Open Resource Graph Explorer
Within the Azure Portal open [Resource Graph Explorer](https://portal.azure.com/#view/HubsExtension/ArgQueryBlade).

![Resource Graph Explorer](/assets/img/posts/resource-graph-explorer.png){:class="img-fluid"}

### :memo: Kusto Query (KQL)

```kql
resources
| where type =~ "microsoft.hybridcompute/licenses"
| extend sku = tostring(properties.licenseDetails.edition)
| extend totalCores = tostring(properties.licenseDetails.processors)
| extend coreType = case(
    properties.licenseDetails.type =~ 'vCore','Virtual core',
    properties.licenseDetails.type =~ 'pCore','Physical core',
    'Unknown'
)
| extend status = tostring(properties.licenseDetails.state)
| extend licenseId = tolower(tostring(id)) // Depending on what is stored in license profile, might have to get the immutableId instead
| join kind=inner(
    resources
    | where type =~ "microsoft.hybridcompute/machines/licenseProfiles"
    | extend machineId = tolower(tostring(trim_end(@"\/\w+\/(\w|\.)+", id)))
    | extend licenseId = tolower(tostring(properties.esuProfile.assignedLicense))
) on licenseId // Get count of license profile per license, a license profile is created for each machine that is assigned a license
| join kind=inner(
    resources
    | where type =~ "microsoft.hybridcompute/machines"
    | extend machineId = tolower(id)
    | extend coreCount = toint(properties.detectedProperties.coreCount) 
) on machineId // Get core count by machine
    | extend adjustedCoreCount = iff(sku =~ "Standard" 
                                , case(coreCount < 8, 8, coreCount) , 
                                    iff(sku =~ "DataCenter"
                                        , case(coreCount < 16, 16, coreCount)
                                        ,coreCount))  
| extend machineName = tostring(split(machineId, "/")[-1])
| project machineName, machineId, licenseId, name, type, location, subscriptionId, resourceGroup, sku, totalCores, coreType, status, adjustedCoreCount
| summarize UsedCoreCount = sum(adjustedCoreCount) by licenseId, name, type, location, subscriptionId, resourceGroup, sku, totalCores, coreType, status
```


![Azure Arc ESU licenses used](/assets/img/posts/esu-core-output-azure-arc.png){:class="img-fluid"}

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/how-to-check-esu-licenses-azure-arc/)

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.

Tip:
To add auto-size pictures:
![/assets/img/posts/example.jpg](/assets/img/posts/example.jpg){:class="img-fluid"}
-->
