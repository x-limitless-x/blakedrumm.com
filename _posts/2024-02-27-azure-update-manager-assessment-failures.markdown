---
layout: post
title:  "Assessment Failures - Azure Update Manager"
date:   '2024-02-27 12:24:13 -0500'
categories: troubleshooting azure
author: blakedrumm
thumbnail: /assets/img/posts/example-error-azure-update-manager-assessment.png
toc: true

summary: 'This guide shows you how to potentially fix an issue I stumbled on today with Azure Update Manager and assessments on machines connected.'

keywords: azure update manager, 
permalink: /blog/azure-update-manager-assessment-failures/
---
 
## :bulb: Introduction
I had a case today where Azure Update Manager was showing errors regarding checks for assessments, upon checking the Windows Updates installed on the machine we noticed the updates were successfully installed.

### :x: Error text
<pre style="white-space: pre-wrap;">
Assessment failed due to this reason: "1 errors reported. The latest 100 errors are shared in details. To view all errors, review this log file on the machine:[C:\ProgramData\GuestConfig\extension_logs\Microsoft.CPlat.Core.WindowsPatchExtension] "["Windows update API failed to assess the machine for available updates. Error:Exception from HRESULT: 0x80244022, Hresult:0" at UpdateManagementAction.concrete.UpdateAssessment.GetAvailableUpdates() at UpdateManagementAction.concrete.AssessmentAction.Assess(UpdateManagementResultSummary updateActionResultSummary)]." "["Windows update API failed to assess the machine for available updates. <span style="color:yellow">Error:Exception from HRESULT: 0x80244022</span>, Hresult:0" at UpdateManagementAction.concrete.UpdateAssessment.GetAvailableUpdates() at UpdateManagementAction.concrete.AssessmentAction.Assess(UpdateManagementResultSummary updateActionResultSummary)]."
</pre>

## :mag: Cause
The above error exception is saying the following:

| Hexadecimal Error Code | Decimal Error Code | Symbolic Name | Error Description                                   | Header   |
|------------------|------------------|---------------|----------------------------------------------------|----------|
| 0x80244022       | -2145107934      | WU_E_PT_HTTP_STATUS_SERVICE_UNAVAIL | Same as HTTP status 503 - the service is temporarily overloaded. | wuerror.h |

The issue above in my customers circumstance was due to the following registry key being present: \
**HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU**

Specifically this key was changed to `1` which needed to be `0` in order to utilize Microsoft Updates:

| Entry name | Data type | Values |
|------------|-----------|--------|
|UseWUServer | Reg_DWORD | 1 = The computer gets its updates from a WSUS server. |
|            |           | 0 = The computer gets its updates from Microsoft Update. |
|            |           | The WUServer value is not respected unless this key is set. |


More information on the registry keys for Automatic Updates and WSUS: \
[https://learn.microsoft.com/windows/deployment/update/waas-wu-settings#configuring-automatic-updates-by-editing-the-registry](https://learn.microsoft.com/windows/deployment/update/waas-wu-settings#configuring-automatic-updates-by-editing-the-registry) \
[https://github.com/vFense/vFenseAgent-win/wiki/Registry-keys-for-configuring-Automatic-Updates-&-WSUS](https://github.com/vFense/vFenseAgent-win/wiki/Registry-keys-for-configuring-Automatic-Updates-&-WSUS)

## :wrench: Resolution
Modifying the registry key above (**UseWUServer**) registry key to **0** instead of **1** allowed us to successfully utilize Azure Update Manager.

### :computer: PowerShell Script
```powershell
# The following code will allow you to set the UseWUServer registry key to 0
# Which allows you to utilize Microsoft Updates instead of Software Update Services (WSUS)
Set-ItemProperty -Name UseWUServer -Value 0 -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU"
```

![Example showing how the registry should look](/assets/img/posts/wsus-registry-key.png)

Leave some feedback if this helped you! :v:

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/azure-update-manager-assessment-failures/)

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.

Tip:
To add auto-size pictures:
![/assets/img/posts/example.jpg](/assets/img/posts/example.jpg){:class="img-fluid"}
-->
