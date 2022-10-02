---
layout: post
title:  "Event 26319 - Assembly Trust Issues with SQL 2017+"
date:   '2022-08-05 16:00:21 -0500'
categories: troubleshooting guides operationsManager
author: blakedrumm
thumbnail: /assets/img/posts/event-26319-error-assembly-trust-issues.png

summary: >- # this means to ignore newlines
  This article describes how to resolve an error regarding Assembly Trust Issues you may notice when opening the SCOM Console.

keywords: resolve 26319, scom management server assembly trust issue, event 26319, assembly id 65537, unable to open scom console
permalink: /blog/event-26319-assembly-trust-issues/
---
<sub>Thank you to Lorne Sepaugh for the original creation of the KB!</sub>

## Symptom
I had a customer today that had an issue with being unable to open any SCOM Console without receiving the following error:
```
Date: 6/8/2022 1:57:24 AM
Application: Operations Manager
Application Version: 10.19.10505.0
Severity: Error
Message: 

An error occurred in the Microsoft .NET Framework while trying to load assembly id 65537. The server may be running out of resources, or the assembly may not be trusted. Run the query again, or check documentation to see how to solve the assembly trust issues. For more information about this error: 
System.IO.FileLoadException: Could not load file or assembly 'microsoft.enterprisemanagement.sql.userdefineddatatype, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null' or one of its dependencies. An error relating to security occurred. (Exception from HRESULT: 0x8013150A)
System.IO.FileLoadException: 
   at System.Reflection.RuntimeAssembly._nLoad(AssemblyName fileName, String codeBase, Evidence assemblySecurity, RuntimeAssembly locationHint, StackCrawlMark& stackMark, IntPtr pPrivHostBinder, Boolean throwOnFileNotFound, Boolean forIntrospection, Boolean suppressSecurityChecks)
   at System.Reflection.RuntimeAssembly.InternalLoadAssemblyName(AssemblyName assemblyRef, Evidence assemblySecurity, RuntimeAssembly reqAssembly, StackCrawlMark& stackMark, IntPtr pPrivHostBinder, Boolean throwOnFileNotFound, Boolean forIntrospection, Boolean suppressSecurityChecks)
   at System.Reflection.RuntimeAssembly.InternalLoad(String assemblyString, Evidence assemblySecurity, StackCrawlMark& stackMark, IntPtr pPrivHostBinder, Boolean forIntrospection)
   at System.Reflection.RuntimeAssembly.InternalLoad(String assemblyString, Evidence assemblySecurity, StackCrawlMark& stackMark, Boolean forIntrospection)
   at System.Reflection.Assembly.Load(String assemblyString)
```

This error is due to a change in the SQL 2017 security approach for CLR, as stated in the SQL Server 2017 docs: \
![CLR SQL 2017 documentation highlight](/assets/img/posts/clr-sql-2017-security-approach.png){:class="img-fluid"}
 
There are two assemblies used by SCOM that are marked as _UNSAFE_ and not allowed to run by default in one of these scenarios - as such we need to mark them as safe and trusted on each server instance. The assemblies are: 
 - Microsoft.EnterpriseManagement.SQL.DataAccessLayer 
 - Microsoft.EnterpriseManagement.SQL.UserDefinedDataType 

## How to Resolve
### Prerequisites 
 
__*If using availability groups, this is to be completed after the databases are added__
 
 - Ensure that CLR is enabled on all SQL Server instances with this script:
```sql
Sp_configure 'show advanced options', 1; 
GO 
RECONFIGURE; 
GO 
Sp_configure 'clr enabled', 1; 
GO 
RECONFIGURE; 
GO
```
 
 - Make sure that you have SQL admin access, or a DBA on hand 
 - (Optional) Stop all the SCOM services on each management server - don't forget to restart when finished 
 - Make sure you have a database backup 
 
 
