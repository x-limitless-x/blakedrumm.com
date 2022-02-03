---
layout: post
title:  "SCOM ACS Collector Troubleshooting Tips"
date:   '2022-01-24 20:22:16 -0500'
categories: troubleshooting guides operationsManager
author: blakedrumm
thumbnail: /assets/img/posts/system-center-operations-manager-acs.png
summary: >- # this means to ignore newlines
  Tips for troubleshooting System Center Operations Manager Audit Collection Services issues.

description: {{ post.summary }}

keywords: audit collection services, scom 2019 acs, scom acs troubleshooting, opsmgr acs, scom acs, scom acs slow inserts
permalink: /blog/acs-collector-troubleshooting-tips/
---
A customer of mine was having problems with Audit Collection Services in SCOM 2019 UR3 and I noticed that there are not alot of troubleshooting guides out there. So it would be a good idea to document this information here.
 
 ___
 
## Verify ACS collector performance

1.  Open Performance Monitor, right click on Start Menu and select run. \
    In run box type the following:
    ```
    perfmon.msc
    ```
    
2.  Once Opened go to Monitoring Tools Folder, then right click on **Performance Monitor** and go to **Properties**: \
    ![Performance Monitor Properties](/assets/img/posts/ACS-perfmonitor-properties.png){:class="img-fluid"}

3.  Select the Data tab: \
    ![Performance Monitor Properties - General](/assets/img/posts/ACS-PerformanceMonitorProperties-General.png){:class="img-fluid"}

4.  Clear the currently selected counters by removing each counter listed with the **Remove** Button, then select **Add**: \
    ![Performance Monitor Properties - Data Sets](/assets/img/posts/ACS-PerformanceMonitorProperties-DataSets.png){:class="img-fluid"}

5.  Locate the **ACS Collector** in available counters, select it, and click on the **Add** button: \
    ![ACS Collector Performance Counter](/assets/img/posts/ACS-CollectorPerformanceCounter.png){:class="img-fluid"} \
    This is how it should look when it is added: \
    ![ACS Collector Performance Counter - Added](/assets/img/posts/ACS-CollectorPerformanceCounter-Added.png){:class="img-fluid"}

6.  Click **OK** to confirm the property settings.

8.  Click on the following button to change the view type, change to **Report**: \
    ![Change to Report View](/assets/img/posts/ACS-ChangeToReportView.png){:class="img-fluid"}

9.  View your performance data for ACS: \
    ![ACS Performance Data](/assets/img/posts/ACS-PerformanceData.png){:class="img-fluid"}

___

## Gather Partition Table History
You can run the following tsql query against the OperationsManagerAC

```sql
-- Status:
-- 0: active, set by collector
-- 1: inactive, mark for closing during collector startup & indexing, set manually
-- 2: archived, ready for deletion, set from outside the collector
-- 100 - 108: closed, indexing in progress
-- 109: indexing complete
select * from dtpartition order by partitionstarttime
```

___

## Enable ACS Collector Logging
### TraceFlags
TraceFlags consists of three groups that are OR'd (added) together. They are Verbosity Level, Component, and Log Output Method. Verbosity Level refers to the number and type of events that are logged to the trace log when trace logging is enabled, while Component can only be used if the Verbosity Level is set to Level Debug and is used to enable/disable logging for various internal components. Log Output Method is used to specify the location that tracing information is written to. 

#### Verbosity Level settings
<div class="responsive-table">
<table>
      <thead>
        <tr>
          <th scope="col">Value</th>
          <th scope="col">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>0x00000000</td>
          <td>No logging.</td>
        </tr>
        <tr>
          <td>0x00000001</td>
          <td>Level Error. Logs only errors.</td>
        </tr>
        <tr>
          <td>0x00000002</td>
          <td>Level Warning. Logs errors and warnings.</td>
        </tr>
        <tr>
          <td>0x00000003</td>
          <td>Level Informational. Logs errors, warnings, and information.</td>
        </tr>
        <tr>
          <td>0x00000004</td>
          <td>Level Debug. Logs everything and is very verbose.</td>
        </tr>
      </tbody>
    </table>
    </div>

