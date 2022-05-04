---
layout: post
date: 2022-04-22 13:28:58 -0500
title: Verify Assemblies are loaded with GACUtil-(copy)
categories: troubleshooting guides
author: blakedrumm
thumbnail: "/assets/img/posts/gacutil-check.png"
summary: 'I recently needed a customer to check the output of the .NET tool gacutil,
  so we could verify that all required assemblies were present. This guide details
  how to check GACUtil with the .NET Framework Developer pack. '
keywords: scom, gacutil, operationsmanager, SCOM 2019, dot net, Global Assembly Cache
permalink: "/blog/verify-assemblies-loaded-with-gacutil/"

---
## What is GAC?

Each computer where the Common Language Runtime is installed has a machine-wide code cache called the Global Assembly Cache. The Global Assembly Cache stores assemblies specifically designated to be shared by several applications on the computer. More information can be found here: [https://docs.microsoft.com/dotnet/framework/app-domains/gac](https://docs.microsoft.com/dotnet/framework/app-domains/gac)

## Prerequisites
Download and install the **.NET 4.8 Framework Developer Pack** on the affected machine: [https://dotnet.microsoft.com/download/dotnet-framework/net48](https://dotnet.microsoft.com/download/dotnet-framework/net48)

## Check the currently installed Assemblies
1. Open a ***Powershell*** or ***Command Prompt*** as **Administrator**
2. Navigate to the installation directory: \
    `cd "C:\Program Files (x86)\Microsoft SDKs\Windows\v10.0A\bin\NETFX 4.8 Tools"`
3. Run this GACUtil Command to List the Assemblies installed: \
    **Powershell:**
    ```powershell
    .\gacutil /L
    ```
    **Command Prompt:**
    ```
    gacutil /L
    ```


![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/verify-assemblies-loaded-with-gacutil/)

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
-->