### Step 1: Verify CLR Strict Security State 
Run this query in SQL Management Studio:
```sql
SELECT * FROM sys.configurations WHERE name LIKE 'clr strict security'; 
```

You should get a return like this, "value_in_use" and "value" should be 1: \
![Example showing sys.configurations value_in_use](/assets/img/posts/clr-value-in-use.png){:class="img-fluid"}
 
This table describes what the values mean:

| Value | Description |
|---|---|
| 0 | Disabled - Provided for backwards compatibility. Disabled value is not recommended |
| 1 | Enabled - Causes the Database Engine to ignore the PERMISSION_SET information on the assemblies, and always interpret them as UNSAFE. Enabled is the default value for SQL Server 2017 (14.x) |

&nbsp;

> ### Note
> By default, CLR strict security will be __OFF__ after upgrading to SQL Server 2017
 
If the value is 0 - check this doc for more info on how to set it to 1 - [https://docs.microsoft.com/sql/database-engine/configure-windows/clr-strict-security?view=sql-server-2017](https://docs.microsoft.com/sql/database-engine/configure-windows/clr-strict-security?view=sql-server-2017)
 

### Step 2: Create the Trusted Assemblies
To create the Trusted Assemblies, run the below TSQL Query on each SQL 2017+ instance(s) hosting the Operations Manager Database: 
```sql
USE master;
GO

-- First Trusted Assembly
DECLARE @clrName1 nvarchar(4000) = 'Microsoft.EnterpriseManagement.Sql.DataAccessLayer'
PRINT N'Trusted Assembly: ' + CAST(@clrName1 AS nvarchar(120))
DECLARE @hash1 varbinary(64) = 0xEC312664052DE020D0F9631110AFB4DCDF14F477293E1C5DE8C42D3265F543C92FCF8BC1648FC28E9A0731B3E491BCF1D4A8EB838ED9F0B24AE19057BDDBF6EC;

-- Drop trusted assembly if exists
IF EXISTS (select * from sys.trusted_assemblies where description = @clrName1)
BEGIN
PRINT N' - Dropping Trusted Assembly'
EXEC SYS.sp_drop_trusted_assembly @hash1
END

--Add to trusted assembly
PRINT N' - Adding Trusted Assembly'
EXEC sys.sp_add_trusted_assembly @hash = @hash1,
                                 @description = @clrName1;

PRINT N' '
-- Second Trusted Assembly
DECLARE @clrName2 nvarchar(4000) = 'Microsoft.EnterpriseManagement.Sql.UserDefinedDataType'
PRINT N'Trusted Assembly: ' + CAST(@clrName2 AS nvarchar(120))
DECLARE @hash2 varbinary(64) = 0xFAC2A8ECA2BE6AD46FBB6EDFB53321240F4D98D199A5A28B4EB3BAD412BEC849B99018D9207CEA045D186CF67B8D06507EA33BFBF9A7A132DC0BB1D756F4F491;

-- Drop trusted assembly if exists
IF EXISTS (select * from sys.trusted_assemblies where description = @clrName2)
BEGIN
PRINT N' - Dropping Trusted Assembly'
EXEC SYS.sp_drop_trusted_assembly @hash2
END

--Add to trusted assembly
PRINT N' - Adding Trusted Assembly'
EXEC sys.sp_add_trusted_assembly @hash = @hash2,
                                 @description = @clrName2;
```

You can verify the currently trusted assemblies with the following query:
```sql
USE OperationsManager;
GO
SELECT * FROM sys.assemblies
SELECT * FROM sys.trusted_assemblies
```

Once done on all SQL Server instance(s) that host the Operations Manager Database, restart the SCOM Console on the management servers and everything should load correctly.

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/event-26319-assembly-trust-issues/){:class="img-fluid"}

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.

Tip:
To add auto-size pictures:
![/assets/img/posts/example.jpg](/assets/img/posts/example.jpg){:class="img-fluid"}
-->
