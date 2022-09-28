---
layout: post
title:  "Data Reader account provided is not same as that in the management group"
date:   '2022-09-19 15:16:32 -0500'
categories: troubleshooting operationsManager
author: blakedrumm
thumbnail: /assets/img/posts/opsmgr-setup-data-reader-account-issue.jpg

summary: >- # this means to ignore newlines
  From my colleagues, this post details how to resolve an issue you may experience while installing the Reporting Services.

keywords: data reader account error, scom setup error, scom setup reporting error, opsmgr reporting error
permalink: /blog/data-reader-account-provided-is-not-same-as-that-in-the-management-group/
---
<sub>Thank you to Luis Décio for the original creation of the KB!</sub>

During installation of SCOM Reporting services, you may see the following error:
Data Reader account provided is not same as that in the management group.

## How to fix
### Reconfigure the "Data Warehouse Report Deployment Account" Profile
Set the Data Warehouse Report Deployment Account to the Class "Collection Server" and "Data Warehouse Synchronization Server"

![/assets/img/posts/dw-report-deployment-account-profile.png](/assets/img/posts/dw-report-deployment-account-profile.png){:class="img-fluid"}

 
 
### Reconfigure the "Data Warehouse Account" Profile
Data Warehouse Action Account to the Class "Collection Server", "Data Warehouse Synchronization Server", "Data Set" and "Operations Manager APM Data Transfer Service"

![/assets/img/posts/data-warehouse-account-profile.jpg](/assets/img/posts/data-warehouse-account-profile.jpg){:class="img-fluid"}


 After configuring the above, the SCOM Reporting component installed successfully with the **Data Warehouse Report Deployment Account** as expected.

## Automate with Powershell

You can use Powershell to automate fixing the DW RunAs Profiles. I would suggest that you remove all RunAs accounts from both RunAs profiles ("Data Warehouse Account" and "Data Warehouse Report Deployment Account") prior to running the below Powershell script.

**Blog post from Udish Mudiar:** [https://udishtech.com/associate-scom-data-warehouse-profile-using-powershell/](https://udishtech.com/associate-scom-data-warehouse-profile-using-powershell/)

Here is my own take on Udish's Powershell script:
```powershell
function Invoke-TimeStamp
{
	$TimeStamp = (Get-Date).DateTime
	return "$TimeStamp - "
}

#Associate  Run As Account association in Data Warehouse and Report Deployment Run As Profile.
Write-Output "$(Invoke-TimeStamp)Set DW RunAs Profile Script Started"

Import-Module OperationsManager

#Get the run as profiles
$DWActionAccountProfile = Get-SCOMRunAsProfile -DisplayName "Data Warehouse Account"
$ReportDeploymentProfile = Get-SCOMRunAsProfile -DisplayName "Data Warehouse Report Deployment Account"

#Get the run as accounts
$DWActionAccount = Get-SCOMrunAsAccount -Name "Data Warehouse Action Account"
$DWReportDeploymentAccount = Get-SCOMrunAsAccount -Name "Data Warehouse Report Deployment Account"

#Get all the required classes
$CollectionServerClass = Get-SCOMClass -DisplayName "Collection Server"
$DataSetClass = Get-SCOMClass -DisplayName "Data Set"
$APMClass = Get-SCOMClass -DisplayName "Operations Manager APM Data Transfer Service"
$DWSyncClass = Get-SCOMClass -DisplayName "Data Warehouse Synchronization Server"

#Setting the association
Write-Output "$(Invoke-TimeStamp)Setting the Run As Account Association for Data Warehouse Account Profile"
try
{
	Set-SCOMRunAsProfile -ErrorAction Stop -Action "Add" -Profile $DWActionAccountProfile -Account $DWActionAccount -Class $CollectionServerClass, $DataSetClass, $APMClass, $DWSyncClass
	Write-Output "$(Invoke-TimeStamp)   Completed Successfully!"
}
catch
{
	Write-Output "$(Invoke-TimeStamp)   Unable to set the RunAs accounts, try removing all accounts from inside the RunAs Profile (`"Data Warehouse Account`"), and run the script again.`n"
}
Write-Output "$(Invoke-TimeStamp)Setting the Run As Account Association for Data Warehouse Report Deployment Account Profile"
try
{
	Set-SCOMRunAsProfile -ErrorAction Stop -Action "Add" -Profile $ReportDeploymentProfile -Account $DWReportDeploymentAccount -Class $CollectionServerClass, $DWSyncClass
	Write-Output "$(Invoke-TimeStamp)   Completed Successfully!"
}
catch
{
	Write-Output "$(Invoke-TimeStamp)   Unable to set the RunAs accounts, try removing all accounts from inside the RunAs Profile (`"Data Warehouse Report Deployment Account`"), and run the script again."
}

Write-Output "$(Invoke-TimeStamp)Script ended"
```


![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/data-reader-account-provided-is-not-same-as-that-in-the-management-group/)

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.
-->
