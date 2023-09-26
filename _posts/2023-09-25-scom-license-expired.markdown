---
layout: post
date:   '2023-09-25 12:45:01 -0500'
title: "SCOM License Expired"
categories: troubleshooting guides operationsManager
author: blakedrumm
thumbnail: /assets/img/posts/scom-activation.png
toc: true

summary: >- # this means to ignore newlines
  I had a case today where the customer had an issue with expired license for System Center Operations Manager. This blog post goes over how we were able to fix it for them.

keywords: scom, activation, operationsmanager, SCOM activation expired, systemcenter operations manager
permalink: /blog/scom-license-expired/
---
## :book: Introduction
We attempted to activate the expired license for SCOM but we were unable due to the expiration of the product. The following errors would show when attempting to activate via PowerShell. These errors would show every time we try to activate:
```
Set-SCOMLicense : Unable to proceed with the command. Ensure you are connecting to correct Management Server and have sufficient privileges to execute the command. 
At line:1 char:1
+ Set-SCOMLicense -ManagementServer localhost -ProductId BZX70-NQZUT-SS ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : InvalidOperation: (BZX70-NQZUT-SSFEQ-7PWWZ-9ZOQC:String) [Set-SCOMLicense], InvalidOperationException
    + FullyQualifiedErrorId : InvalidOperation,Microsoft.SystemCenter.OperationsManagerV10.Commands.Commands.AdministrationCmdlets.SetSCOMLicense
```
 
 
At the same time two consecutive events are logged in the Application Log:
 
```
Log Name:      Application 
Source:        .NET Runtime
Event ID:      1026
Task Category: None
Level:         Error
Keywords:      Classic
User:          N/A
Description:
Application: MonitoringHost.exe
Framework Version: v4.0.30319
Description: The process was terminated due to an unhandled exception.
Exception Info: System.UnauthorizedAccessException
   at Microsoft.EnterpriseManagement.Common.Internal.ExceptionHandlers.HandleChannelExceptions(System.Exception)
   at Microsoft.EnterpriseManagement.Common.Internal.SdkDataLayerProxyCore.CreateEndpoint[[System.__Canon, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089]](Microsoft.EnterpriseManagement.EnterpriseManagementConnectionSettings, Microsoft.EnterpriseManagement.Common.Internal.SdkChannelObject`1<Microsoft.EnterpriseManagement.Common.Internal.IDispatcherService>)
   at Microsoft.EnterpriseManagement.Common.Internal.SdkDataLayerProxyCore.ConstructEnterpriseManagementGroupInternal[[System.__Canon, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089],[System.__Canon, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089]](Microsoft.EnterpriseManagement.EnterpriseManagementConnectionSettings, Microsoft.EnterpriseManagement.DataAbstractionLayer.ClientDataAccessCore)
   at Microsoft.EnterpriseManagement.Common.Internal.SdkDataLayerProxyCore.RetrieveEnterpriseManagementGroupInternal[[System.__Canon, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089],[System.__Canon, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089]](Microsoft.EnterpriseManagement.EnterpriseManagementConnectionSettings, Microsoft.EnterpriseManagement.DataAbstractionLayer.ClientDataAccessCore)
   at Microsoft.EnterpriseManagement.Common.Internal.SdkDataLayerProxyCore.Connect[[System.__Canon, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089],[System.__Canon, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089]](Microsoft.EnterpriseManagement.EnterpriseManagementConnectionSettings, Microsoft.EnterpriseManagement.DataAbstractionLayer.ClientDataAccessCore)
   at Microsoft.EnterpriseManagement.ManagementGroup.InternalInitialize(Microsoft.EnterpriseManagement.EnterpriseManagementConnectionSettings, Microsoft.EnterpriseManagement.ManagementGroupInternal)
   at Microsoft.EnterpriseManagement.ManagementGroup.Connect(System.String)
   at Microsoft.EnterpriseManagement.Mom.ValidateAlertSubscriptionModule.ValidateAlertSubscriptionDataSource.ValidateAlertSubscriptions(System.Object)
   at System.Threading.ExecutionContext.RunInternal(System.Threading.ExecutionContext, System.Threading.ContextCallback, System.Object, Boolean)
   at System.Threading.ExecutionContext.Run(System.Threading.ExecutionContext, System.Threading.ContextCallback, System.Object, Boolean)
   at System.Threading.TimerQueueTimer.CallCallback()
   at System.Threading.TimerQueueTimer.Fire()
   at System.Threading.TimerQueue.FireNextTimers()
