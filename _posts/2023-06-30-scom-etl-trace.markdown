---
layout: post
title:  "SCOM ETL Trace Gathering Script"
date:   '2023-06-30 15:32:09 -0500'
categories: powershell operationsManager troubleshooting projects
author: blakedrumm
thumbnail: /assets/img/posts/etl_trace.png
toc: true

summary: >- # this means to ignore newlines
  This article shows you how you can gather an ETL Trace automatically with a PowerShell script.

keywords: scom etl trace, scom trace, trace scom, gather scom etl trace, detect event id
permalink: /blog/scom-etl-trace/
---

## :book: Introduction
This Tool will assist you in gathering ETL Traces. You have the options of selecting specific Tracing to gather with this script.

The script will perform the following, in this order:
1. Stops any existing ETL Traces
 - *Optional:* Stops the SCOM Services
2. Starts the ETL Trace
 - *Optional:* Starts the SCOM Services back up
3. Script will wait for issue to occur
 - *Default:* Pauses Script, waits until you press Enter
 - *Optional:* Sleeps for x Seconds (`-SleepSeconds 10`)
 - *Optional:* Script will loop until an Event ID is detected  (`-DetectOpsMgrEventID`)
4. Stops ETL Trace
5. Formats ETL Trace
6. Zips Up Output and Opens Explorer Window for Viewing File

## How to get it
You can get a copy of the script here: \
[Start-ScomETLTrace.ps1](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/blob/master/Powershell/SCOM%20ETL%20Trace/Start-ScomETLTrace.ps1) :arrow_left: **Direct Download Link** \
_or_ \
[Personal File Server - Start-ScomETLTrace.ps1](https://files.blakedrumm.com/Start-ScomETLTrace.ps1) :arrow_left: **Alternative Download Link** \
_or_ \
[Personal File Server - Start-ScomETLTrace.txt](https://files.blakedrumm.com/Start-ScomETLTrace.txt) :arrow_left: **Text Format Alternative Download Link**

## :page_with_curl: How to use it
Open Powershell Prompt as Administrator:
>#### Examples
>##### All Available Commands
>```powershell
>.\Start-ScomETLTrace.ps1 -GetAdvisor -GetApmConnector -GetBID -GetConfigService -GetDAS -GetFailover -GetManaged -GetNASM -GetNative -GetScript -GetUI -VerboseTrace -DebugTrace -NetworkTrace -SleepSeconds -RestartSCOMServices -DetectOpsMgrEventID
>```
>
>###### Get Verbose Native ETL Trace
>```powershell
>.\Start-ScomETLTrace.ps1 -GetNative -VerboseTrace
>```
>
>>###### Get Verbose Native ETL Trace and Format the trace
>```powershell
>.\Start-ScomETLTrace.ps1 -GetNative -VerboseTrace -FormatTrace
>```
>
>###### Gather Verbose ETL Trace and detect for 1210 Event ID (Sleep for 30 Seconds between checks)
>```powershell
>.\Start-ScomETLTrace.ps1 -VerboseTrace -DetectOpsMgrEventID 1210 -SleepSeconds 30
>```
>
>>###### Gather Verbose ETL Trace and detect for 1210 Event ID (Sleep for 30 Seconds between checks) and sleep for 10 seconds after finding the Event ID
>```powershell
>.\Start-ScomETLTrace.ps1 -VerboseTrace -DetectOpsMgrEventID 1210 -SleepSeconds 30 -SleepAfterEventDetection 10
>```
>
>###### Restart SCOM Services after starting an ETL Trace. Sleep for 2 Minutes and stop the Trace Automatically
>```powershell
>.\Start-ScomETLTrace.ps1 -Sleep 120 -RestartSCOMServices
>```
>
>#### Get All ETL Traces
>###### Get Verbose Tracing for all the Default Tracing Available (just like running this: -GetAdvisor -GetApmConnector -GetBID -GetConfigService -GetDAS -GetFailover -GetManaged -GetNASM -GetNative -GetScript -GetUI)
>```powershell
>.\Start-ScomETLTrace.ps1 -VerboseTrace
>```
>
>###### Get Debug Tracing for all the Default Tracing Available (just like running this: -GetAdvisor -GetApmConnector -GetBID -GetConfigService -GetDAS -GetFailover -GetManaged -GetNASM -GetNative -GetScript -GetUI)
>```powershell
>.\Start-ScomETLTrace.ps1 -DebugTrace
>```
>
>###### Get Verbose Tracing for all the Default Tracing Available and Network Tracing (just like running this: -GetAdvisor -GetApmConnector -GetBID -GetConfigService -GetDAS -GetFailover -GetManaged -GetNASM -GetNative -GetScript -GetUI)
>```powershell
>.\Start-ScomETLTrace.ps1 -VerboseTrace -NetworkTrace
>```
>
>###### Get Verbose Tracing for all the Default Tracing Available and OpsMgrModuleLogging for Linux Related Issues
>```powershell
>.\Start-ScomETLTrace.ps1 -VerboseTrace -OpsMgrModuleLogging
>```


Leave some feedback if this helped you! :v:

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/scom-etl-trace/)

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.

Tip:
To add auto-size pictures:
![/assets/img/posts/example.jpg](/assets/img/posts/example.jpg){:class="img-fluid"}
-->