<hr />

#### Component settings
<div class="responsive-table">
<table>
      <thead>
        <tr>
          <th scope="col">Value</th>
          <th scope="col">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>0x00000010</td>
          <td>General</td>
        </tr>
        <tr>
          <td>0x00000020</td>
          <td>Networking</td>
        </tr>
        <tr>
          <td>0x00000080</td>
          <td>Event tracking</td>
        </tr>
      </tbody>
    </table>
    </div>

<hr />

#### Log Output Method settings
<div class="responsive-table">
<table>
      <thead>
        <tr>
          <th scope="col">Value</th>
          <th scope="col">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>0x00020000</td>
          <td>Log to debug out</td>
        </tr>
        <tr>
          <td>0x00040000</td>
          <td>Log to the console, if available (only when running the collector from the command line)</td>
        </tr>
        <tr>
          <td>0x00080000</td>
          <td>Log to file in `%SystemRoot%\Temp` directory</td>
        </tr>
      </tbody>
    </table>
    </div>

<hr />

> %SystemRoot% = C:\Windows\

Trace log files are located in the `%SystemRoot%\Temp` directory. For the Collector, the log files are written to `%SystemRoot%\Temp\AdtServer.log` and `%SystemRoot%\Temp\AdtSrvDll.log`. When a log file fills to capacity, the system overwrites the oldest entries with the most recent entries. Log files have a default size of 1 MB and begin to overwrite the oldest entries once they are full. 

1. To enable logging, open RegEdit navigate to the following location: \
`HKEY_LOCAL_MACHINE\Software\Policies\Microsoft\AdtAgent\Parameters`
2. Create the TraceFlags __DWORD (32-bit) Value__ and set it to __Hexadecimal__ `80003` unless otherwise advised. Trace logging begins immediately; no restart of the Collector is needed. Additionally, Change permission must be granted to `%SystemRoot%\Temp` for the __NetworkService__ account.

    > ### Note
    > For example, to log errors, warnings, and information messages to a file change the traceflags registry value to `0x00080003`. This is a combination of `0x00080000` _[file]_ and `0x00000003` _[errors +warnings+informational]_.

3. To disable logging, delete the __TraceFlags__ value or set it to `0`. 

___

## Change the scheduled time the SQL Scripts run that are in the ACS Installation Folder
In order for you to change the time the jobs will run the partitioning, grooming and reindexing. You need to edit the dtConfig table and change the __"table switch offset in seconds since midnight UTC"__ value to another time in UTC ([Google UTC Converter](https://www.google.com/search?q=UTC+Converter)):

Get current configuration:
```sql
select * from dtConfig
```

Get current SQL UTC time:
```sql
SELECT GETUTCDATE() AS 'Current UTC Time' 
```

Get 10 minutes ahead of current UTC time:
```sql
SELECT DATEADD(MINUTE, 10, GETUTCDATE())
```

Get seconds from midnight for dtConfig __"table switch offset in seconds since midnight UTC"__ ahead in seconds, in this example we add 10 minutes to the current UTC time:
```sql
Declare @d DateTime
Select @d = DATEADD(MINUTE, 10, GETUTCDATE())
Select (DatePart(HOUR, @d) * 3600) + (DatePart(MINUTE, @d) * 60) + DatePart(SECOND, @d)
```

Update configuration to midnight UTC, which is 7:00 PM (EST):
```sql
UPDATE [dbo].[dtConfig]
   SET [Value] = 0 -- Default: 25200 (2:00 AM (EST))
   WHERE [Id] = 4
GO
```

Be mindful that the is usually run overnight when there is not alot of activity in the ACS Database. So take precautions if changing this when alot of logons/logoffs are happening in your environment.

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/acs-collector-troubleshooting-tips/)

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.
-->
