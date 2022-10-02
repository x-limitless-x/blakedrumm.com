---
layout: post
date:   '2022-06-22 15:08:58 -0500'
title: "SCOM Unix/Linux Discovery Errors + How To Fix Them"
categories: troubleshooting guides linux operationsManager
author: blakedrumm
thumbnail: /assets/img/posts/unix-linux-discovery-wizard.png

summary: >- # this means to ignore newlines
  I had a case today that required an unusual fix so I figured I would post some items that may resolve 
  these Discovery Wizard errors while discovering a Linux Machine.

keywords: scom, unix linux discovery errors, operationsmanager, SCOM 2019, 
permalink: /blog/unix-linux-discovery-errors/
---
## Errors you may see

___

### Error Example 1
**DiscoveryResult.ErrorData type. Please file bug report - Parameter Name: s** \
When discovering a Unix/Linux machine, the wizard shows the machine as unmanageable in the discovery results with below error:
```
Unexpected DiscoveryResult.ErrorData type.  Please file bug report. 
ErrorData: System.ArgumentNullException 
Value cannot be null. 
Parameter name: s 
at System.Activities.WorkflowApplication.Invoke(Activity activity, IDictionary`2 inputs, WorkflowInstanceExtensionManager extensions, TimeSpan timeout) 
at System.Activities.WorkflowInvoker.Invoke(Activity workflow, IDictionary`2 inputs, TimeSpan timeout, WorkflowInstanceExtensionManager extensions) 
at Microsoft.SystemCenter.CrossPlatform.ClientActions.DefaultDiscovery.InvokeWorkflow(IManagedObject managementActionPoint, DiscoveryTargetEndpoint criteria, IInstallableAgents installableAgents) 
```

### How to Fix
Sometimes this can happen because WinHTTP proxy settings have been configured on the management servers in the Unix/Linux Resource Pool, and the agent which we are trying to discover is not included in the Bypass List 
  
Open a CMD prompt as Administrator on the management servers in the Unix/Linux Resource Pool and run the following command 
```
netsh winhttp show proxy
```
 
If there is a WinHTTP proxy server configured, add the FQDN for the server which we are trying to discover in the Bypass List by running the following command 
```
netsh winhttp set proxy proxy-server="<proxyserver:port>" bypass-list="*.ourdomain.com;*.yourdomain.com*;<serverFQDN>" 
```
 
Once the Bypass List has been configured, check if discovery of the agent is now successful

> ## Note
> You can disable WinHTTP Proxy by running the following command, this will remove a proxy server and configure **“Direct Access”**:
> ```
> netsh winhttp reset proxy
> ```

___

### Error Example 2
**DiscoveryResult.ErrorData type. Please file bug report - Parameter name: lhs** \
When discovering a Linux machine, the wizard shows the machine as unmanageable in the discovery results with below error:
```
Discovery not successful
Message: Unspecified failure
Details: Unexpected DiscoveryResult.ErrorData type. Please file bug report.
ErrorData: System.ArgumentNullException
Value cannot be null.
Parameter name: lhs
at System.Activities.WorkflowApplication.Invoke(Activity activity, IDictionary`2 inputs, WorkflowInstanceExtensionManager extensions, TimeSpan timeout)
at System.Activities.WorkflowInvoker.Invoke(Activity workflow, IDictionary`2 inputs, TimeSpan timeout, WorkflowInstanceExtensionManager extensions)
at Microsoft.SystemCenter.CrossPlatform.ClientActions.DefaultDiscovery.InvokeWorkflow(IManagedObject managementActionPoint, DiscoveryTargetEndpoint criteria, IInstallableAgents installableAgents)
```

### How to fix
Sometimes this can happen because of omsagent shell files in the installed kits folder. 
 
Navigate to the following directory in file explorer: \
`C:\Program Files\Microsoft System Center\Operations Manager\Server\AgentManagement\UnixAgents\DownloadedKits`
	
If there are omsagent files listed here, move them to a temporary directory outside of the SCOM files. 

![Example of how to fix](/assets/img/posts/unix-linux-discovery-example-fix.png){:class="img-fluid"}

Once they have been moved from the DownloadedKits folder, retry discovery and discovery should now succeed (or you should get a different error which would indicate additional troubleshooting is needed such as sudoers, connectivity, etc.)


![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/unix-linux-discovery-errors/)

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
