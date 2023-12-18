---
layout: post
date:   '2023-10-31 17:54:02 -0500'
title:  "SCOM Scheduled Reports Fail with PerfConnectionString or StateConnectionString Error"
categories: troubleshooting guides operationsManager
author: blakedrumm
thumbnail: /assets/img/posts/scom-reports-perfconnection-error.png
toc: true

summary: >-
  This article explains how to resolve the 'PerfConnectionString' or 'StateConnectionString' error that occurs when running scheduled reports in SCOM 2016, 2019, or 2022.

keywords: scom, perfconnectionstring error, stateconnectionstring error, scheduled reports fail, scom 2016, scom 2019, scom 2022
permalink: /blog/scheduled-reports-perfconnection-error/
---

## :warning: Symptoms

In SCOM 2016, 2019, or 2022, scheduled reports fail to run. If you check report status by opening the Scheduled Reports view in the Operations Console, the status message says, “Default value or value provided for the report parameter 'PerfConnectionString' is not a valid value.” or “Default value or value provided for the report parameter 'StateConnectionString' is not a valid value.”

## :bulb: Cause

This can occur if the `<appSettings>` element is missing from the SQL Server Reporting Services (SSRS) configuration file.

By default, this configuration file is in the following folder on the SCOM Reporting server:

`C:\Program Files\Microsoft SQL Server Reporting Services\SSRS\ReportServer\bin\ReportingServicesService.exe.config`

The issue described in the Symptoms section occurs when the below element is missing from the configuration file:

   ```xml
  <appSettings>
  	<add key="ManagementGroupId" value="management_group_GUID"/>
  </appSettings>
   ```

## :wrench: Resolution

### PowerShell Automatic Method

---

#### What Does This PowerShell Script Do?

This script automates the process of configuring SQL Server Reporting Services (SSRS) in a System Center Operations Manager (SCOM) environment. Below are the key steps:

##### Step 1: Gather System Information
- **Fetch SSRS Info**: Gathers essential details about the SSRS installation using Windows Management Instrumentation (WMI).
- **Fetch SCOM Info**: Retrieves System Center Operations Manager Data Warehouse database settings from the Windows registry.

##### Step 2: Fetch Management Group ID
- **SQL Connection**: Establishes a connection to the System Center Operations Manager Data Warehouse database.
- **Fetch ID**: Executes a SQL query to obtain the Management Group ID.

##### Step 3: Locate and Check the Configuration File
- **Locate Config**: Determines the path of the SSRS configuration file (`ReportingServicesService.exe.config`).
- **Check Config**: Checks if the configuration file already contains the correct Management Group ID.

##### Step 4: Update Configuration
- **Backup Config**: Creates a backup of the original configuration file.
- **Update Config**: If necessary, updates the SSRS configuration file with the new Management Group ID.

##### Step 5: Finalize Changes
- **Save Changes**: Saves the updated configuration.
- **Restart Service**: Restarts the SSRS service to apply the changes.

---

