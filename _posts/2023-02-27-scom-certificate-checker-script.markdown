---
layout: post
title:  "SCOM Certificate Checker Script"
date:   '2023-02-27 20:02:10 -0500'
categories: troubleshooting guides operationsManager powershell certificates
author: blakedrumm
thumbnail: /assets/img/posts/scom-certificate-script.png
toc: true

summary: >- # this means to ignore newlines
  This article shows how to use the Operations Manager Certificate Checker powershell script for Management Servers, Gateways, and Agents.

keywords: scom certificate checker, scom cert checker, check scom cert, operations manager certificate, opsmgr cert, opsmgr certificate checker, check certificate powershell
permalink: /blog/scom-certificate-checker-script/
---

## :book: Introduction
This tool will allow you to check your SCOM Certificate. It is very efficient and has been improved upon over time. You may edit line `751` to allow you to change what happens when you run from Powershell ISE. Copying and pasting the script to Powershell ISE after you run MOMCertImport on a certificate is the most common way to run the script, which requires no arguments or modifications. Just run the script and you will see where the issue may be.

## :memo: Authors
- Tyson Paul (***https://monitoringguys.com/***)
- Lincoln Atkinson (***https://latkin.org/blog/***)
- Mike Kallhoff
- Blake Drumm (***https://blakedrumm.com/***)

## :page_with_curl: Where to get it
[Start-SCOMCertificateChecker.ps1](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/blob/master/Powershell/Start-SCOMCertificateChecker.ps1) :arrow_left: **Direct Download Link** \
_or_ \
[Personal File Server - Start-SCOMCertificateChecker.ps1](https://files.blakedrumm.com/Start-SCOMCertificateChecker.ps1) :arrow_left: **Alternative Download Link** \
_or_ \
[Personal File Server - Start-SCOMCertificateChecker.txt](https://files.blakedrumm.com/Start-SCOMCertificateChecker.txt) :arrow_left: **Text Format Alternative Download Link**

Argument&nbsp;List&nbsp;|Description&nbsp;|
------------- | ----------- |
-All&nbsp;|Check&nbsp;All&nbsp;Certificates&nbsp;in&nbsp;Local&nbsp;Machine&nbsp;Store.&nbsp;|
-Servers&nbsp;|Each&nbsp;Server&nbsp;you&nbsp;want&nbsp;to&nbsp;Check&nbsp;SCOM&nbsp;Certificates&nbsp;on.&nbsp;|
-SerialNumber&nbsp;|Check&nbsp;a&nbsp;specific&nbsp;Certificate&nbsp;serial&nbsp;number&nbsp;in&nbsp;the&nbsp;Local&nbsp;Machine&nbsp;Personal&nbsp;Store.&nbsp;Not&nbsp;reversed.&nbsp;|
-OutputFile&nbsp;|Where&nbsp;to&nbsp;Output&nbsp;the&nbsp;File&nbsp;(txt,&nbsp;log,&nbsp;etc)&nbsp;for&nbsp;Script&nbsp;Execution.&nbsp;|
{: .table .table-hover .table-text .d-block .overflow-auto }


## :question: Examples
>#### Example 1
>   Check the certificate you have currently configured for SCOM on the local machine:
>   ```powershell
>   PS C:\> .\Start-SCOMCertificateChecker.ps1
>   ```
>#### Example 2
>   Check for a specific Certificate Serial number in the Local Machine Personal Certificate store:
>   ```powershell
>   PS C:\> .\Start-SCOMCertificateChecker.ps1 -SerialNumber 1f00000008c694dac94bcfdc4a000000000008
>   ```
>#### Example 3
>   Check all certificates on the local machine:
>   ```powershell
>   PS C:\> .\Start-SCOMCertificateChecker.ps1 -All
>   ```
>#### Example 4
>   Check All Certificates on 4 Servers and outputting the results to C:\Temp\Output.txt:
>   ```powershell
>   PS C:\> .\Start-SCOMCertificateChecker.ps1 -Servers ManagementServer1, ManagementServer2.contoso.com, Gateway.contoso.com, Agent1.contoso.com -All -OutputFile C:\Temp\Output.txt
>   ```

## Example of Failure

![Picture of an example of the script failing](/assets/img/posts/example-of-failure-scom-cert-checker.png){:class="img-fluid"}


![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/scom-certificate-checker-script/)

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.

Tip:
To add auto-size pictures:
![/assets/img/posts/example.jpg](/assets/img/posts/example.jpg){:class="img-fluid"}
-->
