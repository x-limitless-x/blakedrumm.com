---
layout: post
date:   '2022-06-08 23:05:45 -0500'
title: "Error while installing SCOM 2019 Reporting"
categories: guides operationsManager troubleshooting
author: blakedrumm
thumbnail: /assets/img/posts/reporting-error-scom-ssrs.png

summary: >- # this means to ignore newlines
  I have experienced many cases where SCOM Reporting would not install on a SCOM 2019 Management Group
  that has installed any Update Rollup installed. This issue started with SCOM 2019 UR1.

keywords: operations manager reporting, scom reporting install failure, scom reporting issue, opsmgr reporting install issue, opsmgr reporting
permalink: /blog/fix-install-bug-scom-2019-reporting/
---
## Issue Description
The issue I have seen is the following error message in the SCOM Reporting Services installer:
```
“Unable to connect to the Data Access service for this management server. Ensure the Data Access service is running and that the service, the management group, and setup are all the same version.”
```
The problem stems from an SCOM 2019 Update Rollup that was previously applied to the Management Server and this causes the SCOM Reporting Services to fail due to the Reporting Services installer expecting the RTM version to be present.

The regression was introduced in [Update Rollup 1 for System Center Operations Manager 2019 (KB4533415)](https://support.microsoft.com/en-us/topic/update-rollup-1-for-system-center-operations-manager-2019-kb4533415-e5ce3191-2403-684f-1980-43aa61b50cb6)

- The “Operations Manager Products” view in the Admin console did not update the Version column for the installed component version. This column now reflects the updated version of all the listed components.

## Solution
The following may resolve the above error for you:
1. Start by connecting to the Operations Manager database. **(Create a backup of your Databases prior to any direct edits)**
2. Get the current version of the Management Server you are connecting SSRS with note the version *(we will use this later to revert the changes to the DB)*

   ### Example:
	```sql
	-- SCOM 2019 RTM
	-- 10.19.10050.0

	-- SCOM 2019 UR1
	-- 10.19.10311.0

	-- SCOM 2019 UR1 - Hotfix for Alert Management
	-- 10.19.10349.0

	-- SCOM 2019 UR2
	-- 10.19.10407.0

	-- SCOM 2019 UR2 - Hotfix for Event Log Channel
	-- 10.19.10475.0

	-- SCOM 2019 UR3
	-- 10.19.10505.0

	-- SCOM 2019 UR3 - Hotfix for Web Console
	-- 10.19.10550.0

	-- SCOM 2019 UR3 - Hotfix Oct 2021
	-- 10.19.10552.0

	select
		PrincipalName,
		Version
	from MTV_HealthService
	where
		IsManagementServer = 1 and 
		PrincipalName = 'MS01-2019.contoso.com'
	```	
	![Example output for Management Server version SQL Query](/assets/img/posts/ssrs-example-1.png){:class="img-fluid"}
3. We will run the following query to update the Management Server to the RTM version of SCOM 2019 (*10.19.10050.0*):
   ### Example:
   ```sql
   update MTV_HealthService
   set Version = '10.19.10050.0'
   -- SCOM 2019 RTM
   where PrincipalName = 'MS01-2019.contoso.com'
   ```
4. Install the SCOM Reporting Services! :smiley:
5. After SCOM Reporting Services installs, you will need to revert the changes, run the following to return the version back to the version returned in step 1.
   ### Example:
   ```sql
   update MTV_HealthService
   set Version = '10.19.10552.0'
   -- SCOM 2019 UR3 - Hotfix Oct 2021
   where PrincipalName = 'MS01-2019.contoso.com'
	```

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=/blog/fix-install-bug-scom-2019-reporting/)

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
