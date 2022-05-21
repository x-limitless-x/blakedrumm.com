---
layout: post
date:   '2022-03-22 20:25:31 -0500'
title: "System Center Operations Manager - Data Warehouse Grooming Tool"
categories: powershell projects operationsManager
author: blakedrumm
thumbnail: /assets/img/scom-dw-grooming-tool.png

summary: >- # this means to ignore newlines
  This tool can analyze your Data Warehouse Grooming and see what is being stored and how much of your Data Warehouse is being filled with the related data. Free and open source GUI tool written in Powershell, with multiple ways of running the script: MSI, EXE, or source PS1.

keywords: scom dw grooming, opsmgr dw tool, scom dw tool, operations manager tool, powershell script for SCOM, powershell script
permalink: /blog/scom-dw-grooming-tool/
---
## Introduction

This tool can be used to modify the System Center Operations Manager Data Warehouse Grooming retention days, allows you to see grooming history, you can manually run grooming, and you may also export the current configuration so you can keep a backup of your settings. You have the option of reseting the values to Defaults for the typical data sets in the Data Warehouse.

## How to Use

You have multiple ways to run the SCOM DW Grooming GUI Tool:

1. Download and install the MSI: [MSI Download](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/raw/master/Powershell/SCOM-DW-Grooming/Installer%20(MSI)/SCOM-DW-GroomingGUI.msi)
2. Download and run the EXE: [EXE Downloads](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/tree/master/Powershell/SCOM-DW-Grooming/Executable%20(EXE))
3. Download or Copy the Powershell Script: [Powershell Script](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/blob/master/Powershell/SCOM-DW-Grooming/Source%20(PS1)/SCOM-DW-GroomingGUI.ps1)

You will need to provide the Data Warehouse DB Server Name or Address, and the Data Warehouse Database Name. The script may auto detect these variables from the local registry on the machine you are running the script. To get started, you will need to press the **Get Current Settings** button. This will allow the script to gather the information from the Data Warehouse database server. Once you make the changes you can save the change with **Set**.

This script will log some actions to the Application Event Log. Look for the Event Source: `SCOMDWTool`

## More Information

You will get prompted each time you run the script to accept the license agreement, unless you select do not ask me again, when you select this it will save a file to your ProgramData Directory: `C:\ProgramData\SCOM-DataWarehouseGUI-AgreedToLicense.log`

If you have any questions or concerns, please leave a comment and I will do my best to assist!

## Latest Version
**Version:** `1.0.5.3`

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/scom-dw-grooming-tool/)

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