```

and
 
```
Log Name:      Application 
Source:        Application Error
Event ID:      1000
Task Category: (100)
Level:         Error
Keywords:      Classic
User:          N/A
Description:
Faulting application name: MonitoringHost.exe, version: 10.19.10014.0, time stamp: 0x5c45e51b
Faulting module name: KERNELBASE.dll, version: 10.0.14393.5582, time stamp: 0x63882301
Exception code: 0xe0434352
Fault offset: 0x0000000000026ea8
Faulting process id: 0xaf4
Faulting application start time: 0x01d937237975b89c
Faulting application path: C:\Program Files\Microsoft System Center\Operations Manager\Server\MonitoringHost.exe
Faulting module path: C:\Windows\System32\KERNELBASE.dll
Report Id: 21ffc48d-66ca-4aab-9967-47b2201d498f
Faulting package full name: 
Faulting package-relative application ID: 
```

---

## :page_with_curl: How to fix it
Follow the below steps to allow you to fix the Activation issue:
1. Run the following PowerShell script on your Management Server to unregister the Time Service, set the date 48 hours ahead of the date SCOM was installed on the Management Server, and finally restarting the SCOM services.
    ```powershell
    # Unregister the Time Service
    W32tm /unregister

    # Set the Operating System date 48 hours ahead of the InstalledOn date that is in the registry
    Set-Date ([DateTime]::ParseExact($((Get-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Microsoft Operations Manager\3.0\Setup').InstalledOn), 'M/d/yyyy-HH:mm:ss', $null).AddHours(48))

    # Restart the SCOM Services (System Center Data Access Service, System Center Management Configuration, Microsoft Monitoring Agent)
    Restart-Service omsdk, cshost, healthservice
    ```
2. Verify the time has been changed.
3. Open the SCOM Console and navigate to the top of the Console window, click on **Help** -> **About** \
   ![SCOM Console Help -> About](/assets/img/posts/scom-console-help.png){:class="img-fluid"}
4. Click on Activate and type in your License key: \
   ![SCOM Console Activation - Help -> About](/assets/img/posts/scom-activation.png){:class="img-fluid"} \
   ![SCOM Console Activation - Activation Window](/assets/img/posts/scom-activation-button.png){:class="img-fluid"}
5. Accept the license agreement: \
   ![SCOM Console Activation Agreement](/assets/img/posts/scom-activation-license-agreement.png){:class="img-fluid"}
6. Successfully activated! \
   ![SCOM Console Activation Successful](/assets/img/posts/scom-activation-licensed-successfully.png){:class="img-fluid"}

6. Register the Time Service to revert the changes made above, close the SCOM Console, and finally restart the SCOM SDK Service (System Center Data Access Service):
   ```powershell
   # Register the Time Service
   W32tm /register

   # Close the SCOM Console
   Stop-Process -Name Microsoft.EnterpriseManagement.Monitoring.Console -Force
   
   # Restart the SCOM SDK Service
   Restart-Service omsdk
   ```
7. Open the SCOM Console and verify if you go to **Help** -> **About**. Do you see **(Eval)** in the Console version? \
   If you see **(Retail)** (as shown below), you are activated! :sun_behind_small_cloud: \
   ![SCOM Console Activation Successful](/assets/img/posts/scom-activation-activated.png){:class="img-fluid"}


![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/scom-license-expired/)

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
