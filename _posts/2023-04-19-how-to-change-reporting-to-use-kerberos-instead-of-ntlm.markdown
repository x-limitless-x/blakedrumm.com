---
layout: post
title:  "How to change SQL Server Reporting Services to use Kerberos instead of NTLM"
date:   '2023-04-19 13:28:09 -0500'
categories: troubleshooting guides operationsManager
author: blakedrumm
thumbnail: /assets/img/posts/sql-server-reporting-services.png
toc: true

summary: >- # this means to ignore newlines
  This article shows you how to change SSRS to use Kerberos instead of NTLM.

keywords: scom reporting, ssrs ntlm, ssrs kerberos, reporting ntlm, reporting kerberos
permalink: /blog/how-to-change-reporting-to-use-kerberos-instead-of-ntlm/
---

I had a customer ask if SCOM Reporting requires NTLM or not. So when I started digging for information on this, I found this blog post showing how to change SSRS to use Kerberos instead of NTLM:
[How to change SCOM reporting to use Kerberos instead of NTLM - Cloud management at your fingertips (mscloud.be)](https://mscloud.be/systemcenter/uncategorized/how-to-change-scom-reporting-to-use-kerberos-instead-of-ntlm-2/)

I found that the article is missing some screenshots and seems to no longer be maintained. So, I thought it would be a good time to publish something for this.

----

## :book: What is Kerberos and NTLM

If you are wondering, what is NTLM? What is Kerberos? How do these help or hurt? This article goes into detail to explain the differences: \
[Difference between Kerberos and NTLM](https://www.geeksforgeeks.org/difference-between-kerberos-and-ntlm/)

----

## :exclamation: SCOM Reporting Installation Quirk

Something you need to take into account is that the SCOM installation for Reporting will overwrite the `rsreportserver.config` file and reverse any changes you may perform (which will set authentication back to NTLM). Which means you will need to apply the steps to change to Kerberos again **AFTER** SCOM Reporting Installation.

---

## :page_with_curl: How to change SSRS Authentication

### :memo: Manually change SSRS Authentication
- To change the report server authentication settings, edit the value in the `rsreportserver.config` file:
  ```
  C:\Program Files\Microsoft SQL Server Reporting Services\SSRS\ReportServer\rsreportserver.config
  ```

  Replace `RSWindowsNTLM` with `RSWindowsNegotiate` in the config file.

### :zap: Automatically change SSRS Authentication with PowerShell

- This script will allow you to automatically set the Authentication for SSRS to **Windows Negotiate** instead of **NTLM**:
  ```powershell
  $RS = "root\Microsoft\SqlServer\ReportServer\" + ((Get-CimInstance -Namespace 'root\Microsoft\SqlServer\ReportServer' -ClassName __Namespace).CimInstanceProperties).Value | Select-Object -First 1
  $RSV = $RS + "\" + (Get-CimInstance -Namespace $RS -ClassName __Namespace -ErrorAction Stop | Select-Object -First 1).Name + "\Admin"
  $RSInfo = Get-CimInstance -Namespace $RSV -ClassName MSReportServer_ConfigurationSetting -ErrorAction Stop
  (Get-Content ($RSInfo).PathName).Replace("<RSWindowsNTLM","<RSWindowsNegotiate") | Out-File ($RSInfo).PathName
  ```

---

## Set SSRS SPN's

Using RSWindowsNegotiate will result in a Kerberos authentication error if you configured the Report Server service to run under a domain user account and you did not register a Service Principal Name (SPN) for the account. For more information on SPN's for SSRS see: \
[Register a Service Principal Name (SPN) for a Report Server - SQL Server Reporting Services (SSRS) | Microsoft Learn](https://learn.microsoft.com/sql/reporting-services/report-server/register-a-service-principal-name-spn-for-a-report-server)

### :memo: Check SSRS SPN's

- The following command allows you to check the SPN's for the SSRS Server, you will need to replace the username with the service account running SSRS:
  ```
  setspn -l <domain>\<domain-user-account>
  ```

### :memo: Manually set SSRS SPN's

-The following command allows you to set the SPN's for the SSRS Server:
  ```
  setspn -s http/<computer-name>.<domain-name> <domain>\<domain-user-account>
  ```

### :zap: Automatically set SSRS SPN's

- The following script allows you to automatically set the SSRS SPN's:
  ```powershell
  $RS = "root\Microsoft\SqlServer\ReportServer\" + ((Get-CimInstance -Namespace 'root\Microsoft\SqlServer\ReportServer' -ClassName __Namespace).CimInstanceProperties).Value | Select-Object -First 1
  $RSV = $RS + "\" + (Get-CimInstance -Namespace $RS -ClassName __Namespace -ErrorAction Stop | Select-Object -First 1).Name + "\Admin"
  $RSInfo = Get-CimInstance -Namespace $RSV -ClassName MSReportServer_ConfigurationSetting -ErrorAction Stop

  # Get Computer FQDN
  $DNSComputerName = $env:COMPUTERNAME + '.' + (Get-CimInstance Win32_ComputerSystem).Domain

  # Set SSRS SPN
  $setspn = setspn -s "http/$DNSComputerName" "$($RSInfo.WindowsServiceIdentityActual)"

  if ($setspn -match "^Duplicate SPN found, aborting operation!$")
  {
      Write-Output "SPN is already set or duplicate SPN found."
  }

  # Check SSRS SPN
  setspn -l $RSInfo.WindowsServiceIdentityActual
  ```

### :memo: Restart SSRS Service

- The following command allows you to set the SPN's for the SSRS Server:
  ```powershell
  $RS = "root\Microsoft\SqlServer\ReportServer\" + ((Get-CimInstance -Namespace 'root\Microsoft\SqlServer\ReportServer' -ClassName __Namespace).CimInstanceProperties).Value | Select-Object -First 1
  $RSV = $RS + "\" + (Get-CimInstance -Namespace $RS -ClassName __Namespace -ErrorAction Stop | Select-Object -First 1).Name + "\Admin"
  $RSInfo = Get-CimInstance -Namespace $RSV -ClassName MSReportServer_ConfigurationSetting -ErrorAction Stop

  # Restart SSRS Service
  Restart-Service ($RSInfo).ServiceName
  ```


![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/how-to-change-reporting-to-use-kerberos-instead-of-ntlm/)

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.

Tip:
To add auto-size pictures:
![/assets/img/posts/example.jpg](/assets/img/posts/example.jpg){:class="img-fluid"}
-->
