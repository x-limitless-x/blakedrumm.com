---
layout: post
date:   '2023-10-31 17:54:02 -0500'
title:  "SCOM Scheduled Reports Fail with PerfConnectionString Error"
categories: troubleshooting guides operationsManager
author: blakedrumm
thumbnail: /assets/img/posts/scom-reports-perfconnection-error.png
toc: true

summary: >-
  This article explains how to resolve the 'PerfConnectionString' error that occurs when running scheduled reports in SCOM 2016 or SCOM 2019.

keywords: scom, perfconnectionstring error, scheduled reports fail, scom 2016, scom 2019
permalink: /blog/scheduled-reports-perfconnection-error/
---

## :warning: Symptoms

In SCOM 2016 or SCOM 2019, scheduled reports fail to run. If you check report status by opening the Scheduled Reports view in the Operations Console, the status message says, “Default value or value provided for the report parameter 'PerfConnectionString' is not a valid value.”

Example screenshot: \
![Screenshot of issue](/assets/img/posts/scom-reports-perfconnection-error.png){:class="img-fluid"}

## :bulb: Cause

This can occur if the `<appSettings>` element is missing from the SQL Server Reporting Services (SSRS) configuration file.

By default, this configuration file is in the following folder on the SCOM Reporting server:

`C:\Program Files\Microsoft SQL Server Reporting Services\SSRS\ReportServer\bin\ReportingServicesService.exe.config`

The issue described in the Symptoms section occurs when the below element is missing from the configuration file:

   ```xml
   <appSettings>
   <add key="ManagementGroupId" value="management_group_GUID" />
   </appSettings>
   ```

## :wrench: Resolution

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
   <add key="ManagementGroupId" value="management_group_GUID" />
   </appSettings>
   ```

   In the above XML, replace `management_group_GUID` with the management group ID you obtained in Step 1.

   For example, the element will look like the following:

   ```xml
   <startup useLegacyV2RuntimeActivationPolicy="true">
   <supportedRuntime version="v4.0" />
   </startup>
   <appSettings>
   <add key="ManagementGroupId" value="7f263180-e7d2-9c12-a1cd-0c6c54a7341c" />
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
