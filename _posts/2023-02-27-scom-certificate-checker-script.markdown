---
layout: post
title:  "SCOM Certificate Checker Script"
date:   '2023-02-27 20:02:10 -0500'
categories: troubleshooting guides operationsManager powershell
author: blakedrumm
thumbnail: /assets/img/posts/scom-certificate-script.png
toc: true

summary: >- # this means to ignore newlines
  This article shows how to use the Operations Manager Certificate Checker powershell script for Management Servers, Gateways, and Agents.

keywords: scom certificate checker, scom cert checker, check scom cert, operations manager certificate, opsmgr cert, opsmgr certificate checker, check certificate powershell
permalink: /blog/scom-certificate-checker-script/
---

## :book: Introduction
This tool will allow you to check your SCOM Certificate. It is very efficient and has been improved upon over time. You may edit line `751` to allow you to change what happens when you run it from Powershell ISE.

## :page_with_curl: Where to get it
[Start-SCOMCertificateChecker.ps1](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/blob/master/Powershell/Start-SCOMCertificateChecker.ps1) :arrow_left: **Direct Download Link** \
_or_ \
[Personal File Server - Start-SCOMCertificateChecker.ps1](https://files.blakedrumm.com/Start-SCOMCertificateChecker.ps1) :arrow_left: **Alternative Download Link** \
_or_ \
[Personal File Server - Start-SCOMCertificateChecker.txt](https://files.blakedrumm.com/Start-SCOMCertificateChecker.txt) :arrow_left: **Text Format Alternative Download Link**

## :question: Examples
>#### Example 1
>   Check All Certificates on 4 Servers and outputting the results to C:\Temp\Output.txt:
>   ```powershell
>   PS C:\> .\Invoke-CheckSCOMCertificates.ps1 -Servers ManagementServer1, ManagementServer2.contoso.com, Gateway.contoso.com, Agent1.contoso.com -All -OutputFile C:\Temp\Output.txt
>   ```
>#### Example 2
>   Check for a specific Certificate serialnumber in the Local Machine Personal Certificate store:
>   ```powershell
>   PS C:\> .\Invoke-CheckSCOMCertificates.ps1 -SerialNumber 1f00000008c694dac94bcfdc4a000000000008
>   ```
>#### Example 3
>   Check all certificates on the local machine:
>   ```powershell
>   PS C:\> .\Invoke-CheckSCOMCertificates.ps1 -All
>   ```


![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/scom-certificate-checker-script/)

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.

Tip:
To add auto-size pictures:
![/assets/img/posts/example.jpg](/assets/img/posts/example.jpg){:class="img-fluid"}
-->