1. Run the following script on your System Center Operations Manager Reporting Server. Be sure the PowerShell window is opened as Administrator and you have rights to query the Operations Manager Data Warehouse Database:
    ```powershell
    #Author: Blake Drumm (blakedrumm@microsoft.com)
    #Date Created: 10/31/2023
    $error.Clear()
    try
    {
    	$RS = "root\Microsoft\SqlServer\ReportServer\" + (Get-CimInstance -Namespace root\Microsoft\SqlServer\ReportServer -ClassName __Namespace -ErrorAction Stop | Select-Object -First 1).Name
    	$RSV = $RS + "\" + (Get-CimInstance -Namespace $RS -ClassName __Namespace -ErrorAction Stop | Select-Object -First 1).Name + "\Admin"
    	$RSInfo = Get-CimInstance -Namespace $RSV -ClassName MSReportServer_ConfigurationSetting -ErrorAction Stop
    	
    	# Output or use $RSInfo as needed
    	$SSRSConfigPath = $RSInfo.PathName
    	
    	$DWDBInfo = Get-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\System Center Operations Manager\12\Reporting' -ErrorAction Stop | Select-Object DWDBInstance, DWDBName
    	
    }
    catch
    {
    	Write-Host "An error occurred: $error" -ForegroundColor Red
    	return
    }
    
    # User-defined SQL Server Instance for the Operations Manager database
    $SQLInstance = $DWDBInfo.DWDBInstance
    $DatabaseName = $DWDBInfo.DWDBName
    
    # Get the Management Group ID using SQL query
    $connectionString = "Server=$SQLInstance;Database=$DatabaseName;Integrated Security=True;"
    $connection = New-Object System.Data.SqlClient.SqlConnection
    $connection.ConnectionString = $connectionString
    $connection.Open()
    
    $command = $connection.CreateCommand()
    $command.CommandText = "SELECT ManagementGroupGuid from vManagementGroup"
    $reader = $command.ExecuteReader()
    
    $managementGroupId = $null
    if ($reader.Read())
    {
    	$managementGroupId = $reader["ManagementGroupGuid"]
    }
    $reader.Close()
    $connection.Close()
    
    # Check if we got the Management Group ID
    if ($null -eq $managementGroupId)
    {
    	Write-Host "Failed to get Management Group ID." -ForegroundColor Red
    	return
    	#exit 1
    }
    
    $SSRSParentDirectory = Split-Path $SSRSConfigPath
    
    $error.Clear()
    try
    {
    	# Path to ReportingServicesService.exe.config
    	$configPath = (Resolve-Path "$SSRSParentDirectory\bin\ReportingServicesService.exe.config" -ErrorAction Stop).Path
    }
    catch
    {
    	Write-Warning "Unable to access '$SSRSParentDirectory\bin\ReportingServicesService.exe.config' : $error"
    	return
    	#exit 1
    }
    # Load the XML content of the config file
    [xml]$configXml = Get-Content -Path $configPath
    
    # Check if the appSettings element already exists and has the correct ManagementGroupId
    $appSettings = $configXml.SelectSingleNode("/configuration/appSettings/add[@key='ManagementGroupId']")
    if ($null -ne $appSettings -and $appSettings.GetAttribute("value") -eq $managementGroupId)
    {
    	Write-Host "Configuration is already up to date." -ForegroundColor Green
    	return
    	#exit 0
    }
    
    # Create a backup of the existing config file
    Copy-Item -Path $configPath -Destination "$configPath.bak"
    
    # Update or create the appSettings element
    if ($null -ne $appSettings)
    {
    	$appSettings.SetAttribute("value", $managementGroupId)
    }
    else
    {
    	$appSettings = $configXml.CreateElement("appSettings")
    	$addKey = $configXml.CreateElement("add")
    	$addKey.SetAttribute("key", "ManagementGroupId")
    	$addKey.SetAttribute("value", $managementGroupId)
    	$appSettings.AppendChild($addKey)
    	$configXml.SelectSingleNode("/configuration").AppendChild($appSettings)
    }
    
    # Save the modified XML back to the config file
    $configXml.Save($configPath)
    
    # Restart the SQL Server Reporting Services service
    Restart-Service -Name $RSInfo.ServiceName
    
    Write-Host "Configuration updated successfully." -ForegroundColor Green
    ```

### Manual Method
To resolve the issue, edit the SSRS configuration file to add a valid `<appSettings>` element.

The following are the steps:

1. On any computer that has the SCOM Operations Console installed, run the following PowerShell commands to get the management group ID:

   ```powershell
   Import-Module OperationsManager
   (Get-SCOMManagementGroup).id.guid
   ```

2. Create a copy of the existing `ReportingServicesService.exe.config` file. By default, this file is in the following folder on the SCOM Reporting server:

   `C:\Program Files\Microsoft SQL Server Reporting Services\SSRS\ReportServer\bin\ReportingServicesService.exe.config`

3. Open the `ReportingServicesService.exe.config` file in a text editor.
4. Add the following element to the file immediately before the closing `</configuration>` tag:

   ```xml
    <appSettings>
      <add key="ManagementGroupId" value="management_group_GUID"/>
    </appSettings>
   ```

   In the above XML, replace `management_group_GUID` with the management group ID you obtained in Step 1.

   For example, the element will look like the following:

    ```xml
    <startup useLegacyV2RuntimeActivationPolicy="true">
    	<supportedRuntime version="v4.0"/>
    </startup>
    <appSettings>
    	<add key="ManagementGroupId" value="7f263180-e7d2-9c12-a1cd-0c6c54a7341c"/>
    </appSettings>
    </configuration>
    ```

5. Save the configuration file.
6. Restart the SQL Server Reporting Services service.

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/scheduled-reports-perfconnection-error/)

<!--
## Welcome to GitHub Pages

You can use the [editor on GitHub](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/edit/master/docs/index.md) to maintain and preview the content for your website in Markdown files.

Whenever you commit to this repository, GitHub Pages will run [Jekyll](https://jekyllrb.com/) to rebuild the pages in your site, from the content in your Markdown files.

### Markdown

Markdown is a lightweight and easy-to-use syntax for styling your writing. It includes conventions for

```markdown
Syntax highlighted code block

# Header 1
## Header 2
### Header 3

- Bulleted
- List

1. Numbered
2. List

**Bold** and _Italic_ and `Code` text

[Link](url) and ![Image](src)
```

For more details see [GitHub Flavored Markdown](https://guides.github.com/features/mastering-markdown/).

### Jekyll Themes

Your Pages site will use the layout and styles from the Jekyll theme you have selected in your [repository settings](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/settings/pages). The name of this theme is saved in the Jekyll `_config.yml` configuration file.

### Support or Contact

Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.

Tip:
To add auto-size pictures:
![/assets/img/posts/example.jpg](/assets/img/posts/example.jpg){:class="img-fluid"}
-->
