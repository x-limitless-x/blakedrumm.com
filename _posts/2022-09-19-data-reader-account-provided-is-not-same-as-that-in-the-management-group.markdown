---
layout: post
title:  "Data Reader account provided is not same as that in the management group"
date:   '2022-09-19 15:16:32 -0500'
categories: troubleshooting operationsManager
author: blakedrumm
thumbnail: /assets/img/posts/opsmgr-setup-data-reader-account-issue.jpg

summary: >- # this means to ignore newlines
  From my colleauges, this post details how to resolve an issue you may experience while installing the Reporting Services.

keywords: data reader account error, scom setup error, scom setup reporting error, opsmgr reporting error
permalink: /blog/data-reader-account-provided-is-not-same-as-that-in-the-management-group/
---
During installation of SCOM Reporting services, you may see the following error:
Data Reader account provided is not same as that in the management group.


### Reconfigured the "Data Warehouse Report Deployment Account" Profile
Set the Data Warehouse Report Deployment Account to the Class "Collection Server" and "Data Warehouse Synchronization Server"

![/assets/img/posts/dw-report-deployment-account-profile.png](/assets/img/posts/dw-report-deployment-account-profile.png)

 
 
### Reconfigured the "Data Warehouse Account" Profile
Data Warehouse Action Account to the Class "Collection Server", "Data Warehouse Synchronization Server", "Data Set" and "Operations Manager APM Data Transfer Service"

![/assets/img/posts/data-warehouse-account-profile.jpg](/assets/img/posts/data-warehouse-account-profile.jpg)


 After configuring the above, the SCOM Reporting component installed successfully with the **Data Warehouse Report Deployment Account** as expected.


![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/data-reader-account-provided-is-not-same-as-that-in-the-management-group/)

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.
-->
