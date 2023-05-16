---
layout: post
title:  "SCOM ACS Collector Troubleshooting Tips"
date:   '2022-01-24 20:22:16 -0500'
categories: troubleshooting guides operationsManager
author: blakedrumm
thumbnail: /assets/img/posts/system-center-operations-manager-acs.png
toc: true

summary: >- # this means to ignore newlines
  Tips for troubleshooting System Center Operations Manager Audit Collection Services issues.

keywords: audit collection services, scom 2019 acs, scom acs troubleshooting, opsmgr acs, scom acs, scom acs slow inserts, scom audit collection services
permalink: /blog/acs-collector-troubleshooting-tips/
---
A customer of mine was having problems with Audit Collection Services in SCOM 2019 UR3. I figured this information may prove helpful someday to someone. Enjoy!
 
----
 
## SQL Queries
Here are some ACS SQL Queries you can utilize: \
[https://github.com/blakedrumm/SCOM-Scripts-and-SQL/tree/master/SQL%20Queries/OperationsManagerAC](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/tree/master/SQL%20Queries/OperationsManagerAC)

----

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

Be mindful that the scripts are usually run overnight when there is not alot of activity in the ACS Database. So take precautions if changing this when alot of logons/logoffs are happening in your environment.

----

## Set filter for ACS Data
1. On the ACS server, Go to the registry: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services\AdtServer\Parameters`
2. Right click the key Parameters, select Permissions
3. Select the row “Network service”
4. Click edit
5. Set “Apply to” as “This key and subkeys”
6. Select Full control in the column Allow, click OK
7. Run **CMD** as an **Administrator**
8. Run the below command:
   ```
   cd C:\Windows\System32\Security\AdtServer
   ```
9. Run the below command to check current query we being used by SCOM ACS. (*There should be a no filter clause to exclude the collected event*):
   ```
   adtadmin –getquery
   ```
10. Run the following command to add filter for the collected events:
    ```
    adtadmin /setquery /query:"SELECT * FROM AdtsEvent WHERE NOT (EventID=528 or EventID=540 or EventID=680)”
    ```
> ### Note
> Change the event IDs to the events you don't want collected. See the below example for a basic filter. Since every environment has its own concerns, please double check which events can be ignored to reduce data collection amount. 
> ```
> adtadmin /setquery /query:"SELECT * FROM AdtsEvent WHERE NOT (((EventId=528 AND String01='5') OR (EventId=576 AND (String01='SeChangeNotifyPrivilege' OR HeaderDomain='NT Authority')) OR (EventId=538 OR EventId=566 OR EventId=672 OR EventId=680)))"
> ```

----

## Install ACS from Command Line
In order to install the ACS Collector from the command line you are required to provide an XML, this an example of the XML that is required:
```xml
<?xml version="1.0" encoding="utf-8" ?>

<InstallationOptions>

  <AcsCollector>

    <!-- Interval (in seconds) between heartbeats. -->
   <HeartBeatInterval>60</HeartBeatInterval>

    <!-- Number of failed heart beats before collector
             disconnects the forwarder. -->
    <HeartBeatFailedCount>3</HeartBeatFailedCount>

    <!-- Time (in seconds) to wait before disconnecting forwarders
             which have not yet sent the initial data packet on a
             new connection. -->
    <ConnectNoDataThreshold>10</ConnectNoDataThreshold>

    <!-- The TCP port on which the collector should listen
             for forwarder connections. -->
    <AdtAgentPort>51909</AdtAgentPort>

    <!-- Maximum length of database queue. This value will be
             rounded up to a power of two if necessary. -->
    <MaximumQueueLength>0x40000</MaximumQueueLength>

    <!-- Lower bound (in seconds) of randomly chosen backoff
             time sent to agent if the collector is overloaded. -->
    <BackOffMinTime>120</BackOffMinTime>

    <!-- Upper bound (in seconds) of randomly chosen backoff
             time sent to agent if the collector is overloaded. -->
    <BackOffMaxTime>480</BackOffMaxTime>

    <!-- (percentage of max queue length) -->
   <BackOffThreshold>50</BackOffThreshold>

    <!-- (percentage of max queue length) -->
   <DisconnectThreshold>75</DisconnectThreshold>

    <!-- Asset value new agents get assigned.
             -1 means they get the value of their group instead. -->
    <DefaultAssetValue>-1</DefaultAssetValue>

    <!-- Group ID of the group new agents get assigned to. -->
   <DefaultGroup>0</DefaultGroup>

    <!-- Number of simultaneous database connections to use
             for event insertion. -->
    <DbEventConnections>8</DbEventConnections>

    <!-- Number of simultaneous database connections to use
             for string insertion. -->
    <DbStringConnections>8</DbStringConnections>

    <!-- Minimum asset value required in order to report 
             application log events regarding an agent. -->
    <ReportThreshold>1</ReportThreshold>

    <!-- Minimum asset value required in order to store events
             from an agent. -->
    <StoreThreshold>1</StoreThreshold>

    <!-- (seconds) -->
   <CheckPointInterval>198</CheckPointInterval>

    <!-- (seconds) -->
   <PurgingInterval>198</PurgingInterval>

    <!-- If running in grooming mode, the collector only kicks
             off a grooming cycle if the database queue has at most
             MaxPurgingQueue entries. -->
    <MaxPurgingQueue>500</MaxPurgingQueue>

    <!-- 0 = Event timestamps will be reported in UTC.
         1 = Event timestamps will be reported in local time. -->
    <ConvertToLocalTime>1</ConvertToLocalTime>

    <!-- Size (in bytes) of memory to use for caching principal data. -->
   <PrincipalCacheSize>0x8000</PrincipalCacheSize>

    <!-- Size (in bytes) of memory to use for caching string data. -->
   <StringCacheSize>0x20000</StringCacheSize>

    <!-- Time, in seconds, to backoff unwanted agents -->
   <BackOffUnwanted>21600</BackOffUnwanted>

    <!-- Maximum time (in minutes) a connection can exist before it
             gets disconnected for rekeying purposes. -->
    <TlsRekeyInterval>600</TlsRekeyInterval>

    <!-- -->
   <AcceptSockets>4</AcceptSockets>

    <!-- Time, in seconds, before a new connection gets
             disconnected if the client doesn't send any data -->
    <MaxAcceptIdle>15</MaxAcceptIdle>

    <!-- Time, in seconds, before a connection attempt times out -->
   <MaxConnectIdle>15</MaxConnectIdle>

    <!-- Interval (in seconds) between recalculation of queue
             statistics. -->
    <MinUpdateInterval>21</MinUpdateInterval>

    <!-- Name of ODBC data source -->
   <DataSource>acs</DataSource>

    <!-- 0 = SQL Server runs on a different machine
         1 = SQL Server runs on collector machine -->
    <DbServerLocal>1</DbServerLocal>

    <!-- Name of machine running SQL Server -->
   <DbServerName>acs-sql</DbServerName>

    <!-- Name of SQL Server instance to use. Usually blank. -->
   <DbServerInstance></DbServerInstance>

    <!-- Name of collector database -->
   <DbName>OperationsManagerAC</DbName>

    <!-- 0 = Specified data and log directories will be used.
         1 = SQL Server's data and log directories will be used. -->
    <UseDefaultPaths>1</UseDefaultPaths>

    <!-- Path (on DB server) where data file should be created
             Necessary only if UseDefaultPaths is set to 0 -->
    <DataFilePath>d:\acsdata</DataFilePath>

    <!-- Initial data file size in MB -->
   <DbDataFileInitialSize>1024</DbDataFileInitialSize>

    <!-- Maximum data file size in MB, 0 means unlimited -->
   <DbDataFileMaximumSize>65536</DbDataFileMaximumSize>

    <!-- File growth amount in MB -->
   <DbDataFileIncrementSize>1024</DbDataFileIncrementSize>

    <!-- Path (on DB server) where log file should be created.
             Necessary only if UseDefaultPaths is set to 0 -->
    <LogFilePath>e:\acslog</LogFilePath>

    <!-- Initial log file size in MB -->
   <DbLogFileInitialSize>128</DbLogFileInitialSize>

    <!-- Maximum log file size in MB, 0 means unlimited -->
   <DbLogFileMaximumSize>4096</DbLogFileMaximumSize>

    <!-- File growth amount in MB -->
   <DbLogFileIncrementSize>128</DbLogFileIncrementSize>

    <!-- (hours) time to keep events -->
   <EventRetentionPeriod>24</EventRetentionPeriod>

    <!-- Number of partitions to use -->
   <PartitionCount>1</PartitionCount>

    <!-- Time when partition switching should occur.
             Expressed in seconds since midnight in UTC -->
    <PartitionSwitchOffset>0</PartitionSwitchOffset>

    <!-- Type of authentication collector should use
             when connecting to the database:
             0 = Use SQL authentication (not recommended)
             1 = Use Windows authentication (recommended) -->
    <UseWindowsAuth>1</UseWindowsAuth>

   <!-- only necessary when using SQL authentication -->
   <DbUser>SampleAdtServerDbUser</DbUser>

    <!-- only necessary when using SQL authentication -->
   <DbPassword>SampleAdtServerDbPwd</DbPassword>

  </AcsCollector>

</InstallationOptions>
```


![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/acs-collector-troubleshooting-tips/)

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.

Tip:
To add auto-size pictures:
![/assets/img/posts/example.jpg](/assets/img/posts/example.jpg){:class="img-fluid"}
-->
