---
layout: post
title:  "SCOM Unix/Linux RunAs Account View - System.Xml.XmlException"
date:   '2022-02-01 16:45:21 -0500'
categories: troubleshooting operationsManager linux
author: blakedrumm
thumbnail: /assets/img/posts/unix-linux-runas-accounts-missing.png
toc: true

summary: 'Are you able to open the Unix / Linux RunAs Account List view, but it is empty? You also may be experiencing an issue with an intermittent XML Exception. This article may help you resolve this!'

keywords: scom unix linux, scom unix runas accounts, scom runas account, unix linux runas account view error, linux error runas accounts, scom runas account view error
permalink: /blog/scom-unix-linux-runasaccount-view-error/
---
 
I received a case today for a customer who is having issues when attempting to open the RunAs Account view for Unix/Linux RunAs Accounts in the SCOM Console (__Administration Tab-> Run As Configuration -> Unix/Linux Accounts__). We were unable to return any Unix/Linux RunAs Accounts in the SCOM Console, even though we can create new ones, they are not populating in the list of RunAs Accounts for Unix/Linux.

We noticed an exception that will pop-up intermittently (while Console is idle or active):

## Pop-Up Exception
   <pre>
   __Date:__ 2/1/2022 1:29:19 PM 
   __Application:__ Operations Manager 
   __Application Version:__ 10.19.10505.0 
   __Severity:__ Error 
   __Message:__ 
   System.Xml.XmlException: Data at the root level is invalid. Line 1, position 1. 
   at System.Xml.XmlTextReaderImpl.Throw(Exception e) 
   at System.Xml.XmlTextReaderImpl.ParseRootLevelWhitespace() 
   at System.Xml.XmlTextReaderImpl.ParseDocumentContent() 
   at System.Xml.XmlLoader.Load(XmlDocument doc, XmlReader reader, Boolean preserveWhitespace) 
   at System.Xml.XmlDocument.Load(XmlReader reader) 
   at System.Xml.XmlDocument.LoadXml(String xml)  
   at Microsoft.SystemCenter.CrossPlatform.ClientLibrary.CredentialManagement.Core.ScxRunAsAccountHelper. DeserializeToScxRunAsAccount(ScxCredentialRef credentialRef) 
   at System.Linq.Enumerable.WhereSelectListIterator\`2.MoveNext() 
   at System.Collections.Generic.List\`1..ctor(IEnumerable\`1 collection) 
   at System.Linq.Enumerable.ToList\[TSource](IEnumerable\`1 source)  
   at Microsoft.SystemCenter.CrossPlatform.ClientLibrary.CredentialManagement.Core.ScxRunAsAccountHelper. EnumerateScxRunAsAccount(IManagementGroupConnection managementGroupConnection) 
   at Microsoft.SystemCenter.CrossPlatform.UI.OM.Integration.Administration.ScxRunAsAccountInfoFactory.EnumerateScxRunAsAccount() 
   at Microsoft.SystemCenter.CrossPlatform.UI.OM.Integration.Administration.ScxRunAsAccountHelper.<span style="color:yellow">&lt;GetScxRunAsAccountInstances&gt;</span>b__6(Object sender, ConsoleJobEventArgs e) 
   at Microsoft.EnterpriseManagement.Mom.Internal.UI.Console.ConsoleJobExceptionHandler.ExecuteJob(IComponent component, EventHandler`1 job, Object sender, ConsoleJobEventArgs args)
   </pre>

