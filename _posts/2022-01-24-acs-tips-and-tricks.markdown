---
layout: post
title:  "SCOM ACS Collector Troubleshooting Tips"
date:   '2022-01-24 20:22:16 -0500'
categories: troubleshooting guides
author: blakedrumm
thumbnail: /assets/img/posts/system-center-operations-manager-acs.png
summary: >- # this means to ignore newlines
  Tips for troubleshooting System Center Operations Manager Audit Collection Services issues.

keywords: audit collection services, scom 2019 acs, scom acs troubleshooting, opsmgr acs, scom acs, scom acs slow inserts
permalink: /blog/acs-collector-troubleshooting-tips/
---
 A customer of mine was having problems with Audit Collection Services in SCOM 2019 UR3 and I noticed that there are not alot of troubleshooting guides out there. So it would be a good idea to document this information here.
 
 ## Verify ACS collector performance

1.  Open Performance Monitor, right click on Start Menu and select run. \
    In run box type the following:
    ```
    perfmon.msc
    ```
    
2.  Once Opened go to Monitoring Tools Folder, then right click on **Performance Monitor** and go to **Properties**: \
    ![Performance Monitor Properties](/assets/img/posts/ACS-perfmonitor-properties.png)

3.  Select the Data tab: \
    ![Performance Monitor Properties - General](/assets/img/posts/ACS-PerformanceMonitorProperties-General.png)

4.  Clear the currently selected counters by removing each counter listed with the **Remove** Button, then select **Add**: \
    ![Performance Monitor Properties - Data Sets](/assets/img/posts/ACS-PerformanceMonitorProperties-DataSets.png)

5.  Locate the **ACS Collector** in available counters, select it, and click on the **Add** button: \
    ![ACS Collector Performance Counter](/assets/img/posts/ACS-CollectorPerformanceCounter.png) \
    This is how it should look when it is added: \
    ![ACS Collector Performance Counter - Added](/assets/img/posts/ACS-CollectorPerformanceCounter-Added.png)

6.  Click **OK** to confirm the property settings.

8.  Click on the following button to change the view type, change to **Report**: \
    ![Change to Report View](/assets/img/posts/ACS-ChangeToReportView.png)

9.  View your performance data for ACS: \
    ![ACS Performance Data](/assets/img/posts/ACS-PerformanceData.png)


## Gather Partition Table History
You can run the following tsql query against the OperationsManagerAC

```sql
select * from dtpartition order by partitionstarttime
```


## Enable ACS Collector Logging
### TraceFlags
TraceFlags consists of three groups that are OR'd (added) together. They are Verbosity Level, Component, and Log Output Method. Verbosity Level refers to the number and type of events that are logged to the trace log when trace logging is enabled, while Component can only be used if the Verbosity Level is set to Level Debug and is used to enable/disable logging for various internal components. Log Output Method is used to specify the location that tracing information is written to. 
#### Verbosity Level settings
|Value |Description |
|------|------------|
|0x00000000|No logging.|
|0x00000001|Level Error. Logs only errors.|
|0x00000002|Level Warning. Logs errors and warnings.|
|0x00000003|Level Informational. Logs errors, warnings, and information.|
|0x00000004|Level Debug. Logs everything and is very verbose.|

#### Component settings
|Value |Description |
|------|------------|
|0x00000010|General|
|0x00000020|Networking|
|0x00000080|Event tracking|

#### Log Output Method settings
|Value |Description |
|------|------------|
|0x00020000|Log to debug out|
|0x00040000|Log to the console, if available (only when running the collector from the command line)|
|0x00080000|Log to file in `%SystemRoot%\Temp` directory|

> %SystemRoot% = C:\Windows\

Trace log files are located in the `%SystemRoot%\Temp` directory. For the Collector, the log files are written to `%SystemRoot%\Temp\AdtServer.log` and `%SystemRoot%\Temp\AdtSrvDll.log`. When a log file fills to capacity, the system overwrites the oldest entries with the most recent entries. Log files have a default size of 1 MB and begin to overwrite the oldest entries once they are full. 

1. To enable logging, via RegEdit navigate to the following location: \
`HKEY_LOCAL_MACHINE\Software\Policies\Microsoft\AdtAgent\Parameters`
2. Create the TraceFlags __DWORD (32-bit) Value__ and set it to __Hexadecimal__ `80003` unless otherwise advised. Trace logging begins immediately; no restart of the Collector is needed. Additionally, Change permission must be granted to `%SystemRoot%\Temp` for the __NetworkService__ account. For example, to log errors, warnings, and information messages to a file change the traceflags registry value to `0x00080003`. This is a combination of `0x00080000` _[file]_ and `0x00000003` _[errors +warnings+informational]_.
3. To disable logging, delete the __TraceFlags__ value or set it to 0. 


![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/acs-collector-troubleshooting-tips/)

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.
-->
