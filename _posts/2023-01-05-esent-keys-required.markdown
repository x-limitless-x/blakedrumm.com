---
layout: post
title:  "SCOM Agent Installation Error - Microsoft ESENT Keys are required"
date:   '2023-01-05 13:12:42 -0500'
categories: troubleshooting guides operationsManager
author: blakedrumm
thumbnail: /assets/img/scom-agent-esent-error.png
toc: true

summary: >- # this means to ignore newlines
  This article shows how to resolve an warning for Microsoft ESENT Keys being required, which you may receive when installing the SCOM Agent.

keywords: resolve esent keys error, microsoft esent keys, scom agent error esent, installation error esent keys
permalink: /blog/esent-keys-required/
---

## :book: Introduction
I had a case recently for a customer that is having issues when installing an SCOM Agent (***MOMAgent.msi***) with an warning which stated:
```
Microsoft ESENT Keys are required to install this application.
Please see the release notes for more information.
```

## :page_with_curl: How to fix
In order to resolve this issue for my customer, we had to run the installer as administrator. Which we accomplished by opening a Powershell window as administrator and navigating to the directory of the SCOM Agent installer (***MOMAgent.msi***).

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/esent-keys-required/)

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.

Tip:
To add auto-size pictures:
![/assets/img/posts/example.jpg](/assets/img/posts/example.jpg){:class="img-fluid"}
-->