## Full Exception
<pre>
DetailID = 4
Count: 1
Type: System.Xml.XmlException
Message: Data at the root level is invalid. Line 1, position 1.
Stack:
[HelperMethodFrame]
System.Xml.XmlTextReaderImpl.Throw(System.Exception)
System.Xml.XmlTextReaderImpl.ParseRootLevelWhitespace()
System.Xml.XmlTextReaderImpl.ParseDocumentContent()
System.Xml.XmlLoader.Load(System.Xml.XmlDocument, System.Xml.XmlReader, Boolean)
System.Xml.XmlDocument.Load(System.Xml.XmlReader)
System.Xml.XmlDocument.LoadXml(System.String)
Microsoft.SystemCenter.CrossPlatform.ClientLibrary.CredentialManagement.Core.ScxRunAsAccountHelper.DeserializeToScxRunAsAccount(Microsoft.SystemCenter.CrossPlatform.ClientLibrary.Common.SDKAbstraction.ScxCredentialRef)
System.Linq.Enumerable+WhereSelectListIterator`2[[System.__Canon, mscorlib],[System.__Canon, mscorlib]].MoveNext()
System.Collections.Generic.List`1[[System.__Canon, mscorlib]]..ctor(System.Collections.Generic.IEnumerable`1<System.__Canon>)
System.Linq.Enumerable.ToList[[System.__Canon, mscorlib]](System.Collections.Generic.IEnumerable`1<System.__Canon>)
Microsoft.SystemCenter.CrossPlatform.ClientLibrary.CredentialManagement.Core.ScxRunAsAccountHelper.EnumerateScxRunAsAccount(Microsoft.SystemCenter.CrossPlatform.ClientLibrary.Common.SDKAbstraction.IManagementGroupConnection)
Microsoft.SystemCenter.CrossPlatform.UI.OM.Integration.Administration.ScxRunAsAccountInfoFactory.EnumerateScxRunAsAccount()
Microsoft.SystemCenter.CrossPlatform.UI.OM.Integration.Administration.ScxRunAsAccountHelper.<GetScxRunAsAccountInstances>b__6(System.Object, Microsoft.EnterpriseManagement.ConsoleFramework.ConsoleJobEventArgs)
Microsoft.EnterpriseManagement.Mom.Internal.UI.Console.ConsoleJobExceptionHandler.ExecuteJob(System.ComponentModel.IComponent, System.EventHandler`1<Microsoft.EnterpriseManagement.ConsoleFramework.ConsoleJobEventArgs>, System.Object, Microsoft.EnterpriseManagement.ConsoleFramework.ConsoleJobEventArgs)
Microsoft.EnterpriseManagement.ConsoleFramework.ConsoleJobsService.RunJob(Microsoft.EnterpriseManagement.ConsoleFramework.ConsoleJobDescription)
Microsoft.EnterpriseManagement.ConsoleFramework.WindowJobsService.RunAsyncJobInThisThread(Microsoft.EnterpriseManagement.ConsoleFramework.ConsoleJobDescription)
Microsoft.EnterpriseManagement.ConsoleFramework.WindowJobsService.RunJob(Microsoft.EnterpriseManagement.ConsoleFramework.ConsoleJobDescription)
Microsoft.EnterpriseManagement.ConsoleFramework.WindowJobsService.RunJob(System.ComponentModel.IComponent, System.EventHandler`1<Microsoft.EnterpriseManagement.ConsoleFramework.ConsoleJobEventArgs>, System.EventHandler`1<Microsoft.EnterpriseManagement.ConsoleFramework.ConsoleJobErrorEventArgs>, System.Object[])
Microsoft.EnterpriseManagement.ConsoleFramework.WindowJobsService.RunJob(System.ComponentModel.IComponent, System.EventHandler`1<Microsoft.EnterpriseManagement.ConsoleFramework.ConsoleJobEventArgs>, System.Object[])
Microsoft.EnterpriseManagement.ConsoleFramework.ConsoleJobs.RunJob(System.ComponentModel.IComponent, System.EventHandler`1<Microsoft.EnterpriseManagement.ConsoleFramework.ConsoleJobEventArgs>, System.Object[])
Microsoft.SystemCenter.CrossPlatform.UI.OM.Integration.Administration.RunAsAccountQuery.DoQuery(System.String)
Microsoft.EnterpriseManagement.Mom.Internal.UI.Cache.Query`1[[System.__Canon, mscorlib]].DoQuery(System.String, System.Nullable`1<System.DateTime>)
Microsoft.EnterpriseManagement.Mom.Internal.UI.Cache.Query`1[[System.__Canon, mscorlib]].FullUpdateQuery(Microsoft.EnterpriseManagement.Mom.Internal.UI.Cache.CacheSession, Microsoft.EnterpriseManagement.Mom.Internal.UI.Cache.IndexTable ByRef, Boolean, System.DateTime)
Microsoft.EnterpriseManagement.Mom.Internal.UI.Cache.Query`1[[System.__Canon, mscorlib]].InternalSyncQuery(Microsoft.EnterpriseManagement.Mom.Internal.UI.Cache.CacheSession, Microsoft.EnterpriseManagement.Mom.Internal.UI.Cache.IndexTable, Microsoft.EnterpriseManagement.Mom.Internal.UI.Cache.UpdateReason, Microsoft.EnterpriseManagement.Mom.Internal.UI.Cache.UpdateType)
Microsoft.EnterpriseManagement.Mom.Internal.UI.Cache.Query`1[[System.__Canon, mscorlib]].InternalQuery(Microsoft.EnterpriseManagement.Mom.Internal.UI.Cache.CacheSession, Microsoft.EnterpriseManagement.Mom.Internal.UI.Cache.UpdateReason)
Microsoft.EnterpriseManagement.Mom.Internal.UI.Cache.Query`1[[System.__Canon, mscorlib]].TryDoQuery(Microsoft.EnterpriseManagement.Mom.Internal.UI.Cache.UpdateReason, Microsoft.EnterpriseManagement.Mom.Internal.UI.Cache.CacheSession)
Microsoft.EnterpriseManagement.Mom.Internal.UI.Console.ConsoleJobExceptionHandler.ExecuteJob(System.ComponentModel.IComponent, System.EventHandler`1<Microsoft.EnterpriseManagement.ConsoleFramework.ConsoleJobEventArgs>, System.Object, Microsoft.EnterpriseManagement.ConsoleFramework.ConsoleJobEventArgs)
Microsoft.EnterpriseManagement.ConsoleFramework.ConsoleJobsService.RunJob(Microsoft.EnterpriseManagement.ConsoleFramework.ConsoleJobDescription)
Microsoft.EnterpriseManagement.ConsoleFramework.WindowJobsService.RunAsyncJobInThisThread(Microsoft.EnterpriseManagement.ConsoleFramework.ConsoleJobDescription)
Microsoft.EnterpriseManagement.ConsoleFramework.WindowJobsService.RunJob(Microsoft.EnterpriseManagement.ConsoleFramework.ConsoleJobDescription)
Microsoft.EnterpriseManagement.ConsoleFramework.WindowJobsService.RunJob(System.ComponentModel.IComponent, System.EventHandler`1<Microsoft.EnterpriseManagement.ConsoleFramework.ConsoleJobEventArgs>, System.EventHandler`1<Microsoft.EnterpriseManagement.ConsoleFramework.ConsoleJobErrorEventArgs>, System.Object[])
Microsoft.EnterpriseManagement.ConsoleFramework.WindowJobsService.RunJob(System.ComponentModel.IComponent, System.EventHandler`1<Microsoft.EnterpriseManagement.ConsoleFramework.ConsoleJobEventArgs>, System.Object[])
Microsoft.EnterpriseManagement.Mom.Internal.UI.Cache.Query`1[[System.__Canon, mscorlib]].DoQuery(Microsoft.EnterpriseManagement.Mom.Internal.UI.Cache.UpdateReason, Microsoft.EnterpriseManagement.Mom.Internal.UI.Cache.CacheSession)
Microsoft.EnterpriseManagement.Mom.Internal.UI.Cache.QueryBase.Update(Microsoft.EnterpriseManagement.Mom.Internal.UI.Cache.UpdateReason, Microsoft.EnterpriseManagement.Mom.Internal.UI.Cache.CacheSession)
Microsoft.EnterpriseManagement.Mom.Internal.UI.Cache.DataCache.Polling()
System.Threading.ExecutionContext.RunInternal(System.Threading.ExecutionContext, System.Threading.ContextCallback, System.Object, Boolean)
System.Threading.ExecutionContext.Run(System.Threading.ExecutionContext, System.Threading.ContextCallback, System.Object, Boolean)
System.Threading.ExecutionContext.Run(System.Threading.ExecutionContext, System.Threading.ContextCallback, System.Object)
System.Threading.ThreadHelper.ThreadStart()
[GCFrame]
[DebuggerU2MCatchHandlerFrame]
</pre>

## How to Resolve
First we ran the following Powershell command output to gather RunAs Accounts related to Unix/Linux:
```powershell
Get-SCOMRunAsAccount | Where {$_.AccountType -like "SCX*"}
```

We compared the above output to the accounts we can choose in the RunAs Profile for Unix/Linux Action Account. We noticed an entry that was not in the `Get-SCOMRunAsAccount` command run above:
![Orphaned RunAs Accounts](/assets/img/posts/unix-linux-runas-accounts-orphaned.png){:class="img-fluid"}

I asked the customer if he is comfortable with removing the RunAs Account and re-adding the Account. He said this was fine, so we proceeded to remove the RunAs Account like this:
```powershell
Get-SCOMRunAsAccount | Where {$_.Name -eq "Test"} | Remove-SCOMRunAsAccount
```

# Conclusion
Removing the __Orphaned RunAs account__ allowed the Unix/Linux RunAs Account view to populate as intended. You can only remove these Orphaned RunAs accounts with the Powershell Commands: `Get-SCOMRunAsAccount` and `Remove-SCOMRunAsAccount`

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/scom-unix-linux-runasaccount-view-error/)

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.

Tip:
To add auto-size pictures:
![/assets/img/posts/example.jpg](/assets/img/posts/example.jpg){:class="img-fluid"}
-->
